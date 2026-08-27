"""Contract validation, Python side (AC-2, AC-3).

Proves the generated Pydantic v2 models accept the sample payloads and reject a
payload missing a required field (for example a verdict with no score_kind). The
TypeScript side is codegen/typescript (a tsc type check). Run codegen first.

    python codegen/python/validate.py     # exit 0 = pass

Kept dependency light on purpose: only pydantic plus the generated models, no test
runner. A real suite comes later via /test.
"""

import json
import sys
from pathlib import Path

SHARED = Path(__file__).resolve().parents[2]  # system/shared
GENERATED = SHARED / "generated" / "python"
SAMPLES = SHARED / "samples"

sys.path.insert(0, str(GENERATED))

try:
    from pydantic import ValidationError
    from caught_contracts.flow_record import FlowRecord
    from caught_contracts.verdict import Verdict
    from caught_contracts.registry_manifest import RegistryManifest
except ModuleNotFoundError as exc:
    print(f"[validate] cannot import generated models: {exc}")
    print("[validate] run codegen first: bash codegen/generate.sh")
    raise SystemExit(2)


def load(name: str) -> dict:
    return json.loads((SAMPLES / name).read_text())


def accepts(desc: str, model, payload: dict) -> bool:
    try:
        model.model_validate(payload)
        print(f"  ok    {desc}")
        return True
    except ValidationError as exc:
        print(f"  FAIL  {desc}: valid payload was rejected: {exc}")
        return False


def rejects(desc: str, model, payload: dict) -> bool:
    try:
        model.model_validate(payload)
        print(f"  FAIL  {desc}: an invalid payload was accepted")
        return False
    except ValidationError:
        print(f"  ok    {desc}")
        return True


def main() -> int:
    results: list[bool] = []

    # Every sample validates against its generated model.
    results.append(accepts("flow-record sample validates", FlowRecord, load("flow-record.sample.json")))
    results.append(accepts("verdict sample validates", Verdict, load("verdict.sample.json")))
    results.append(accepts("registry-manifest sample validates", RegistryManifest, load("registry-manifest.sample.json")))

    # A payload missing a required field is rejected.
    verdict_no_kind = load("verdict.sample.json")
    del verdict_no_kind["score_kind"]
    results.append(rejects("verdict missing score_kind is rejected", Verdict, verdict_no_kind))

    flow_no_id = load("flow-record.sample.json")
    del flow_no_id["flow_id"]
    results.append(rejects("flow-record missing flow_id is rejected", FlowRecord, flow_no_id))

    manifest_no_metrics = load("registry-manifest.sample.json")
    del manifest_no_metrics["models"][0]["metrics"]
    results.append(rejects("manifest model missing metrics is rejected", RegistryManifest, manifest_no_metrics))

    print()
    if all(results):
        print("PASS (python): all contract checks passed")
        return 0
    print("FAIL (python): some checks failed")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
