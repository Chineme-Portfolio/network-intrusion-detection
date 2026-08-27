# Caught — Library Docs

> The stack as used *here*. For *why* each is chosen, see `foundation.md Section 7`; for how the pieces fit, see `architecture.md`. Link out for general library docs; this file states only this project's usage and traps.
> **Authority:** `foundation.md` wins. **Rule: do not install anything outside the Approved Dependencies table without adding it here first.**

**Status key:** ✅ in use · 🟡 in progress · 🕗 TBD

## ml-service (Python)

- **FastAPI + uvicorn** 🟡 — the inference service. Load the model registry **once at startup** using the modern `lifespan` async context manager (the `on_event` decorator is deprecated); hold the loaded models in app state so they persist across requests. Expose `POST /predict`, `POST /model/switch`, `GET /models`.
- **Pydantic v2** 🟡 — request/response validation. The flow-record and verdict contracts (`shared/`) are Pydantic models; validation errors return structured 422s.
- **scikit-learn 1.8.0 + joblib** ✅(from v1) — load the five `models/*.joblib` pipelines (scaler + model bundled). **Gotcha, load-bearing:** the ml-service MUST run the *same* scikit-learn version the models were trained under (1.8.0). Unpickling a joblib artifact under a different sklearn version can warn or break, and silently shifts behavior. Pin it. (`context/foundation.md` is the authority on the models themselves.)
- **pandas + numpy** ✅(from v1) — the featurizer reuses the exact `02`/`02b` transforms; a flow record becomes the same 67-feature frame the models trained on.
- **redis (redis-py)** 🟡 — subscribe `flows`, publish `verdicts`.
- **cicflowmeter (Python fork, hieulw)** 🕗 — *candidate* live/PCAP capture tool, not yet locked (parity spike, `build-graph.md` F4). CLI: `cicflowmeter -f in.pcap -c out.csv` (PCAP) or `cicflowmeter -i eth0 -c out.csv` (live). **Gotcha:** it emits its own 80+ feature set whose column names and computation may not match the CICIDS/original-CICFlowMeter set the models trained on. This is exactly why F4 measures drift before we trust it.

## backend (NestJS / TypeScript)

- **NestJS** 🟡 + **@nestjs/websockets + @nestjs/platform-socket.io + socket.io** 🟡 — a WebSocket gateway pushes verdicts to the browser; REST controllers proxy control actions to the ml-service. A Redis subscriber (`ioredis` or `redis`) relays the `verdicts` channel into the gateway.
- **@socket.io/redis-adapter** 🕗 — only needed to fan a websocket across *multiple* backend instances. A single-instance demo does not need it; add it if we scale (`architecture.md` open decisions).

## frontend (React / TypeScript)

- **React 19 + Vite** 🟡 — the operator UI. **socket.io-client** subscribes to verdicts and renders the live flow table, the model switcher, the source selector, and the live metrics panel.

## shared + infra

- **JSON Schema / shared types** ✅ — the contracts in `system/shared/schemas/`, the single source for flow-record / verdict / registry-manifest shapes across Python and TypeScript. Draft 2020-12.
- **datamodel-code-generator** ✅ — codegen, JSON Schema to Pydantic v2 models (`--output-model-type pydantic_v2.BaseModel`). Run via `system/shared/codegen/generate.sh`. **Gotcha:** it emits an inner enum class named after the model with a numeric suffix (for example `Verdict1` inside the `Verdict` model) when a field shares the model's name; harmless, do not rename the generated file.
- **json-schema-to-typescript** ✅ — codegen, JSON Schema to TypeScript types (used via its `compileFromFile` API in `generate-ts.mjs`). Output is git ignored (`system/shared/generated/`); the schemas are the source of truth.
- **Docker + docker-compose** 🟡 — Redis + all services locally; container images for real-infra deploy (`devops.md`).

## Approved Dependencies

| Package | Service | Purpose | Status |
|---|---|---|---|
| fastapi, uvicorn, pydantic (v2) | ml-service | inference API | 🟡 |
| scikit-learn (1.8.0), joblib, pandas, numpy | ml-service | featurize + classify (v1 parity) | ✅ |
| redis (redis-py) | ml-service | pub/sub | 🟡 |
| cicflowmeter | capture | live/PCAP capture (candidate) | 🕗 |
| @nestjs/*, socket.io, ioredis | backend | control API + WS + Redis | 🟡 |
| @socket.io/redis-adapter | backend | multi-instance WS scaling | 🕗 |
| react (19), vite, socket.io-client | frontend | UI | 🟡 |
| datamodel-code-generator | shared (codegen) | JSON Schema to Pydantic v2 | ✅ |
| json-schema-to-typescript | shared (codegen) | JSON Schema to TypeScript types | ✅ |
| docker, docker-compose | infra | local + deploy | 🟡 |

**No dependency is added without a row here first.**

## References

- FastAPI `lifespan` + serving scikit-learn, MachineLearningMastery, checked 2026-08-11: https://machinelearningmastery.com/train-serve-and-deploy-a-scikit-learn-model-with-fastapi/
- NestJS WebSockets + Redis adapter, OneUptime, checked 2026-08-11: https://oneuptime.com/blog/post/2026-03-31-redis-nestjs-websocket-gateway-adapter/view
- Python cicflowmeter (hieulw), PyPI / repo, checked 2026-08-11: https://pypi.org/project/cicflowmeter
