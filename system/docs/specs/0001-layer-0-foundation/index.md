# 0001. Layer 0 foundation: scaffold, contracts, and the parity featurizer

**Date**: 2026-08-12
**Status**: Proposed

## Summary

The first buildable slice of Caught. It stands up the empty service skeletons and a local Redis (a one command `docker compose up`), defines the three data contracts (flow record, verdict, registry manifest) once as JSON Schema so Python and TypeScript stay in sync, and extracts the v1 feature pipeline into a shared Python module that provably reproduces training features. No live classification yet; this is the substrate the keystone (K1) sits on. Lifecycle is tracked in `system/context/progress-log.md` and `build-graph.md` (L0.1 to L0.3), not a scope row.

## Requirements

**User stories**:
- As the builder, I want the service skeletons and Redis to start with one command, so I can develop the keystone against a real topology.
- As any service, I want one shared definition of each contract, so Python and TypeScript cannot drift.
- As the ml-service, I want a featurizer that provably matches v1 training features, so live verdicts are trustworthy and not silently wrong.

**Acceptance criteria** (each independently checkable):
- **AC-1**: `docker compose up` in `system/` starts Redis plus skeleton containers for capture, ml-service, backend, and frontend. The ml-service exposes `GET /health` returning HTTP 200. Nothing classifies yet.
- **AC-2**: The flow record, verdict, and registry manifest each exist as a versioned JSON Schema in `system/shared/schemas/`. Codegen produces Pydantic v2 models (Python) and TypeScript types from them; a sample payload validates against each schema in both languages, and a payload missing a required field (for example a verdict with no `score_kind`) is rejected in both.
- **AC-3**: The verdict schema carries `flow_id`, `model_id`, `verdict` (benign or malicious), `score` (number 0 to 1), `score_kind` (calibrated or uncalibrated), `latency_ms`, `ts`, and optional `ground_truth`. The flow record carries `schema_version`, `flow_id`, `ts`, the 5 tuple, an optional `ground_truth`, and a `features` object holding the raw CICFlowMeter fields. The registry manifest lists, per model, `model_id`, `display_name`, `family`, `path`, `supports_proba`, and the v1 metrics.
- **AC-4**: The featurizer, given one raw CICFlowMeter flow, returns the exact 67 feature vector the v1 models consume: the same columns, in the same order, with the same values, applying the `02` row local steps, the frozen train max fill, and the `02b` port bucketing.
- **AC-5**: The frozen train max values (`flow_bytes_s`, `flow_packets_s`), the canonical 67 column order, and the per column dtypes (about 40 are `int64`, including the three `port_*` one hot columns, the rest `float64`) are persisted as a versioned artifact (`featurizer_meta.json`) generated from v1, and the featurizer reads them rather than hardcoding them.
- **AC-6**: A parity test asserts the featurizer output on a golden fixture (a small set of raw flows plus their exact v1 featured output) equals the frozen v1 output exactly, matching columns, order, dtypes, and values (dtype strict, so `3` and `3.0` differ), and fails loudly on any drift.

## Decision

**Chosen option**: Option 2, a shared contracts and featurizer foundation with a golden fixture parity guard.

Build Layer 0 as three parts on the locked stack: (1) service skeletons plus a `docker compose` Redis, (2) contracts authored once as JSON Schema with codegen to Pydantic and TypeScript, (3) the v1 pipeline extracted into a shared Python featurizer whose parity is frozen and test guarded.

**Implementation skills**: none.

## Feature design

**Data model sketch** (the three contracts, `system/shared/schemas/`, each with a `schema_version`):

- **flow-record** (capture emits, ml-service consumes):
  - `schema_version`: string
  - `flow_id`: string (uuid)
  - `ts`: string (ISO 8601, capture time)
  - `src_ip`, `src_port`, `dst_ip`, `dst_port`, `protocol`: the 5 tuple
  - `features`: object, the raw CICFlowMeter fields keyed by their emitted names (the featurizer owns all renaming and cleaning, so capture stays dumb). The featurizer reads `features.destination_port` for bucketing; it must equal the top level `dst_port`.
  - `ground_truth`: string or null (the true label, present when replaying labeled CICIDS data, for the metrics slice; null for live)
- **verdict** (ml-service emits, backend and UI consume):
  - `schema_version`, `flow_id` (matches the flow record), `model_id`, `verdict` (`benign` or `malicious`), `score` (number 0 to 1, malicious confidence), `score_kind` (`calibrated` or `uncalibrated`), `latency_ms` (number), `ts`, `ground_truth` (echoed for metrics)
- **registry-manifest** (config the ml-service loads):
  - `schema_version`, `default_model_id`, and `models`: array of `{ model_id, display_name, family (tree | linear_svm | rbf_svm), path (joblib), supports_proba (bool), metrics (recall, precision, fn, fp from v1 `07_comparison`) }`

**score semantics** (settled): `score` is malicious confidence in 0 to 1. When the model supports it (the tree), `score = predict_proba(malicious)` and `score_kind = calibrated`. For the SVMs (no probability), `score = sigmoid(decision_function)` and `score_kind = uncalibrated`. No retraining of the frozen v1 models. The computation lands in the K1 slice; Layer 0 only fixes the contract shape (the `score` plus `score_kind` fields).

**featurizer** (`system/ml-service/featurizer/`, the single Python consumer):
- Input: one raw flow (the flow record `features`). Output: a 1 row, 67 column frame matching v1.
- Validate first: required raw fields are present, and `destination_port` is an integer in 0 to 65535. A malformed flow (a missing field, an out of range port, or a negative duration, which v1 dropped) is rejected with a clear error, not silently classified. This matters because `pd.cut` on an out of range port yields NaN and then an all zero bucket row, silently breaking the exactly one bucket invariant.
- Steps, ported faithfully from the notebooks: snake_case rename (`02` step 1), `flow_bytes_s` `0/0 -> 0` and mark `+inf` (`02` step 3), drop the 13 redundant or constant columns (`02` step 4), clip the impossible negatives and keep the `init_win` `-1` sentinels (`02` step 5), fill the marked rate columns with the frozen train max (`02` step 7, from `featurizer_meta.json`), then IANA port bucketing into `port_well_known` / `port_registered` / `port_ephemeral` (`02b`, cast to `int`). Finally cast every column to its artifact dtype and reindex to `feature_order`, so column order and dtypes are exact.

**Artifacts** (`featurizer_meta.json`, versioned, generated from v1): `train_max` (`flow_bytes_s = 2.071e9`, `flow_packets_s = 4.0e6`), `feature_order` (the 67 column names in order), and `dtypes` (per column `int64` or `float64`), all read from `data/processed/featured/X_train.parquet`.

**API surface** (Layer 0 only):

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| /health (ml-service) | GET | none | `{status: "ok"}` | none | none |

All other surfaces (predict, model switch, the websocket) belong to K1 and later slices.

**Key invariants**:
- The featurizer output columns equal `feature_order` exactly (names, order, count 67).
- The train max fill uses the artifact value, never a value recomputed at serving.
- Contracts are versioned; a breaking change bumps `schema_version`.
- Only the ml-service imports sklearn, joblib, and the featurizer (`architecture.md` boundaries).

**Security model**: no live traffic and nothing persisted in Layer 0. Secrets (the Redis URL) come from the environment (`code-standards.md` Section 6). No auth surface yet.

**Configuration required**:
- `REDIS_URL`: how services reach Redis.
- `MODELS_DIR`: where the v1 `.joblib` models live (git ignored, local).
- `FEATURIZER_META`: path to `featurizer_meta.json`.

**Critical test scenarios** (each maps to an AC):
- Happy path: `docker compose up`, then `GET /health` returns 200, verifies **AC-1**.
- Contract round trip: a sample flow record and verdict validate against their JSON Schema in both Python and TypeScript, verifies **AC-2**, **AC-3**.
- Parity: the featurizer output on the golden fixture equals the frozen v1 featured rows exactly, verifies **AC-4**, **AC-6**.
- Drift guard: mutating one featurizer step (for example skipping a clip) makes the parity test fail, verifies **AC-6**.

## Build plan

Ordered by dependency (Layer 0 is the substrate the keystone tracer later runs through; `build-graph.md` calls these L0.1 to L0.3).

1. Scaffold: create the `system/{capture,ml-service,backend,frontend,shared}` skeletons and a `docker compose` that starts Redis plus the four services; ml-service serves `GET /health`. Satisfies **AC-1**.
2. Contracts: author the three JSON Schemas in `system/shared/schemas/`; wire codegen to Pydantic v2 and TypeScript; add a two language validation test. Satisfies **AC-2**, **AC-3**.
3. Featurizer artifact: a small v1 extraction script writes `featurizer_meta.json` (train max, the 67 column order, and the per column dtypes) from the v1 featured parquet. Satisfies **AC-5**.
4. Featurizer module: port the `02` row local steps, the train max fill (from the artifact), and the `02b` bucketing into `system/ml-service/featurizer/`. Satisfies **AC-4**.
5. Golden fixture plus parity test: generate the fixture in a single pipeline run (snapshot the sample raw rows right after the raw concat, then carry those same in memory rows through to the featured output; never re derive raw row N with a second glob, whose file order is filesystem dependent and unsorted). Add a sanity check that an untouched field (`destination_port`) agrees between the raw and featured halves, so a mispairing fails loudly. Then assert the featurizer reproduces the featured output exactly. Satisfies **AC-6**.

## Consequences

**Positive**:
- Contracts are decoupled and type safe in both languages from one source, so the seams cannot drift.
- Feature parity is provable and test guarded, the deepest risk (`foundation.md` Section 11) is confronted at the foundation, not after live capture.
- The train max and column order are frozen, so serving cannot silently diverge from training.
- The topology is real from the first slice, so K1 has nowhere to hide integration surprises.

**Negative / tradeoffs**:
- Codegen adds a build step and a toolchain choice (see Follow-up).
- The featurizer duplicates v1 transform logic in a new module; the parity test is what keeps the copy honest.
- The golden fixture must be regenerated if v1 ever changes (unlikely; the models are frozen).
- The SVM `score` is uncalibrated; the UI must label it so, or a viewer over reads a distance as a probability.

**Neutral**:
- The featurizer lives in the ml-service (its only consumer), not in `shared/`, which stays language neutral (schemas only).
- `score_kind` is a new field carried purely so the UI can be honest about calibration.

## Follow-up

- [ ] Pick the codegen tools and add them to `library-docs.md`: `datamodel-code-generator` (JSON Schema to Pydantic) and `json-schema-to-typescript` (JSON Schema to TS) are the current recommendations.
- [ ] The live capture parity spike (`build-graph.md` F4) will reuse this featurizer plus the golden fixture harness to measure a candidate tool's feature drift.
- [ ] Surface `score_kind` in the UI verdict display (K1 or the metrics slice).
- [ ] K1 caveat: an unscaled `sigmoid(decision_function)` saturates near 0 or 1 for typical SVM margins, so the uncalibrated score will read near binary; consider scaling the squash when K1 computes it.

## Rationale

See [rationale.md](rationale.md) for the problem context, the options weighed, and why this shape was chosen.
