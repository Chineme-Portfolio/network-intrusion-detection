"""Contract validation suite, Python side (AC-2, AC-3).

Proves the generated Pydantic v2 models accept each sample payload and reject the
malformed ones: a missing required field, a value outside an enum, a number outside
its 0..1 range, a port outside 0..65535, and an empty models array. This is the
runtime half of the two language contract check; the compile time half is the tsc
type check in codegen/typescript/test-contracts.ts.

The generated models are git ignored, so run codegen once first:

    bash system/shared/codegen/generate.sh
    pytest system/shared/codegen/python/tests/test_contracts.py -q
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

SHARED = Path(__file__).resolve().parents[3]  # system/shared
GENERATED = SHARED / "generated" / "python"
SAMPLES = SHARED / "samples"

sys.path.insert(0, str(GENERATED))

try:
    from pydantic import ValidationError
    from caught_contracts.flow_record import FlowRecord
    from caught_contracts.registry_manifest import RegistryManifest
    from caught_contracts.verdict import Verdict
except ModuleNotFoundError as exc:  # generated models absent
    pytest.skip(
        f"generated contract models absent ({exc}); run codegen first: "
        "bash system/shared/codegen/generate.sh",
        allow_module_level=True,
    )


def load(name: str) -> dict:
    return json.loads((SAMPLES / name).read_text())


# --- every sample validates against its generated model (AC-2, AC-3) ---


@pytest.mark.parametrize(
    "model,sample",
    [
        (FlowRecord, "flow-record.sample.json"),
        (Verdict, "verdict.sample.json"),
        (RegistryManifest, "registry-manifest.sample.json"),
    ],
    ids=["flow-record", "verdict", "registry-manifest"],
)
def test_sample_payload_validates(model, sample):
    # covers: AC-2 (a sample payload validates), AC-3 (the fields from the design)
    model.model_validate(load(sample))  # must not raise


# --- a payload missing a required field is rejected (AC-2) ---


def test_verdict_missing_score_kind_is_rejected():
    # covers: AC-2 (the canonical example from the spec)
    payload = load("verdict.sample.json")
    del payload["score_kind"]
    with pytest.raises(ValidationError):
        Verdict.model_validate(payload)


def test_flow_record_missing_flow_id_is_rejected():
    # covers: AC-2
    payload = load("flow-record.sample.json")
    del payload["flow_id"]
    with pytest.raises(ValidationError):
        FlowRecord.model_validate(payload)


def test_flow_record_missing_features_destination_port_is_rejected():
    # covers: AC-3 (features.destination_port is required so the featurizer can bucket)
    payload = load("flow-record.sample.json")
    payload["features"].pop("destination_port", None)
    with pytest.raises(ValidationError):
        FlowRecord.model_validate(payload)


def test_manifest_model_missing_metrics_is_rejected():
    # covers: AC-2, AC-3 (each model carries the v1 metrics)
    payload = load("registry-manifest.sample.json")
    del payload["models"][0]["metrics"]
    with pytest.raises(ValidationError):
        RegistryManifest.model_validate(payload)


# --- a payload violating a field constraint is rejected (AC-3) ---


def test_verdict_out_of_enum_is_rejected():
    # covers: AC-3 (verdict is benign | malicious)
    payload = load("verdict.sample.json")
    payload["verdict"] = "suspicious"
    with pytest.raises(ValidationError):
        Verdict.model_validate(payload)


def test_verdict_score_above_one_is_rejected():
    # covers: AC-3 (score is a number 0..1)
    payload = load("verdict.sample.json")
    payload["score"] = 1.5
    with pytest.raises(ValidationError):
        Verdict.model_validate(payload)


def test_flow_record_dst_port_out_of_range_is_rejected():
    # covers: AC-3 (the 5 tuple ports are 0..65535)
    payload = load("flow-record.sample.json")
    payload["dst_port"] = 70000
    with pytest.raises(ValidationError):
        FlowRecord.model_validate(payload)


def test_manifest_invalid_family_is_rejected():
    # covers: AC-3 (family is tree | linear_svm | rbf_svm)
    payload = load("registry-manifest.sample.json")
    payload["models"][0]["family"] = "neural_net"
    with pytest.raises(ValidationError):
        RegistryManifest.model_validate(payload)


def test_manifest_empty_models_is_rejected():
    # covers: AC-3 (models has at least one entry)
    payload = load("registry-manifest.sample.json")
    payload["models"] = []
    with pytest.raises(ValidationError):
        RegistryManifest.model_validate(payload)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-q"]))
