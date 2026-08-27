# 0002. Keystone verdict stream, verify guide

How to prove each acceptance criterion in [index.md](index.md) is met. For `/check verify` and for the builder. The v1 `.joblib` models and a labeled CICIDS CSV are git ignored and local; verification runs where they exist.

## AC-1: CSV replay publishes valid flow records

- Start the stack (`docker compose up`) or run capture alone against a local CSV. Capture reads `REPLAY_CSV` and publishes to Redis `flows` at `REPLAY_RATE`.
- Subscribe to `flows` (for example `redis-cli subscribe flows`, or a short script) and confirm each message validates against the flow-record schema: a `flow_id` (uuid), a synthesized 5 tuple, `features.destination_port` equal to the top level `dst_port` and to the CSV Destination Port, and `ground_truth` equal to the row Label.
- Confirm the rate: messages arrive at about `REPLAY_RATE` per second, not all at once.

## AC-2: ml-service loads a model, subscribes, classifies, publishes verdicts

- On ml-service startup, the logs show the single model named by the manifest `default_model_id` loaded, plus the featurizer, and the `flows` subscription active.
- With capture running, subscribe to `verdicts` and confirm each message validates against the verdict schema, echoes the matching `flow_id`, and echoes `ground_truth`.
- Isolated path: `POST /predict` with one raw flow record returns a valid verdict without Redis in the loop.

## AC-3: score is family aware

- For a tree verdict (the default model), confirm `score_kind = calibrated` and `score` equals `predict_proba(malicious)` in 0..1.
- Confirm the SVM branch exists and is unit checkable: a direct call of the score function with an SVM family model returns `score_kind = uncalibrated` and `score = sigmoid(decision_function)` (K1's default model does not run this path, so check it by unit test, not by the live stream).
- Confirm `latency_ms` on a verdict is a real, nonzero inference time.

## AC-4: backend correlates flow and verdict and pushes merged rows

- Connect a websocket client to the backend; confirm it receives `flow_verdict` events, each carrying both flow fields (the 5 tuple, `ts`) and verdict fields (`verdict`, `score`, `score_kind`, `model_id`, `latency_ms`, `ground_truth`) for the same `flow_id`.
- Orphan handling, both directions: (a) publish a verdict on `verdicts` with a `flow_id` that has no flow; (b) publish a flow on `flows` that never gets a verdict (a featurizer rejected flow does this on its own). Confirm each is held then logged and dropped by the active sweep after the hold window, the correlation map returns to empty (it does not grow), and the backend keeps relaying later flows (it does not crash).

## AC-5: the LiveFlows UI renders each row live

- Open the frontend. Confirm it connects (the StatusDot shows connected) and rows stream in, animating as they arrive, with a running count.
- Confirm a benign row shows a benign VerdictChip and its ConfidenceMeter; a malicious row shows the alert row tone and a malicious VerdictChip.
- Confirm the components are ported from the export, not reinvented (they match `ui-registry.md` names and props). K1 does not surface an `uncalibrated` label: the default model is calibrated and the `ConfidenceMeter` has no such affordance today (owed to the design system before an SVM verdict is shown, see the spec Follow-up). Do not add one in code.

## AC-6: the whole path runs on one command

- `docker compose up` brings up Redis and the four services; capture waits for the ml-service `/ready` signal (model loaded, `flows` subscription live) before it starts replaying, so no early flows are lost to Redis pub/sub. Within seconds the UI shows flows classified end to end, one flow to one verdict rendered, and a malicious flow is visibly flagged.
- Featurizer reject: feed a malformed flow (an out of range `destination_port`, or a missing required field). Confirm the ml-service logs it and skips it, and the subscribe loop keeps consuming later flows (nothing crashes, nothing misclassifies the bad flow).
- Model load failure: point the manifest at a missing model file. Confirm ml-service startup fails fast (the container is unhealthy), rather than coming up and silently classifying nothing.

## Notes

- Layer 0 already proved the scaffold, the contracts, and the featurizer parity (spec 0001). K1 does not re verify those; it proves the streaming spine, the score computation, and the UI.
- No persistence and no auth this phase. Redis stays internal to the compose network.
- Live capture, PCAP, model switching, and live metrics are later slices (F1 to F6), not verified here.
