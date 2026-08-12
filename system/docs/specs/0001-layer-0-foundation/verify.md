# 0001. Layer 0 foundation, verify guide

How to prove each acceptance criterion in [index.md](index.md) is met. For `/check verify` and for the builder.

## AC-1: scaffold and Redis start with one command

- From `system/`, run `docker compose up`. Redis and the four service containers (capture, ml-service, backend, frontend) start.
- `curl http://localhost:<ml-service-port>/health` returns HTTP 200 with `{"status": "ok"}`.
- No classification happens yet; the other services are skeletons.

## AC-2 and AC-3: contracts exist, generate both sides, and validate

- `system/shared/schemas/` holds `flow-record.schema.json`, `verdict.schema.json`, `registry-manifest.schema.json`, each with a `schema_version`.
- Running codegen produces the Pydantic models (Python) and the TypeScript types.
- A sample flow record and a sample verdict validate against their schema in Python (Pydantic) and in TypeScript. A payload missing a required field (for example a verdict with no `score_kind`) is rejected in both.
- Field check: the verdict carries `score` and `score_kind`; the flow record carries the 5 tuple, `features`, and optional `ground_truth`; the manifest lists per model `family`, `supports_proba`, and the v1 metrics.

## AC-4 and AC-5: the featurizer reproduces v1 features from the frozen artifact

- `featurizer_meta.json` exists and contains `train_max` (`flow_bytes_s` about 2.071e9, `flow_packets_s` 4.0e6), a `feature_order` list of 67 names, and per column `dtypes`.
- Feed the featurizer one raw flow. It returns a 1 row, 67 column frame whose columns equal `feature_order` in order, each cast to its artifact dtype (about 40 `int64`, including the three `port_*` columns, the rest `float64`).
- Confirm the featurizer reads `train_max` from the artifact (change the artifact value, the fill value changes; the value is not hardcoded in the module).
- Validation: a flow with an out of range `destination_port` (say 70000) or a missing required field is rejected with a clear error, not classified.

## AC-6: the parity test passes and catches drift

- The golden fixture holds a small set of raw flows and their exact v1 featured output, generated in one pipeline run (the raw sample snapshotted before the transforms, then carried through to the featured output, not re derived by a second glob). A sanity field (`destination_port`) agrees between the two halves.
- The parity test asserts `featurizer(raw_i)` equals `expected_featured_i` for every fixture row, dtype strict, exact on columns, order, dtypes, and values.
- Drift guard: temporarily change one featurizer step (for example skip the negative clip, or drop a different column). The parity test must fail. Revert.

## Notes

- The v1 `.joblib` models and `data/processed/featured/` are git ignored and local; verification runs where they exist.
- Layer 0 does not classify; a verdict flowing end to end is verified in the keystone slice (K1), not here.
