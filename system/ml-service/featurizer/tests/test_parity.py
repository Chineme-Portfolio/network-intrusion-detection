"""Featurizer parity suite (AC-4, AC-6).

Asserts featurize(raw_i) reproduces the frozen v1 featured row exactly for every
golden fixture row: matching columns, order, dtypes, and values, dtype strict (so
3 and 3.0 differ). Runs against the committed golden_fixture.json, so it needs no
git ignored data. Any drift fails loudly, this is the guard that keeps the serving
featurizer honest against training.

    pytest system/ml-service/featurizer/tests/test_parity.py -q   # or: python test_parity.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pandas as pd
import pytest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1]))  # system/ml-service, so `import featurizer` works

from featurizer import Featurizer  # noqa: E402

FIXTURE = HERE / "golden_fixture.json"
META = HERE.parent / "featurizer_meta.json"

_ROWS = json.loads(FIXTURE.read_text())["rows"]
_FEAT = Featurizer(META)


def _cell_eq(a, b) -> bool:
    """Exact, NaN aware cell equality: NaN equals NaN, otherwise strict ==."""
    if pd.isna(a) and pd.isna(b):
        return True
    return bool(a == b)


@pytest.mark.parametrize("row", _ROWS, ids=[f"row{i}" for i in range(len(_ROWS))])
def test_featurize_reproduces_frozen_v1(row):
    # covers: AC-4 (the exact 67 feature vector), AC-6 (parity, dtype strict, fails on drift)
    order = _FEAT.feature_order
    dtypes = _FEAT.dtypes

    got = _FEAT.featurize(row["raw"]).reset_index(drop=True)
    expected = (
        pd.DataFrame([row["expected"]]).reindex(columns=order).astype(dtypes).reset_index(drop=True)
    )

    assert list(got.columns) == order, "column names or order differ from frozen feature_order"
    assert (
        got.dtypes.astype(str).tolist() == expected.dtypes.astype(str).tolist()
    ), "dtype drift from frozen v1"

    drifted = [c for c in order if not _cell_eq(got.at[0, c], expected.at[0, c])]
    assert not drifted, "value drift in " + "; ".join(
        f"{c}: got {got.at[0, c]!r} exp {expected.at[0, c]!r}" for c in drifted[:5]
    )


def test_fixture_is_nonempty_and_full_width():
    # Guards against a mis-generated fixture making the parametrized parity vacuously pass.
    assert len(_ROWS) >= 25, f"golden fixture unexpectedly small ({len(_ROWS)} rows)"
    assert len(_FEAT.feature_order) == 67
    assert all(len(r["expected"]) == 67 for r in _ROWS)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-q"]))
