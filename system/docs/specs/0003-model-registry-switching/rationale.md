# 0003. Model registry and runtime switching, rationale

Reasoning and options for [index.md](index.md). `/develop` does not need this file.

## Context

The keystone (spec 0002) built one flow to one verdict on a single model, the manifest default (the decision tree). The registry manifest already lists all five v1 models (L0.2), and the K1 loader is model-generic (it loads whichever id it is told). What is missing is the project's signature idea: switch the active model at runtime and watch the live stream reclassify, the way you switch models in a chat app (foundation.md Section 7 #6). This slice adds that.

Three forces shape it. First, the concurrency of the K1 stream: the subscribe loop runs on the ml-service's single async event loop and hands each flow to a threadpool for the synchronous sklearn inference, so a runtime switch must not tear a read or drop a flow. Second, the weight of the models: the RBF SVMs carry up to 500k support vectors, so loading all five and running inference on the largest is a real memory and latency cost (foundation.md Section 10). Third, the boundary: the browser talks only to the backend (architecture.md), so switching needs a backend control endpoint even though its UI (F2) comes later.

The consequence of not building it is that the five-model comparison, the spine of the whole project, stays a notebook result (v1) rather than something you can drive live.

## Options considered

### Option 1: Eager registry + atomic reference swap (chosen)

Load all five models at startup into an in-memory registry with an `active_id`. The stream loop reads the active model once per flow; the switch endpoint reassigns the reference. Read and write are both on the single event loop, so they never interleave; the threadpool holds the reference it was handed.

**Pros**:
- Switching is instant (the target model is already loaded) and needs no lock.
- Matches foundation.md Section 7 #6 (all five loaded at startup).
- An in-flight flow finishes cleanly on its model; nothing is drained or lost.

**Cons**:
- Eager loading of all five (the heavy RBF SVMs included) slows startup and raises the memory floor.

### Option 2: Lazy load on first switch

Load only the default at startup; load a model the first time it is selected, then keep it.

**Pros**:
- Fast startup, lower memory until a model is actually used.

**Cons**:
- The first switch to a model pays its load cost, and loading a model on the event loop would stall the stream (so it needs its own threadpool handoff plus a "loading" state), more moving parts for a single-instance demo.
- Diverges from foundation.md Section 7 #6 without a forcing reason.

### Option 3: Eager load + restart the loop on switch

Load all five, but on a switch cancel the subscribe task and restart it bound to the new model.

**Pros**:
- The loop always has a single fixed model, a simple mental model.

**Cons**:
- Restarting the loop drops the Redis `flows` subscription for a moment, and Redis pub/sub does not redeliver, so flows are lost at every switch, the exact failure the K1 readiness gate exists to avoid.
- Much heavier than swapping a reference for no benefit.

## Rationale

Option 1 follows from the forces in Context. The models are meant to be held in memory together (foundation.md Section 7 #6), so eager loading is the intended shape, and it makes the switch instant. The safety question dissolves once you see that the active-model read (the stream loop) and the swap (the switch handler) both run on the ml-service's single async event loop: they are already serialized, so there is no torn read to guard against, and the threadpool only ever holds the reference it was handed when the flow was submitted. That is why Option 1 needs no lock, while Option 3's loop restart would drop the subscription and lose flows, and Option 2's lazy load would stall the loop unless wrapped in extra machinery. The cost Option 1 accepts, a heavier startup and a slow RBF inference when that model is active, is real but honest: the verdict `latency_ms` already surfaces it, and foundation.md Section 10 named it as a known seam. The control API is `GET /models` + `POST /model/switch` because `library-docs.md` already wrote that surface down, and the backend proxies it because the frontend talks only to the backend (architecture.md); the proxy uses Node's native `fetch`, so no new dependency enters the stack.

## References

**Project sources** (verifiable in this repo):
- `system/context/foundation.md` Section 7 #6 (five models, hot-switchable, all loaded at startup, small enough to hold in memory), Section 10 (single active model per instance; the RBF throughput seam), Section 8 (no auth this phase).
- `system/context/architecture.md` (control endpoints proxy to the ml-service; the frontend talks only to the backend; wrap external calls in one place).
- `system/context/library-docs.md` (the ml-service surface `GET /models` + `POST /model/switch`; redis-py).
- `system/docs/specs/0002-keystone-verdict-stream/` (the K1 model-generic loader, the streaming loop, the family-aware score this slice extends).
- `system/context/build-graph.md` F1 (the slice and its met dependencies) and F2 (the UI that consumes this control API next).

**Practices & standards**:
- Load once at startup, hold in service state (the same lifespan pattern K1 uses).
- A lock-free swap is safe when the reader and the writer are serialized on one event loop; do not add a lock the concurrency model does not need.
- Keep a control plane (switch) separate from the data plane (the flow stream); the switch changes a reference, it never touches the subscription.
