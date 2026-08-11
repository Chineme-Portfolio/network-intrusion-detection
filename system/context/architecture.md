# NIDS Live System — Architecture

> How the pieces fit. For *why* any choice was made, see `foundation.md` (cited as `foundation.md Section 7 #N`); for the stack's per-library usage and gotchas, see `library-docs.md`; for how code is written, see `code-standards.md`; for deploy/ops, see `devops.md`.
> **Authority:** `foundation.md` wins on any conflict.

**Status key:** ✅ built · 🟡 in progress · ⬜ planned

## Shape

```
                         Redis (pub/sub spine)
                     flows │            │ verdicts
   ┌──────────┐   publish  │            │  subscribe   ┌───────────┐
   │ capture  ├────────────┘            └──────────────┤ ml-service│
   │ (Python) │  CSV / PCAP / live NIC → FLOW RECORD   │ (FastAPI) │
   └──────────┘                                        │ featurize │
                                                       │ + classify│
   ┌──────────┐        subscribe verdicts              └─────┬─────┘
   │ frontend │◄───websocket───┤ backend (NestJS) │◄─────────┘ VERDICT
   │ (React)  │────control─────►│ REST + WS gateway│  (control: switch model,
   └──────────┘                 └──────────────────┘   start/stop, pick source → ml-service HTTP)
```

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Capture | Python adapters (CSV / PCAP / live) | replay-first; live tool picked by the parity spike (`build-graph.md` F4) |
| Featurizer | Python, shared module reused from v1 (`02`/`02b`) | the parity guarantee (`foundation.md` Section 7 #5) |
| ML service | Python + **FastAPI** + Pydantic v2, `uvicorn` | loads the registry at startup via `lifespan`; sklearn/joblib inference |
| Message bus | **Redis** pub/sub: `flows`, `verdicts` channels | decoupling spine (`foundation.md` Section 7 #7) |
| Backend | **NestJS** (TypeScript) + `@nestjs/websockets` + socket.io | control REST API + WS gateway; a Redis subscriber relays `verdicts` to clients |
| Frontend | **React 19** + Vite (TypeScript) + `socket.io-client` | flow table, model switcher, source selector, live metrics |
| Contracts | JSON schemas in `system/shared/` | flow-record, verdict, registry manifest (versioned) |
| Deploy | Docker + docker-compose (dev) → containers on Linux (prod) | see `devops.md` |

## Repo layout (under `system/`)

```
system/
  capture/     Python: replay + live adapters, publish flow records
  ml-service/  Python/FastAPI: featurizer + registry + inference, publish verdicts
  backend/     NestJS: control REST, WS gateway, Redis verdict subscriber
  frontend/    React+Vite: the operator UI
  shared/      the versioned contracts (flow-record, verdict, registry manifest)
  context/     this context system (foundation, build-graph, etc.)
  docker-compose.yml, per-service Dockerfile
```

## Boundaries (what may talk to what)

- Services communicate **only** through the contracts + Redis channels + the control HTTP API. No service reaches into another's internals.
- The **frontend talks only to the backend** (never directly to the ml-service or Redis).
- The **featurizer and the joblib models are loaded only by the ml-service** (and the offline parity spike). Nothing else imports sklearn.
- Capture never classifies; it only produces flow records. The ml-service never captures; it only consumes flow records.

## Data and tenancy

Single-user demo: **one active model per ml-service instance**, no accounts, no tenancy isolation (`foundation.md` Section 10). Flows and verdicts stream through memory; nothing is persisted this phase.

## Keystone unlock

The end-to-end verdict path on CSV replay, built full-topology (`foundation.md` Section 9, `build-graph.md` K1). Build it first; everything else is another source or a richer view.

## What-lives-where (quick rule)

- Capture/replay logic → `capture/`.
- Feature computation + model inference + model-switching → `ml-service/`.
- Orchestration, control API, the websocket → `backend/`.
- Anything visual → `frontend/`.
- A type/schema used by more than one service → `shared/`.
- Anything about deploying or operating it → `devops.md`.

## Open build-time decisions (record in `progress-log.md` when made)

- ⬜ Verdict `score` normalization across models (tree probability vs SVM margin) — `foundation.md` Section 12.
- ⬜ Exact flow-record field list + version tag (`shared/`).
- ⬜ Whether the backend subscribes Redis directly or via the socket.io Redis adapter (the adapter matters only when scaling to multiple backend instances; single instance does not need it).
- ⬜ The live-capture tool (parity spike, `build-graph.md` F4).

## References

- FastAPI lifespan + serving sklearn (loading at startup, Pydantic v2 validation), MachineLearningMastery, checked 2026-08-11: https://machinelearningmastery.com/train-serve-and-deploy-a-scikit-learn-model-with-fastapi/
- NestJS WebSocket gateway + Redis adapter, OneUptime, checked 2026-08-11: https://oneuptime.com/blog/post/2026-03-31-redis-nestjs-websocket-gateway-adapter/view
