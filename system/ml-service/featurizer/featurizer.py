"""Serving time featurizer (AC-4).

One raw CICFlowMeter flow becomes the exact 67 feature vector the v1 models consume.
A faithful port of notebooks `02` (row local cleaning) and `02b` (IANA port bucketing),
reusing the frozen train max, column order, and dtypes from `featurizer_meta.json`
(never recomputed at serving, `foundation.md` Section 7 #5). Parity is proven by a
golden fixture test (`tests/test_parity.py`, AC-6).

Only the ml-service imports this (`architecture.md` boundaries). It stays a faithful
port, not a cleaner rewrite: the point is that training and serving cannot drift.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import numpy as np
import pandas as pd

# --- frozen v1 transform constants, ported verbatim from the notebooks ---

# 02 step 4: the 13 redundant or constant columns dropped (names after clean_name).
_DROP_COLS = [
    "bwd_psh_flags",
    "bwd_urg_flags",
    "fwd_avg_bytes_bulk",
    "fwd_avg_packets_bulk",
    "fwd_avg_bulk_rate",
    "bwd_avg_bytes_bulk",
    "bwd_avg_packets_bulk",
    "bwd_avg_bulk_rate",
    "subflow_fwd_packets",
    "subflow_bwd_packets",
    "syn_flag_count",
    "cwe_flag_count",
    "fwd_header_length_1",
]

# 02 step 5b: impossible negatives clipped to 0. The init_win_bytes_* -1 sentinels
# are deliberately NOT in this list, so they pass through untouched.
_CLIP_COLS = [
    "flow_iat_min",
    "flow_iat_mean",
    "flow_iat_max",
    "fwd_iat_min",
    "fwd_header_length",
    "bwd_header_length",
    "min_seg_size_forward",
]

_RATE_COLS = ["flow_bytes_s", "flow_packets_s"]

# 02b: IANA port buckets, one hot. Same bins and labels as exp_port_buckets / 02b.
_PORT_BINS = [-1, 1023, 49151, 65535]
_PORT_LABELS = ["well_known", "registered", "ephemeral"]
_PORT_COLS = [f"port_{label}" for label in _PORT_LABELS]

_DEFAULT_META = Path(__file__).resolve().parent / "featurizer_meta.json"


def _clean_name(name: str) -> str:
    # 02 step 1: strip, lowercase, collapse any run of non alphanumerics to a single _.
    return re.sub(r"[^0-9a-zA-Z]+", "_", str(name).strip()).strip("_").lower()


class Featurizer:
    """Loads the frozen artifact once, then featurizes flows against it.

    K1 constructs this a single time at ml-service startup and reuses it per flow.
    """

    def __init__(self, meta_path: str | Path | None = None) -> None:
        meta = json.loads(Path(meta_path or _DEFAULT_META).read_text())
        self.train_max: dict[str, float] = meta["train_max"]
        self.feature_order: list[str] = meta["feature_order"]
        self.dtypes: dict[str, str] = meta["dtypes"]
        # Required raw inputs (after clean_name): every non port feature, plus
        # destination_port (which becomes the three port_* one hot columns).
        self._required = [c for c in self.feature_order if not c.startswith("port_")]
        self._required.append("destination_port")

    def featurize(self, raw: dict) -> pd.DataFrame:
        """One raw flow (the flow record `features` object) to a 1 row, 67 column frame."""
        # 02 step 1: clean_name the incoming keys (robust to raw headers or snake_case).
        row = {_clean_name(k): v for k, v in raw.items()}
        self._validate(row)
        # Validation confirmed destination_port is a whole number in range. Coerce it to a
        # real int now, so pd.cut (and every numeric step) never sees a numeric string like
        # "80", which would otherwise pass validation and then crash pd.cut with a TypeError.
        row["destination_port"] = int(float(row["destination_port"]))
        frame = pd.DataFrame([row])

        # 02 step 3: flow_bytes_s 0/0 -> 0, then mark +/- inf on both rate cols as NaN.
        frame["flow_bytes_s"] = frame["flow_bytes_s"].fillna(0)
        frame[_RATE_COLS] = frame[_RATE_COLS].replace([np.inf, -np.inf], np.nan)

        # 02 step 4: drop the 13 redundant / constant columns.
        frame = frame.drop(columns=_DROP_COLS, errors="ignore")

        # 02 step 5b: clip the impossible negatives (init_win -1 sentinels untouched).
        frame[_CLIP_COLS] = frame[_CLIP_COLS].clip(lower=0)

        # 02 step 7: fill the marked rate NaNs with the FROZEN train max (from the artifact),
        # never a value recomputed at serving.
        frame[_RATE_COLS] = frame[_RATE_COLS].fillna(self.train_max)

        # 02b: IANA port buckets, one hot, then drop destination_port.
        buckets = pd.cut(frame["destination_port"], bins=_PORT_BINS, labels=_PORT_LABELS)
        onehot = pd.get_dummies(buckets, prefix="port").astype(int)
        frame = frame.drop(columns=["destination_port"]).join(onehot)

        # A bucket the row is not in still needs its column present (belt and braces:
        # pd.cut keeps all three categories, so get_dummies already emits all three).
        for col in _PORT_COLS:
            if col not in frame.columns:
                frame[col] = 0

        # Exact column order and dtypes from the artifact: the invariant that makes
        # serving match training (spec 0001 key invariants). Guard first: reindex would
        # silently manufacture an all NaN column for any feature_order name not present,
        # and for a float column NaN casts cleanly, so a future drift between the drop /
        # clip lists, the artifact, and _required could pass unnoticed. Fail loudly instead.
        absent = [c for c in self.feature_order if c not in frame.columns]
        if absent:
            raise ValueError(f"[featurizer] internal error: columns missing before reindex: {absent}")
        frame = frame.reindex(columns=self.feature_order)
        return frame.astype(self.dtypes)

    def _validate(self, row: dict) -> None:
        """Reject a malformed flow with a clear error, never classify it silently.

        A missing field, an out of range port (pd.cut would yield NaN then an all zero
        bucket row, silently breaking the exactly one bucket invariant), or a negative
        duration (v1 dropped these) all fail here.
        """
        # An absent key AND an explicit null both count as missing: a required field set to
        # null (JSON null) must be rejected here, not crash later during the dtype cast.
        missing = [c for c in self._required if row.get(c) is None]
        if missing:
            raise ValueError(f"[featurizer] missing or null required raw fields: {missing}")

        port = row["destination_port"]
        try:
            port_ok = float(port).is_integer() and 0 <= int(port) <= 65535
        except (TypeError, ValueError):
            port_ok = False
        if not port_ok:
            raise ValueError(
                f"[featurizer] destination_port must be an integer in 0..65535, got {port!r}"
            )

        duration = row.get("flow_duration")
        if duration is not None and float(duration) < 0:
            raise ValueError(
                f"[featurizer] negative flow_duration (v1 dropped these), got {duration!r}"
            )


_default: Featurizer | None = None


def featurize(raw: dict, meta_path: str | Path | None = None) -> pd.DataFrame:
    """Convenience wrapper. Reuses one default Featurizer unless a meta_path is given."""
    global _default
    if meta_path is not None:
        return Featurizer(meta_path).featurize(raw)
    if _default is None:
        _default = Featurizer()
    return _default.featurize(raw)
