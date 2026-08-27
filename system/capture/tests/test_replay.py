"""CSV row to flow-record mapping (spec 0002 AC-1).

Pins the capture side of the contract: clean snake_case keys, the real Destination Port
carried through, non-finite rates encoded JSON-safe, the Label mapped to ground_truth and
kept out of the features, and a valid-JSON result (no bare Infinity/NaN on the wire).
"""

import json
import math

import numpy as np
import pandas as pd
import pytest

from main import clean_name, find_columns, json_safe, row_to_flow_record, synthesize_five_tuple


def test_clean_name_matches_the_featurizer_key_convention():
    assert clean_name(" Destination Port") == "destination_port"
    assert clean_name("Flow Bytes/s") == "flow_bytes_s"
    assert clean_name(" Label") == "label"


@pytest.mark.parametrize(
    "value,expected",
    [
        (np.int64(443), 443),
        (np.float64(3.25), 3.25),
        (80, 80),
        (float("inf"), "Infinity"),
        (float("-inf"), "-Infinity"),
    ],
)
def test_json_safe_encodes_natives_and_non_finite(value, expected):
    assert json_safe(value) == expected


def test_json_safe_nan_becomes_a_sentinel_string():
    assert json_safe(float("nan")) == "NaN"


def test_synthesize_five_tuple_is_valid_and_carries_the_port():
    tup = synthesize_five_tuple(5, 443)
    assert tup["dst_port"] == 443
    assert 0 <= tup["src_port"] <= 65535
    assert tup["protocol"] == 6
    assert tup["src_ip"] and tup["dst_ip"]


def test_row_to_flow_record_maps_cleanly():
    # covers: AC-1
    row = pd.Series(
        {
            " Destination Port": 80,
            " Flow Duration": 1200,
            "Flow Bytes/s": float("inf"),
            " Label": "DDoS",
        }
    )
    rec = row_to_flow_record(0, row, label_col=" Label", dport_col=" Destination Port")

    assert rec["dst_port"] == 80
    assert rec["features"]["destination_port"] == 80  # real port, clean key
    assert rec["features"]["flow_duration"] == 1200
    assert rec["features"]["flow_bytes_s"] == "Infinity"  # non-finite encoded JSON-safe
    assert "label" not in rec["features"]  # Label is ground_truth, not a feature
    assert rec["ground_truth"] == "DDoS"
    assert rec["schema_version"] == "1.0.0"
    assert rec["flow_id"]
    json.dumps(rec)  # must be valid JSON (no bare Infinity/NaN)


def test_row_to_flow_record_null_label_becomes_none():
    row = pd.Series({" Destination Port": 53, " Label": np.nan})
    rec = row_to_flow_record(1, row, label_col=" Label", dport_col=" Destination Port")
    assert rec["ground_truth"] is None


def test_find_columns_locates_label_and_port():
    label, dport = find_columns([" Destination Port", " Flow Duration", " Label"])
    assert label == " Label"
    assert dport == " Destination Port"


def test_find_columns_missing_label_raises():
    with pytest.raises(ValueError, match="Label"):
        find_columns([" Destination Port", " Flow Duration"])
