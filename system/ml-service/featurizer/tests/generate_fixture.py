"""Generate the golden fixture for the featurizer parity test (AC-6).

The featured half is the REAL frozen v1 output (`X_train.parquet`), so the fixture
checks the featurizer against actual training data, not a re-derivation. The pairing
between a raw flow and its featured row is done by CONTENT, not by row position:

  `02` leaves 55 of the 67 feature columns untouched (everything except the two rate
  columns, the seven clipped columns, and the three port one hots). Those 55 are byte
  identical between a raw flow and its featured row, so they identify the flow. We match
  each featured row to the one raw flow whose 55 untouched columns are identical.

This is order independent: it does not matter what order `glob` returns the raw CSVs in,
so regenerating on another machine cannot silently repoint a row to a different flow (the
failure mode the spec's Build plan step 5 warns about). A row that cannot be matched to
exactly one raw flow is skipped, not guessed. Writes golden_fixture.json (committed).

    python system/ml-service/featurizer/tests/generate_fixture.py
"""

import json
import re
from collections import defaultdict
from glob import glob
from pathlib import Path

import numpy as np
import pandas as pd

REPO = Path(__file__).resolve().parents[4]
RAW_GLOB = str(REPO / "data" / "raw" / "MachineLearningCVE" / "*.csv")
FEATURED = REPO / "data" / "processed" / "featured" / "X_train.parquet"
META = Path(__file__).resolve().parents[1] / "featurizer_meta.json"
OUT = Path(__file__).resolve().parent / "golden_fixture.json"

# The columns 02 transforms (so NOT byte identical raw to featured): rate, clip, port.
_RATE_COLS = ["flow_bytes_s", "flow_packets_s"]
_CLIP_COLS = [
    "flow_iat_min", "flow_iat_mean", "flow_iat_max", "fwd_iat_min",
    "fwd_header_length", "bwd_header_length", "min_seg_size_forward",
]
_PORT_COLS = ["port_well_known", "port_registered", "port_ephemeral"]


def clean_name(name: str) -> str:
    return re.sub(r"[^0-9a-zA-Z]+", "_", str(name).strip()).strip("_").lower()


def bucket_of(port: int) -> str:
    if 0 <= port <= 1023:
        return "port_well_known"
    if 1024 <= port <= 49151:
        return "port_registered"
    return "port_ephemeral"


def jsonable(d: dict) -> dict:
    out = {}
    for k, v in d.items():
        # to_dict('records') yields plain Python int/float, not numpy scalars, so match both.
        # bool is a subclass of int, so it must be checked first.
        if v is None:
            out[k] = None
        elif isinstance(v, (bool, np.bool_)):
            out[k] = bool(v)
        elif isinstance(v, (int, np.integer)):
            out[k] = int(v)
        elif isinstance(v, (float, np.floating)):
            out[k] = float(v)  # inf / nan preserved; written with allow_nan
        else:
            out[k] = str(v)
    return out


def main() -> int:
    if not FEATURED.exists():
        print(f"[fixture] missing {FEATURED}; the v1 data is git ignored and local.")
        return 2

    feature_order = json.loads(META.read_text())["feature_order"]
    transformed = set(_RATE_COLS) | set(_CLIP_COLS) | set(_PORT_COLS)
    passthrough = [c for c in feature_order if c not in transformed]  # 55 untouched columns

    raw = pd.concat((pd.read_csv(f) for f in glob(RAW_GLOB)), ignore_index=True)
    clean_map = {c: clean_name(c) for c in raw.columns}
    raw_clean = raw.rename(columns=clean_map)
    featured = pd.read_parquet(FEATURED).reset_index(drop=True)

    missing_cols = [c for c in passthrough if c not in raw_clean.columns]
    if missing_cols:
        raise KeyError(f"[fixture] raw data is missing passthrough columns: {missing_cols}")

    # Align dtypes so the fingerprint compares like with like, then hash each row.
    pt_dtypes = {c: str(featured[c].dtype) for c in passthrough}
    raw_pt = raw_clean[passthrough].astype(pt_dtypes)
    feat_pt = featured[passthrough]
    raw_hash = pd.util.hash_pandas_object(raw_pt, index=False).to_numpy()
    feat_hash = pd.util.hash_pandas_object(feat_pt, index=False).to_numpy()

    raw_by_hash: dict[int, list[int]] = defaultdict(list)
    for pos, h in enumerate(raw_hash):
        raw_by_hash[int(h)].append(pos)
    feat_by_hash: dict[int, list[int]] = defaultdict(list)
    for pos, h in enumerate(feat_hash):
        feat_by_hash[int(h)].append(pos)

    def raw_for_feat(fp: int) -> int | None:
        cands = [rp for rp in raw_by_hash.get(int(feat_hash[fp]), []) if raw_pt.iloc[rp].equals(feat_pt.iloc[fp])]
        return cands[0] if len(cands) == 1 else None

    def feat_for_raw(rp: int) -> int | None:
        cands = [fp for fp in feat_by_hash.get(int(raw_hash[rp]), []) if feat_pt.iloc[fp].equals(raw_pt.iloc[rp])]
        return cands[0] if len(cands) == 1 else None

    pairs: list[tuple[int, int]] = []  # (raw position, featured position)
    seen_feat: set[int] = set()

    def add_from_featured(mask: pd.Series, n: int) -> None:
        added = 0
        for fp in np.flatnonzero(mask.to_numpy()):
            if added >= n:
                break
            fp = int(fp)
            if fp in seen_feat:
                continue
            rp = raw_for_feat(fp)
            if rp is None:  # 0 matches (unexpected) or ambiguous: skip, never guess
                continue
            pairs.append((rp, fp))
            seen_feat.add(fp)
            added += 1

    # each port bucket, the rate fill (was +inf), the 0/0 zero rate, the init_win sentinel,
    # and some ordinary rows
    for col in _PORT_COLS:
        add_from_featured(featured[col] == 1, 3)
    add_from_featured(featured["flow_bytes_s"] == featured["flow_bytes_s"].max(), 3)
    add_from_featured(featured["flow_packets_s"] == featured["flow_packets_s"].max(), 2)
    add_from_featured(featured["flow_bytes_s"] == 0, 3)
    add_from_featured(featured["init_win_bytes_forward"] == -1, 3)
    add_from_featured(pd.Series(True, index=featured.index), 5)

    # clip coverage comes from the raw side: a raw clip column that is negative was clipped
    # to 0, so such a row exercises the clip step.
    for col in _CLIP_COLS:
        added = 0
        for rp in np.flatnonzero((raw_clean[col] < 0).to_numpy()):
            if added >= 2:
                break
            rp = int(rp)
            fp = feat_for_raw(rp)
            if fp is None or fp in seen_feat:
                continue
            pairs.append((rp, fp))
            seen_feat.add(fp)
            added += 1

    label_names = {"label", "label_binary", "label_text"}
    rows = []
    for rp, fp in pairs:
        # guard: the 55 untouched columns are identical (the match), and the untouched
        # destination_port lands in the featured row's one hot bucket
        if not raw_pt.iloc[rp].equals(feat_pt.iloc[fp]):
            raise AssertionError(f"[fixture] internal: passthrough mismatch at raw {rp}, featured {fp}")
        dport = int(float(raw_clean.iloc[rp]["destination_port"]))
        actual = [c for c in _PORT_COLS if int(featured.iloc[fp][c]) == 1]
        if actual != [bucket_of(dport)]:
            raise AssertionError(f"[fixture] port bucket disagrees at raw {rp}, featured {fp}")
        # Snapshot as records (a 1 row frame), which keeps each column's own dtype. A plain
        # .iloc[pos] row Series would upcast every value to string, because pandas 3.0 reads
        # the Label column as a pyarrow string and a mixed row promotes to that string dtype.
        raw_record = raw.iloc[[rp]].to_dict("records")[0]
        raw_row = {k: v for k, v in raw_record.items() if clean_map[k] not in label_names}
        expected = featured.iloc[[fp]].to_dict("records")[0]
        rows.append({"raw": jsonable(raw_row), "expected": jsonable(expected)})

    if len(rows) < 15:
        raise AssertionError(f"[fixture] only matched {len(rows)} rows; expected at least 15. Check the data.")

    OUT.write_text(
        json.dumps({"schema_version": "1.0.0", "source": "X_train.parquet", "rows": rows}, indent=2, allow_nan=True)
        + "\n"
    )
    print(f"[fixture] wrote {OUT.name}: {len(rows)} rows, paired by content (55 untouched columns).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
