# 0003. Model registry and runtime model switching

**Date**: 2026-08-28
**Status**: Proposed

## Summary

The signature capability (build-graph F1): load all five v1 models at startup and switch the active one at runtime, the way you switch models in a chat app (foundation.md Section 7 #6). The ml-service holds a registry of the loaded models plus which one is active; a control endpoint swaps the active model by id, and the very next flow is classified by the new model (its `model_id` and score semantics show up in the verdict). The NestJS backend proxies the control API so the browser can drive it later (F2). No UI in this slice: F1 is fully testable through the control API alone. Lifecycle is tracked in `system/context/progress-log.md`.

## Requirements

**User stories**:
- As the operator, I want to switch the active detection model at runtime and immediately see the stream classified by it, so I can compare the five models on live traffic without a restart.
- As the operator, I want to see the available models and which one is active, so the switch is a deliberate choice.
- As the builder, I want the switch to be safe while flows are being classified, so it never drops a flow or crashes the stream.

**Acceptance criteria** (each independently checkable):
- **AC-1**: On startup the ml-service loads **every** model in the manifest (all five) into memory and `/ready` returns 200 only once all are loaded. Startup fails fast (the container is unhealthy, never half a registry) if any model's artifact fails to load, or if the initial active id (`CAUGHT_MODEL_ID`, when set) names a model that is not in the manifest.
- **AC-2**: `GET /models` returns every model (`model_id`, `display_name`, `family`, `supports_proba`, `metrics`) and the `active_id` (which one is currently active).
- **AC-3**: `POST /model/switch` with `{model_id}` sets the active model and returns the new active model. An unknown `model_id` is rejected (404, the active model unchanged). Switching to the already-active model is idempotent (200, a no-op).
- **AC-4**: After a switch, the next verdicts carry the new `model_id` and that family's score semantics (`calibrated` for the tree, `uncalibrated` for the SVMs). The switch takes effect on the next flow; a flow already mid-classification finishes on the prior model. No flows are lost and nothing is drained.
- **AC-5**: Switching is safe under load and loses no flows: replaying a known N flows across several switches yields N verdicts (minus any logged featurizer-rejects), the loop never crashes, and the verdict stream cleanly flips `model_id` at each switch point.
- **AC-6**: The backend exposes `GET /api/models` and `POST /api/model/switch` that proxy to the ml-service, so the browser drives switching through the backend only (the frontend never calls the ml-service directly, `architecture.md` Boundaries).

## Decision

**Chosen option**: Option 1, an eager registry with an atomic active-model swap.

Load all five models into an in-memory registry at startup (foundation.md Section 7 #6). Hold the active model behind a single reference the stream loop reads once per flow; the switch endpoint reassigns that reference. Because the read (the stream loop) and the write (the switch handler) both run on the ml-service's single async event loop, they never interleave, and the threadpool classification already holds the model reference it was handed, so the swap needs no lock: an in-flight flow finishes on its model, the next flow uses the new one. This rests on one implementation constraint: the `/models` and `/model/switch` handlers must be `async def`, so the swap runs on the event loop; a plain `def` handler is dispatched by FastAPI to the same threadpool used for inference, where the swap could queue behind a slow classification and break the next-flow timing. The control API is `GET /models` + `POST /model/switch` (the surface `library-docs.md` already names), proxied by the NestJS backend.

## Feature design

**Data model sketch** (no persistence; in-memory only, foundation.md Section 10):

- **Registry** (ml-service, held in `app.state`): `{ models: dict[model_id -> LoadedModel], active: LoadedModel, active_id: str }`, built at startup from the manifest (`registry.manifest.json`, L0.2). `LoadedModel` is the K1 dataclass (the estimator plus the score facts). The stream loop reads the single `active` reference once per flow (a direct reference, not a two-step `models[active_id]` lookup, so the atomicity is plain on inspection); a switch reassigns `active` and `active_id` together. Every read and write is on the event loop (the handlers are `async`), so the two-field update is never seen half-applied.
- No new persisted entity. The manifest is the source of the model list; the active id lives only in memory and resets to the default on restart.

**State transitions**: `active_id`, starting at the initial value (`CAUGHT_MODEL_ID` if set, else the manifest `default_model_id`), moves to any manifest `model_id` on a switch. There is no other state.

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| /health, /ready, /predict (ml-service) | (K1) | | | none | /health, /ready unchanged (/ready now waits for all five); /predict now classifies with the **active** model |
| /models (ml-service) | GET | none | `{ models: [...], active_id }` | none | none |
| /model/switch (ml-service) | POST | `{ model_id }` | `{ active_id, model }` | none | 404 unknown model_id; 422 missing/invalid body |
| /api/models (backend) | GET | none | proxied models list | none | 502 if the ml-service is unreachable |
| /api/model/switch (backend) | POST | `{ model_id }` | proxied switch result | none | 404 / 422 (proxied from ml-service); 502 if unreachable or timed out |

**Key invariants**:
- Exactly one active model per ml-service instance at any moment (foundation.md Section 10).
- The stream loop always classifies with the model that is active at the moment it reads it; the read and the switch are serialized on the single event loop, so no torn read is possible.
- The control handlers (`/models`, `/model/switch`) are `async def`, so the swap runs on the event loop, not the inference threadpool; a sync handler would break the read/write serialization the safety depends on.
- A switch never drops the Redis `flows` subscription (the loop keeps running; only the model reference changes).
- The verdict's `model_id` always names the model that actually produced it, so the switch point is visible downstream.
- Contracts and channels are unchanged; F1 adds only control endpoints.

**Security model**: none required. Single-user demo, no auth (foundation.md Section 8). The switch control endpoint is unauthenticated; a real deployment would gate it (out of scope, noted in Follow-up). The frontend reaches switching only through the backend.

**Configuration required** (all existing, none new):
- `MODELS_DIR`, `MANIFEST_PATH`: the models and the manifest (K1).
- `CAUGHT_MODEL_ID`: now the **initial** active model; empty means the manifest default. Switching changes the active model at runtime regardless.
- `ML_SERVICE_URL` (backend): where the proxy reaches the ml-service. The compose env already sets it (K1), but the backend code reads it for the first time here (a new binding in `backend/src/config.ts`).

**Critical test scenarios** (each maps to an acceptance criterion):
- Startup loads all five, `/ready` waits for them, a missing artifact fails startup, verifies **AC-1**.
- `GET /models` lists five models and the active id, verifies **AC-2**.
- `POST /model/switch` to another family flips the active model; an unknown id returns 404 and leaves it unchanged; re-switching to the active model is a no-op, verifies **AC-3**.
- After a switch the next verdict carries the new `model_id` and the right `score_kind`, verifies **AC-4**.
- With the stream running, repeated switches keep the loop alive and flip `model_id` cleanly, verifies **AC-5**.
- The backend `GET /api/models` and `POST /api/model/switch` proxy correctly, verifies **AC-6**.

## Build plan

Tracer Bullet: stand up the control-API thread end to end (switch through the backend, watch the verdict `model_id` change), then it is done. The UI (F2) hangs off the same proxy later.

1. **ml-service registry**: refactor the K1 single-model load into a `Registry` that loads **every** manifest model into `{ models, active, active_id }`; the initial active is `CAUGHT_MODEL_ID` (validated against the manifest) or the manifest default; fail fast if any artifact fails to load or the initial id is unknown. Hold it in `app.state`, and update `predict()` to read `registry.active` (it must not reference the removed `app.state.model`). `/ready` reflects the registry for free: loading is synchronous in the `lifespan` before the stream task starts, exactly as K1 loads today, so no new gating logic is added. Satisfies **AC-1**.
2. **stream loop reads the active model**: change the K1 subscribe loop to read `registry.active` once per flow (on the event loop, before the `run_in_executor` handoff) instead of a fixed model, so a later switch takes effect on the next flow. Satisfies **AC-4**, **AC-5**.
3. **ml-service control endpoints** (both `async def`, so the swap runs on the event loop, not the inference threadpool): `GET /models` (the list plus `active_id`) and `POST /model/switch` (validate the id, reassign `active`/`active_id`, log the from/to, idempotent on the active id, 404 on unknown, 422 on a missing or invalid body). Satisfies **AC-2**, **AC-3**.
4. **backend proxy**: a `ModelsService` wrapping HTTP to the ml-service with Node's native `fetch` (no new dependency). Branch on `response.ok` / `status` so the ml-service's 404/422 pass through as themselves (fetch resolves, it does not throw, on a 4xx/5xx), and wrap each call in `AbortSignal.timeout(...)`, mapping a timeout or network error to 502. A controller exposes `GET /api/models` + `POST /api/model/switch`, forwarding the ml-service status (the ml-service is the validator; no request-body validation layer is added here). Add the `ML_SERVICE_URL` binding to `backend/src/config.ts`. Satisfies **AC-6**.
5. **wire, budget, and prove**: measure the real cold-load time for all five (the RBF SVMs dominate) and raise the ml-service healthcheck `start_period` / `retries` in `docker-compose.yml` to cover it. Then `docker compose up`; `GET /api/models`, switch to an SVM and watch the verdict stream flip `model_id` and `score_kind`, switch back, all while the stream runs; confirm no flows are lost by replaying a known N flows across several switches and counting N verdicts. Satisfies **AC-4**, **AC-5**, **AC-6**.

## Consequences

**Positive**:
- The signature demo is real: switch models at runtime and watch the live stream reclassify, no restart.
- The registry generalizes the K1 single-model loader; the score seam and the streaming loop are reused unchanged.
- Switching is instant and safe with no lock, because the read and the swap are serialized on the event loop.
- It unlocks F2 (the switcher UI just calls the proxy) and helps F3 (compare models live).

**Negative / tradeoffs**:
- Eager-loading all five (including the heavy RBF SVMs, up to 500k support vectors) slows startup and raises the memory floor; the `/ready` gate and the compose healthcheck `start_period` may need more headroom.
- An RBF SVM is slow per flow at inference (foundation.md Section 10 throughput seam); when one is the active model the verdict `latency_ms` climbs and the stream may lag at the replay rate. That is the honest cost of switching to it, visible, not hidden.
- The switch endpoint is unauthenticated; fine for the single-user demo, not for a real deployment.

**Neutral**:
- No persistence: the active model resets to the default on restart.
- The lock-free swap relies on CPython's single-threaded event loop (and the GIL as a backstop); true for this stack, worth stating.
- The `latency_ms` already in the verdict becomes the live signal of a model's per-flow cost, no new field needed.

## Follow-up

- [ ] F2: the model-switcher UI (React) calls `GET /api/models` and `POST /api/model/switch`; surface the active model and let the operator pick.
- [ ] F3: live detection metrics can accumulate per model across switches (recall/precision, the delta-ratio lens).
- [ ] If eager-loading all five proves too slow or too heavy, revisit lazy or background loading (the alternative weighed in `rationale.md`).
- [ ] Auth on the control endpoints before this ever leaves a demo (foundation.md Section 8).
- [ ] `/test` after build: lock the registry load (all five, fail fast), the switch endpoint (validate, idempotent, unknown id), and that the stream loop reads the current active model.

## Rationale

Reasoning, the options weighed, and references: see [rationale.md](rationale.md). Verify steps per acceptance criterion: see [verify.md](verify.md).
