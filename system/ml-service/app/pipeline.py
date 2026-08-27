"""One flow record to one verdict (AC-2, AC-3).

The single synchronous unit of work: decode, featurize (L0.3), classify, build the
verdict. The streaming loop and POST /predict both call it (in a threadpool, so this
blocking pandas + sklearn work never stalls the event loop, spec 0002).
"""

from __future__ import annotations

import time
from datetime import datetime, timezone

from caught_contracts.verdict import Verdict
from featurizer.featurizer import Featurizer

from .registry import LoadedModel, score_flow

SCHEMA_VERSION = "1.0.0"


def decode_non_finite(features: dict) -> dict:
    """Turn the wire's sentinel strings back into real floats before featurizing.

    Capture encodes a non-finite feature float ("Infinity" / "-Infinity" / "NaN") as a
    string so the flow record stays valid JSON across the Python and JavaScript boundary
    (a bare Infinity/NaN would break the backend's JSON.parse). Every CICFlowMeter
    feature is numeric, so any string value here is a stringified number: convert it back.
    """
    decoded = {}
    for key, value in features.items():
        if isinstance(value, str):
            try:
                decoded[key] = float(value)
            except ValueError:
                decoded[key] = value  # not a number (unexpected for a feature); leave it
        else:
            decoded[key] = value
    return decoded


def _now_iso() -> str:
    # ISO 8601 with a trailing Z, matching the verdict contract's date-time format.
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def flow_to_verdict(flow: dict, featurizer: Featurizer, model: LoadedModel) -> dict:
    """Featurize + classify one flow record, return a contract-valid verdict dict.

    Raises ValueError if the featurizer rejects the flow (a malformed or out of range
    feature); the caller logs and skips it, it is never classified silently.
    """
    features = decode_non_finite(flow["features"])
    frame = featurizer.featurize(features)  # raises ValueError on a malformed flow

    # Measure only the inference (classification), which is what latency_ms means (AC-3).
    started = time.perf_counter()
    verdict, score, score_kind = score_flow(model, frame)
    latency_ms = (time.perf_counter() - started) * 1000.0

    payload = {
        "schema_version": SCHEMA_VERSION,
        "flow_id": flow["flow_id"],
        "model_id": model.model_id,
        "verdict": verdict,
        "score": score,
        "score_kind": score_kind,
        "latency_ms": round(latency_ms, 3),
        "ts": _now_iso(),
        "ground_truth": flow.get("ground_truth"),
    }
    # Prove the emitted verdict conforms to the shared contract before it goes on the wire
    # (the ml-service is the verdict's author; a nonconforming verdict is a bug, not data).
    Verdict.model_validate(payload)
    return payload
