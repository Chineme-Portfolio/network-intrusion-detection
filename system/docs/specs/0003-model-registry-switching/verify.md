# 0003. Model registry and runtime switching, verify guide

How to prove each acceptance criterion in [index.md](index.md) is met. For `/check verify` and for the builder. The v1 `.joblib` models are git-ignored and local (mounted in compose); verification runs where they exist.

## AC-1: all five models load at startup

- Start the stack (`docker compose up`). The ml-service logs show all five models loaded (one line per model, with its classes and `supports_proba`).
- `curl :8000/ready` returns 200 only after the whole registry is loaded (503 while loading).
- Failure path: point the manifest at a missing artifact (or rename one model file); confirm ml-service startup fails fast (the container is unhealthy), never serving with half a registry. Same for an invalid initial id: set `CAUGHT_MODEL_ID` to an id not in the manifest and confirm startup fails fast.

## AC-2: list the models and the active one

- `curl :8000/models` returns all five models (each with `model_id`, `display_name`, `family`, `supports_proba`, `metrics`) and an `active_id`.
- The `active_id` matches the initial model (`CAUGHT_MODEL_ID` if set, else the manifest `default_model_id`, the tree).

## AC-3: switch the active model

- `curl -X POST :8000/model/switch -d '{"model_id":"rbf50k_classweight"}'` returns the new active model; a follow-up `GET /models` shows `active_id` changed.
- Unknown id: switching to `{"model_id":"nope"}` returns 404 and leaves `active_id` unchanged.
- Idempotent: switching to the already-active id returns 200 and changes nothing.

## AC-4: the switch shows up in the verdict stream

- With capture replaying, subscribe to Redis `verdicts`. Before a switch, verdicts carry the tree's `model_id` and `score_kind: calibrated`.
- Switch to an SVM (for example `linsvc_classweight`); within one flow the verdicts carry the new `model_id` and `score_kind: uncalibrated`.
- Switching does not drain: verdicts keep flowing across the switch, and a flow already mid-classification finishes on the prior model (no gap, no lost flow).

## AC-5: safe under load

- With the stream running at the replay rate, switch models several times in quick succession. The ml-service does not crash, the subscribe loop keeps publishing verdicts, and the `model_id` in the stream flips cleanly at each switch point.
- No flows lost, by count: replay a known N flows spanning several switches and confirm N verdicts arrive (minus any logged featurizer-rejects), so a stall is told apart from healthy lag by the number, not by eye.
- Note: switching to a large RBF SVM raises `latency_ms` and may make the stream lag the replay rate; that is the expected cost (foundation.md Section 10), not a failure.

## AC-6: the backend proxies the control API

- `curl :3001/api/models` returns the same list the ml-service does (proxied).
- `curl -X POST :3001/api/model/switch -d '{"model_id":"rbf50k_classweight"}'` switches the active model (confirm via `GET /api/models` or the verdict stream).
- The browser reaches switching only through the backend; the frontend never calls `:8000` directly (architecture.md Boundaries).

## Notes

- No UI in this slice: F1 is verified through the control API (curl or an HTTP client). The switcher UI is F2.
- No persistence: the active model resets to the default when the ml-service restarts.
- Layer 0 and K1 behaviors (the contracts, the featurizer parity, one flow to one verdict) are not re-verified here; this slice proves the registry and the switch.
