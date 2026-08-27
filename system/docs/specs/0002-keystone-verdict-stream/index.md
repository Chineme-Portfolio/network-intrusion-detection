# 0002. Keystone: one flow to one verdict, streamed full topology

**Date**: 2026-08-27
**Status**: Accepted

## Summary

The keystone slice (build-graph K1): one network flow travels the whole spine and shows up as a verdict in the UI, live. CSV replay publishes a flow record to Redis `flows`; the FastAPI ml-service subscribes, featurizes it with the frozen v1 featurizer (L0.3), classifies it with a single loaded model, and publishes a verdict to Redis `verdicts`; the NestJS backend correlates the flow and its verdict by `flow_id` and pushes a merged row over a websocket; React renders it in the LiveFlows table. It runs full topology on real services (foundation.md Section 9), stays minimal (one model, CSV only), and proves the polyglot architecture before the fan-out (F1 to F7). Lifecycle is tracked in `system/context/progress-log.md`, not a scope row.

## Requirements

**User stories**:
- As the operator, I want to run one command and watch replayed flows get classified live, so the whole system is proven end to end before any fan-out.
- As the operator, I want each flow's verdict and how much to trust it shown at a glance, so a malicious flow is obvious and an uncalibrated score is not mistaken for a probability.
- As the builder, I want the streaming spine, the score computation, and the featurizer wired once, correctly, so F1 to F7 are "more of the same" and never rebuild these seams.

**Acceptance criteria** (each independently checkable):
- **AC-1**: CSV-replay capture reads a labeled CICIDS CSV and publishes flow records to Redis `flows` at a configurable rate. Each record validates against the flow-record contract (L0.2): a synthesized 5 tuple, the real Destination Port carried as both `dst_port` and `features.destination_port`, the raw CICFlowMeter fields under `features`, and the row's Label as `ground_truth`.
- **AC-2**: On startup the ml-service loads the single model named by the manifest `default_model_id` plus the featurizer (L0.3), subscribes to `flows`, and for each record featurizes then classifies then publishes a verdict to Redis `verdicts` that validates against the verdict contract (L0.2), echoing `flow_id` and `ground_truth`.
- **AC-3**: The verdict `score` is family aware, driven by the model's manifest `supports_proba` flag (the manifest's own field for this, `registry-manifest.schema.json`), not a re-derived family string. When `supports_proba` is true (the tree, the default model): `score = predict_proba(malicious)`, `score_kind = calibrated`. When false (the SVMs): `score = sigmoid(decision_function)`, `score_kind = uncalibrated`; this path is implemented and unit checkable, though K1's default model does not exercise it. `latency_ms` carries the real per flow inference time.
- **AC-4**: The backend subscribes both `flows` and `verdicts`, correlates them by `flow_id`, and pushes one merged flow plus verdict row to every connected websocket client. Either side may arrive first and is held briefly; an entry unmatched past the hold window (an orphan verdict, or a flow that never gets a verdict because it was featurizer rejected) is evicted by an active timer sweep, logged, and dropped, so the correlation map cannot grow without bound and the relay never crashes on an orphan.
- **AC-5**: The React UI (LiveFlows core) connects to the backend websocket and renders each merged row live: new rows animate in, a malicious verdict carries the alert row tone, the VerdictChip shows benign or malicious, and the ConfidenceMeter shows the `score`. A connection StatusDot and a running flow count are shown. (K1's default model is calibrated; surfacing an `uncalibrated` score in the UI is a design-system affordance the `ConfidenceMeter` does not have today, owed before an SVM verdict is shown, see Follow-up, and not free-styled into the component per `ui-registry.md` rule 3.)
- **AC-6**: `docker compose up` runs the whole path. Because Redis pub/sub does not redeliver, capture starts replay only after the ml-service is ready (its model loaded and its `flows` subscription live), so no early flows are published into the void; within seconds the UI shows flows classified end to end, with a malicious flow visibly flagged. A featurizer rejected flow (a bad `destination_port`, a missing field) is logged and skipped and the loop continues; a model load failure fails ml-service startup fast (the container is unhealthy, not silently classifying nothing).

## Decision

**Chosen option**: Option 1, the full topology Redis streaming keystone.

Build one thin end to end thread through the real services on CSV replay: capture publishes flow records to Redis `flows`; the FastAPI ml-service runs an async `flows` subscriber as a `lifespan` background task and runs each synchronous sklearn inference in a threadpool, then publishes verdicts to `verdicts`; the NestJS backend correlates flow and verdict by `flow_id` and pushes merged rows over a socket.io websocket; React renders the LiveFlows core. K1 loads a single model (the manifest default, the decision tree) through a model generic loader, so F1 widens it to all five without a rewrite. The score is computed family aware (tree probability, SVM squashed margin) so the seam is designed once.

## Feature design

**Data model sketch** (no persistence this phase; the contracts are the data model, all built in L0.2):

- **flow-record** (capture emits on `flows`, ml-service consumes): `schema_version`, `flow_id` (uuid, generated by capture, the correlation key), `ts`, the 5 tuple (`src_ip`/`src_port`/`dst_ip`/`dst_port`/`protocol`, synthesized deterministically per row where the CSV lacks them), `features` (the raw CICFlowMeter columns keyed by their emitted names, including `destination_port` equal to `dst_port`), `ground_truth` (the CSV Label, e.g. `BENIGN` or `DoS Hulk`).
- **verdict** (ml-service emits on `verdicts`, backend consumes): `schema_version`, `flow_id` (echoed), `model_id`, `verdict` (`benign`/`malicious`), `score` (0..1 malicious confidence), `score_kind` (`calibrated`/`uncalibrated`), `latency_ms`, `ts`, `ground_truth` (echoed).
- **registry-manifest** (ml-service loads at startup): K1 uses a manifest whose `default_model_id` names the single model to load. The full five model registry and runtime switching is F1.
- **flow_verdict row** (NEW, backend assembles, pushed over the websocket, not a persisted or shared/ contract): `{ flow_id, ts, src_ip, src_port, dst_ip, dst_port, protocol, verdict, score, score_kind, model_id, latency_ms, ground_truth }`. Backend owned; promote to `shared/` only if a second consumer appears.

**State transitions** (the pipeline, foundation.md Section 5; a linear flow lifecycle, no state machine): `published on flows` then `featurized + classified` then `verdict published on verdicts` then `correlated by flow_id` then `pushed over websocket` then `rendered`. The correlation step holds a flow (or a verdict) briefly in an in memory map keyed by `flow_id` until its pair arrives or the hold window expires. Eviction runs on an active timer, not lazily on the next message (which would never fire once the stream idles: replay ends, or the ml-service is down): both an orphan verdict and a flow that never gets a verdict (a featurizer rejected flow) are swept after the hold window, so the map stays bounded.

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| /health (ml-service) | GET | none | `{status:"ok"}` (liveness) | none | none (built L0.1) |
| /ready (ml-service) | GET | none | `{ready:true}` once the model is loaded and the `flows` subscription is live | none | 503 until ready |
| /predict (ml-service) | POST | one flow-record | one verdict | none | 422 invalid flow record; 400 featurizer reject (bad port, missing field) |
| /health (backend) | GET | none | `{status:"ok"}` | none | none (built L0.1) |
| websocket (backend, socket.io) | WS | client connects | server emits `flow_verdict` events (merged rows) | none | reconnect handled by socket.io client |
| Redis `flows` | pub/sub | flow-record JSON | consumed by ml-service | none (internal network) | malformed message logged and skipped |
| Redis `verdicts` | pub/sub | verdict JSON | consumed by backend | none (internal network) | orphan verdict logged and dropped after the hold window |

No control endpoints in K1: capture auto starts replay on boot. The control API (start/stop, source select, model switch) arrives with F1 and Sources.

**Key invariants**:
- The featurizer feeds the model exactly the training features (L0.3 parity). The ml-service image MUST pin scikit-learn 1.8.0 (the version the v1 models were trained under); unpickling a joblib artifact under another sklearn version can silently shift behavior.
- `flow_id` is the single correlation key end to end: capture generates it, the verdict echoes it, the backend joins on it.
- `score` is malicious confidence in 0..1; `score_kind` labels calibration honestly, and the UI must never present an uncalibrated score as a probability.
- One active model per ml-service instance (single user demo, foundation.md Section 10).
- Services couple only through the contracts, the Redis channels, and the websocket event. Nothing reaches into another service.
- Nothing is persisted; flows and verdicts stream through memory.
- Redis pub/sub does not redeliver, so capture must not publish before the ml-service `flows` subscription is live (the `/ready` gate), or those flows are lost.
- The ml-service `flows` subscriber runs as a `lifespan` background task whose reference is held, then cancelled and awaited after `yield`, so shutdown leaks no task or Redis connection. It processes one flow at a time (await each threadpool result before reading the next message) at K1 scale.
- Featurize and classify run together in one threadpool submission (both are synchronous pandas/sklearn), keeping the event loop free for `/health`, `/ready`, and `/predict`.
- The correlation map is bounded by the active hold-window sweep, which evicts both sides.

**Security model**: none required. Single user demo, no auth, no accounts (foundation.md Section 8). No real PII: the 5 tuple IPs are synthesized placeholders. Redis stays internal to the compose network (not published to the host, L0.1). Secrets and config come from the environment only (`code-standards.md` Section 6).

**Configuration required** (new to K1 unless marked existing):
- `REDIS_URL` (existing): how services reach Redis.
- `MODELS_DIR` (existing): the v1 `.joblib` models, git ignored and local.
- `FEATURIZER_META` (existing): the frozen featurizer artifact.
- `MANIFEST_PATH`: the registry manifest the ml-service loads (names `default_model_id`).
- `REPLAY_CSV`: path to the labeled CICIDS CSV to replay.
- `REPLAY_RATE`: flows per second (default about 10, a watchable pace).
- `REPLAY_LOOP` (optional): restart replay at end of file; default false (stop and log at EOF).
- `VITE_BACKEND_URL` (existing): the backend the browser connects to.

**Critical test scenarios** (each maps to an acceptance criterion):
- Happy path: `docker compose up`, a benign flow replays and appears in the UI classified benign with a calibrated score, verifies **AC-1**, **AC-2**, **AC-5**, **AC-6**.
- Malicious flow: a row labeled malicious is classified malicious and rendered with the alert row tone and a malicious VerdictChip, verifies **AC-5**.
- Score semantics: a tree verdict carries `score_kind = calibrated` and `score = predict_proba`; a direct unit call on the SVM branch returns `uncalibrated`, verifies **AC-3**.
- Correlation edge: a verdict arriving before its flow is held then joined and pushed; an orphan on either side (an orphan verdict, or a featurizer rejected flow that never gets a verdict) is swept, logged, and dropped past the hold window, and the relay survives, verifies **AC-4**.
- Startup ordering: capture holds replay until ml-service `/ready`, so no flow is published before the subscription is live (Redis pub/sub has no redelivery), verifies **AC-6**.
- Featurizer reject: a malformed flow (out of range port) is logged and skipped, the subscribe loop keeps consuming, verifies **AC-6**.
- Isolated inference: `POST /predict` with one raw flow returns a valid verdict without Redis, verifies **AC-2**, **AC-3**.

## Build plan

Tracer Bullet ordering (foundation.md Section 7 #10: full topology, build each real seam once in dependency order, then prove the thread end to end; no throwaway thin version to refactor).

1. **ml-service inference core**: add the ML stack to the image, scikit-learn **1.8.0** (pinned), joblib, pandas, numpy; a model generic single model loader reading `MANIFEST_PATH` `default_model_id` from `MODELS_DIR` (carrying its `supports_proba` flag); the family aware `score` function keyed on `supports_proba` (true to `predict_proba` calibrated; false to `sigmoid(decision_function)` uncalibrated); and `POST /predict` (raw flow to verdict) for isolated testing. Satisfies **AC-2**, **AC-3**.
2. **ml-service streaming loop**: a redis-py async subscriber on `flows` started as a `lifespan` background task (reference held, then cancelled and awaited after `yield` for a clean shutdown); per record run featurize (L0.3) plus classify together in one `run_in_executor` call (both are synchronous, one submission keeps the event loop free), awaiting each before reading the next message (serialize per flow at K1 scale), then publish the verdict on `verdicts`; flip a readiness flag once the subscription is live (drives `/ready`); log and skip a featurizer `ValueError`; fail fast if the model fails to load at startup. Satisfies **AC-2**, **AC-6**.
3. **capture CSV replay**: the CSV-replay adapter behind the capture interface; read `REPLAY_CSV`, map each row to a flow-record (generate `flow_id`, synthesize the 5 tuple, carry the real Destination Port and the raw features, Label to `ground_truth`), publish to `flows` at `REPLAY_RATE`; wait for ml-service `/ready` before the first publish (Redis pub/sub has no redelivery); stop and log at end of file unless `REPLAY_LOOP`. Satisfies **AC-1**.
4. **backend correlation + websocket**: an `ioredis` subscriber on both `flows` and `verdicts`; correlate by `flow_id` through a short hold-window in memory map swept by an active timer (evicting both an orphan verdict and a flow that never got a verdict, logged); a socket.io gateway that emits merged `flow_verdict` rows. Satisfies **AC-4**.
5. **frontend LiveFlows core**: port from the design export (cite `ui-registry.md`, do not invent) AppShell, the streaming DataTable (`animateNew`, `rowTone` alert for malicious), the VerdictChip and ConfidenceMeter columns, and a status header (connection StatusDot, running count); connect socket.io-client and render each row live, labeling an uncalibrated score. Satisfies **AC-5**.
6. **end to end wiring + compose**: wire the path in `docker-compose.yml` (ml-service gains the ML deps, the `MODELS_DIR` mount, and a `/ready` based healthcheck; capture `depends_on` ml-service readiness and gains `REPLAY_CSV`/`REPLAY_RATE`; the model id and manifest via env); prove one flow to one verdict rendered on `docker compose up`, malicious visibly flagged, a rejected flow skipped. Satisfies **AC-6**.

## Consequences

**Positive**:
- The polyglot architecture is proven end to end on real services before any fan-out, so K1 removes the integration risk for F1 to F7.
- The three hardest seams (the streaming spine, the score computation, the featurizer at serving) are built once, correctly, and never rebuilt.
- The score is honest: `score_kind` carries calibration to the UI, so an SVM margin is never read as a probability.
- `POST /predict` gives an isolated inference surface that the F4 parity spike reuses.

**Negative / tradeoffs**:
- K1 is a large slice: four services plus a UI in one spec. It is deliberately the keystone (foundation.md Section 9) and is kept minimal by deferring switching, metrics, PCAP, and live capture; the size is inherent to proving the whole spine at once.
- The ml-service image grows heavy (the sklearn/pandas/numpy stack) and pins scikit-learn 1.8.0, a hard version coupling to the frozen v1 artifacts.
- Running sync inference in a threadpool keeps the event loop responsive but does not parallelize CPU bound inference across cores; fine for a demo stream, a real bottleneck for the kernel SVMs at line rate (foundation.md Section 10), out of scope here.
- The synthesized 5 tuple is placeholder data; the UI shows plausible but not real source and destination addresses in replay (honest for replay, and real once live capture lands).

**Neutral**:
- The `flow_verdict` websocket row is backend owned, not a `shared/` contract, until a second consumer needs it.
- Capture auto starts replay; there is no start/stop control until F1 and Sources.
- The SVM score path ships but is dormant until F1 makes SVMs selectable; the scaled sigmoid refinement (against margin saturation) is an F1 follow-up.

## Follow-up

- [ ] F1: widen the single model loader to the full five model registry and add the runtime model switch endpoint; revisit the uncalibrated SVM `score` with a scaled or temperature sigmoid so the margin spreads across 0..1 (spec 0001 K1 caveat).
- [ ] Design system: how the UI surfaces an `uncalibrated` score (a label or affordance the `ConfidenceMeter` has no slot for today; "calibrat" appears nowhere in the current design system) is owed to the design system (`design-handoff.md`) before an SVM verdict is shown; do not free-style it in code (`ui-registry.md` rule 3). Not exercised in K1 (the default model is calibrated).
- [ ] F3: accumulate verdicts against `ground_truth` for live recall/precision and the delta-ratio lens; the merged row already carries `ground_truth`.
- [ ] If the `flow_verdict` websocket row gains a second consumer, promote it to a versioned `shared/` contract.
- [ ] `/test` after build: lock the CSV to flow-record mapping, the calibrated tree score, and both correlation orphan directions as permanent assertions. For the SVM score, assert the rescale-invariant properties (bounded 0..1, monotonic in the margin, `score_kind == uncalibrated`), not the literal sigmoid formula that F1 will rescale.

## Rationale

Reasoning, the options weighed, and references: see [rationale.md](rationale.md). Verify steps per acceptance criterion: see [verify.md](verify.md).
