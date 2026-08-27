"""Generate featurizer_meta.json from the frozen v1 featured training set (AC-5).

Reads data/processed/featured/X_train.parquet (git ignored, local) and freezes the
three things the featurizer must not recompute at serving:

  - train_max:     the flow_bytes_s and flow_packets_s column max (the rate fill value)
  - feature_order: the 67 column names, in order
  - dtypes:        the per column dtype (int64 or float64)

The featurizer reads this artifact rather than hardcoding, so serving cannot silently
diverge from training (`foundation.md` Section 7 #5). The artifact IS committed (small,
frozen); the parquet it derives from is not. Run once, or if v1 ever changes (it should
not, the models are frozen):

    python system/ml-service/featurizer/extract_meta.py
"""

import json
from pathlib import Path

import pandas as pd

REPO = Path(__file__).resolve().parents[3]
FEATURED = REPO / "data" / "processed" / "featured" / "X_train.parquet"
OUT = Path(__file__).resolve().parent / "featurizer_meta.json"


def main() -> int:
    if not FEATURED.exists():
        print(f"[extract_meta] missing {FEATURED}")
        print("[extract_meta] the v1 featured parquet is git ignored and local; run where it exists.")
        return 2

    frame = pd.read_parquet(FEATURED)
    meta = {
        "schema_version": "1.0.0",
        "source": "data/processed/featured/X_train.parquet",
        "train_max": {
            "flow_bytes_s": float(frame["flow_bytes_s"].max()),
            "flow_packets_s": float(frame["flow_packets_s"].max()),
        },
        "feature_order": list(frame.columns),
        "dtypes": {col: str(dtype) for col, dtype in frame.dtypes.items()},
    }
    OUT.write_text(json.dumps(meta, indent=2) + "\n")

    ints = sum(1 for d in meta["dtypes"].values() if d == "int64")
    print(
        f"[extract_meta] wrote {OUT.name}: {len(meta['feature_order'])} columns "
        f"({ints} int64, {len(meta['dtypes']) - ints} float64), "
        f"train_max={meta['train_max']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
