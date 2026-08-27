# 0002. Keystone verdict stream, rationale

Reasoning and options for [index.md](index.md). `/develop` does not need this file.

## Context

Layer 0 (spec 0001, Accepted) built the substrate: the service skeletons, the three contracts, and the v1 parity featurizer. Nothing classifies yet. The keystone is the first slice where one flow travels the whole spine and comes out as a verdict in the UI, live.

Several forces shape how it is built. The foundation locks the streaming architecture: Redis `flows`/`verdicts` channels as the decoupling spine, a FastAPI ml-service that loads its models once at startup, a NestJS backend holding the websocket, a React UI (foundation.md Section 7 #7, #9). The foundation also fixes the delivery shape: the keystone is built full topology on the real services from the start, not a thin vertical that gets refactored later (Section 7 #10, Section 9). Two seams are genuinely novel and were reserved for careful design under the hybrid build mode: how a synchronous, CPU bound sklearn inference runs inside an async FastAPI service without stalling it, and what the verdict `score` means across model families (the tree gives a calibrated probability, the SVMs give an uncalibrated margin distance, and foundation.md Section 12 deferred this "to when inference is built"). A hard constraint sits underneath: the ml-service must run scikit-learn 1.8.0, the version the frozen v1 models were pickled under, or unpickling can silently shift behavior.

The system is a single user demo: one active model per service instance, nothing persisted, no auth (foundation.md Section 8, Section 10). The consequence of not building the keystone is that the whole fan-out (F1 model switching, F3 metrics, F4 to F6 capture) has no spine to stand on: every one of them is "the same path, another source or a richer view."

## Options considered

### Option 1: Full topology Redis streaming (chosen)

Capture publishes to Redis `flows`; the ml-service runs an async `flows` subscriber as a `lifespan` background task and runs each sync inference in a threadpool, publishing to `verdicts`; the backend subscribes both channels, correlates by `flow_id`, and pushes merged flow plus verdict rows over socket.io; React renders the LiveFlows core. One model (the manifest default) through a model generic loader.

**Pros**:
- Matches the locked architecture exactly (foundation.md Section 7 #7, #9), so nothing is rebuilt at F1 to F7.
- Proves the real polyglot spine (four services, Redis, websocket) end to end before the fan-out.
- The merged row matches the LiveFlows design (flow attributes and the verdict together), so the UI seam is built once.

**Cons**:
- The largest slice of the project: four services plus a UI in one spec.
- More moving parts to stand up at once (async subscriber, threadpool, two channel correlation) than a request/response prototype.

### Option 2: HTTP driven, no streaming loop (simplest)

The backend (or capture) POSTs each flow to the ml-service `/predict` and relays the returned verdict; no Redis subscribe loop; a verdict only UI.

**Pros**:
- Fewest moving parts; the ml-service is a plain request/response service.
- Fastest to a first classified flow.

**Cons**:
- Couples the services over synchronous HTTP and diverges from the locked Redis spine (foundation.md Section 7 #7), so the streaming path would be rebuilt later, exactly the "thin vertical then refactor" the foundation rejected (Section 7 #10).
- Awkward for a continuous stream (the natural shape here), and it hides the pub/sub decoupling that is part of the portfolio story.

### Option 3: Redis streaming, verdict only UI (leaner thread)

The full Redis streaming spine, but the backend subscribes `verdicts` only and pushes verdict rows; no flow correlation. The table shows `flow_id`, verdict, score, model, latency, ground truth, but no flow attributes.

**Pros**:
- Thinner than Option 1: no two channel correlation, no in memory join.
- Still proves the streaming spine end to end.

**Cons**:
- The LiveFlows design shows the 5 tuple and flow context alongside the verdict; a verdict only table cannot, so the correlation seam gets bolted on later (another "thin then refactor").
- The keystone demo is weaker: a verdict with no flow context reads as an abstract label, not a caught intrusion on a visible flow.

## Rationale

Option 1 is chosen because the forces in Context point one way. The Redis spine is locked (foundation.md Section 7 #7, #9), so Option 2's HTTP coupling would be torn out and rebuilt, the precise waste Section 7 #10 rejects. The LiveFlows design shows flow and verdict together, and the keystone exists to prove the real shape, so Option 3's verdict only table would also be a seam built twice. Building the correlation once now (Option 1) costs a small in memory join and buys the real UI.

Within Option 1 the sub decisions follow the same logic. The async subscriber runs in `lifespan` (where the architecture already loads the models) and each sync sklearn call runs in a threadpool (`run_in_executor`), the standard way to keep an async event loop responsive when the work is synchronous and CPU bound; the alternative, a separate worker process, adds a supervisor and a second deployable for no benefit at one instance. K1 loads the manifest `default_model_id` (the decision tree) through a model generic loader, not a tree specific one, so F1 widens it to five models without a rewrite; the tree also supports `predict_proba`, so K1's exercised score path is calibrated and sidesteps the SVM margin saturation caveat (spec 0001), while the family aware branch still ships so F1 lights up the SVMs unchanged. Replay runs at a fixed configurable rate so the stream is watchable, and the 5 tuple is synthesized because the v1 CICIDS CSVs are feature only (no source or destination IP); the featurizer only needs the real Destination Port, which is carried through.

The build order is dependency first through real seams (inference core, then the streaming loop, then the producer, then the relay, then the UI, then the end to end proof), each built as its real version once, which is what "full topology from the start" means for this project.

## References

**Project sources** (verifiable in this repo):
- `system/context/foundation.md` Section 7 #6, #7, #9, #10 (registry, Redis spine, reference architecture, full topology keystone), Section 9 (the keystone unlock), Section 10 (single model, throughput seam), Section 12 (score semantics deferred to inference).
- `system/context/architecture.md` (the shape, the boundaries, the open decision on the backend subscribing Redis directly vs the socket.io Redis adapter, resolved here as direct for a single instance).
- `system/context/library-docs.md` (FastAPI `lifespan` load once, redis-py, `ioredis`, socket.io, the scikit-learn 1.8.0 pin gotcha).
- `system/docs/specs/0001-layer-0-foundation/` (the contracts, the featurizer, and the deferred score computation this slice resolves).
- `system/context/build-graph.md` K1 (the slice definition and its met dependencies).
- `system/context/ui-registry.md`, `ui-rules.md` (the LiveFlows view and the components K1 ports, and the reuse rule).

**Practices & standards**:
- Load the model once at service startup, not per request (the `lifespan` pattern).
- Run synchronous, CPU bound work in a threadpool from an async event loop, so the loop stays responsive.
- Correlate a two channel stream by a stable id (`flow_id`), holding one side briefly until its pair arrives.
- Carry calibration state (`score_kind`) with a score so a distance is never read as a probability.
