"""Featurizer input contract and structural invariants (AC-4, AC-5).

Companion to test_parity.py (which proves value-exact parity on the golden fixture).
This suite pins the behaviours the fixture does not exercise directly:
  - validate first: a malformed flow errors, it is never silently classified,
  - the exactly one port bucket invariant across the IANA bin boundaries,
  - the frozen train max fill (an infinite rate is filled from the artifact, not recomputed),
  - the output shape and dtype contract, both read from featurizer_meta.json.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1]))  # system/ml-service

from featurizer.featurizer import Featurizer, _clean_name  # noqa: E402

FIXTURE = HERE / "golden_fixture.json"
META = HERE.parent / "featurizer_meta.json"

_FEAT = Featurizer(META)
_PORT_COLS = ["port_well_known", "port_registered", "port_ephemeral"]


@pytest.fixture
def base_raw() -> dict:
    """A real, valid raw flow (fixture row 0) with clean_name'd keys, safe to mutate.

    featurize re-cleans incoming keys, so passing already-clean keys is equivalent to
    the raw header form and lets a test target one feature by its canonical name.
    """
    raw = json.loads(FIXTURE.read_text())["rows"][0]["raw"]
    return {_clean_name(k): v for k, v in raw.items()}


# --- happy path + output contract (AC-4, AC-5) ---


def test_valid_flow_returns_one_row_of_67_frozen_columns(base_raw):
    # covers: AC-4, AC-5
    got = _FEAT.featurize(base_raw)
    assert list(got.columns) == _FEAT.feature_order
    assert len(got.columns) == 67
    assert len(got) == 1


def test_output_dtypes_match_the_frozen_artifact(base_raw):
    # covers: AC-5 (per-column dtypes come from featurizer_meta.json, not inferred at serving)
    got = _FEAT.featurize(base_raw)
    got_dtypes = {c: str(t) for c, t in got.dtypes.items()}
    assert got_dtypes == _FEAT.dtypes


def test_numeric_string_port_is_accepted_and_bucketed(base_raw):
    # covers: AC-4 (the coercion path: a valid numeric string port must not crash pd.cut)
    base_raw["destination_port"] = "443"  # 443 is well known (0..1023), not registered
    got = _FEAT.featurize(base_raw)
    assert got.at[0, "port_well_known"] == 1
    assert int(got[_PORT_COLS].sum(axis=1).iloc[0]) == 1


# --- exactly-one-bucket invariant across the IANA bin boundaries (AC-4) ---


@pytest.mark.parametrize(
    "port,expected_col",
    [
        (0, "port_well_known"),
        (1023, "port_well_known"),
        (1024, "port_registered"),
        (49151, "port_registered"),
        (49152, "port_ephemeral"),
        (65535, "port_ephemeral"),
    ],
)
def test_port_lands_in_exactly_one_bucket(base_raw, port, expected_col):
    # covers: AC-4 (02b IANA one-hot bucketing; exactly one bucket set, boundaries included)
    base_raw["destination_port"] = port
    got = _FEAT.featurize(base_raw)
    active = {c: int(got.at[0, c]) for c in _PORT_COLS}
    assert active[expected_col] == 1
    assert sum(active.values()) == 1, f"expected exactly one active bucket, got {active}"


# --- frozen train-max fill (AC-5, a key invariant) ---


@pytest.mark.parametrize("col", ["flow_bytes_s", "flow_packets_s"])
def test_infinite_rate_is_filled_from_frozen_train_max(base_raw, col):
    # covers: AC-5 (a +inf rate is filled with the artifact train_max, never recomputed at serving)
    base_raw[col] = float("inf")
    got = _FEAT.featurize(base_raw)
    assert got.at[0, col] == _FEAT.train_max[col]


# --- validate first: a malformed flow errors, it never classifies (AC-4) ---


def test_missing_required_field_is_rejected(base_raw):
    # covers: AC-4 (validate first)
    del base_raw["destination_port"]
    with pytest.raises(ValueError, match="missing or null required"):
        _FEAT.featurize(base_raw)


def test_null_required_field_is_rejected(base_raw):
    # covers: AC-4 (an explicit JSON null in a required field is missing, not a late cast crash)
    base_raw["destination_port"] = None
    with pytest.raises(ValueError, match="missing or null required"):
        _FEAT.featurize(base_raw)


@pytest.mark.parametrize("bad_port", [70000, -5, 80.5, "http", "8o"])
def test_out_of_range_or_non_integer_port_is_rejected(base_raw, bad_port):
    # covers: AC-4 (an out-of-range port would make pd.cut NaN, then an all-zero bucket row)
    base_raw["destination_port"] = bad_port
    with pytest.raises(ValueError, match="destination_port must be an integer"):
        _FEAT.featurize(base_raw)


def test_negative_flow_duration_is_rejected(base_raw):
    # covers: AC-4 (v1 dropped negative-duration flows)
    base_raw["flow_duration"] = -1
    with pytest.raises(ValueError, match="negative flow_duration"):
        _FEAT.featurize(base_raw)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-q"]))
