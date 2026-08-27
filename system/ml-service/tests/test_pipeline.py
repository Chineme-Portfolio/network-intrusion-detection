"""The non-finite wire decode (spec 0002).

Capture encodes a non-finite feature float as a sentinel string so the flow record stays
valid JSON across the Python and JavaScript boundary. The ml-service decodes it back to a
real float before featurizing. This pins that round trip.
"""

import math

from app.pipeline import decode_non_finite


def test_sentinel_strings_decode_to_non_finite_floats():
    out = decode_non_finite({"flow_bytes_s": "Infinity", "flow_packets_s": "NaN", "neg": "-Infinity"})
    assert math.isinf(out["flow_bytes_s"]) and out["flow_bytes_s"] > 0
    assert math.isnan(out["flow_packets_s"])
    assert math.isinf(out["neg"]) and out["neg"] < 0


def test_finite_numbers_pass_through_untouched():
    payload = {"a": 5, "b": 3.2, "destination_port": 443}
    assert decode_non_finite(payload) == payload


def test_numeric_strings_become_floats():
    # every CICFlowMeter feature is numeric, so a string value is a stringified number
    assert decode_non_finite({"rate": "42.5"})["rate"] == 42.5
