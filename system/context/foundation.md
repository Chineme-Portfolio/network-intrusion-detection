# Caught — Foundation

> **Status:** v3 — converged. Created 2026-08-11, last updated 2026-08-11. Changes from v2: the system is named **Caught** (Section 12 resolved). Prior (v1 to v2): the reference architecture ratified, phase scope set to CSV + PCAP + live detection metrics, keystone built full-topology. Still open: `score` semantics across models, and the live-capture tool (deferred to a parity measurement).
> **What this governs:** the *deployable NIDS system* (replay + live traffic capture, model serving, runtime model-switching, backend, UI). It is a separate context system from the ML research project.
> **Authority and precedence.** The ML project's `context/foundation.md` is the source of truth for the **model** (the trained artifacts, the feature contract, the evaluation method); this file cites it and never restates it. This file is the source of truth for the **system** (capture, serving, orchestration, UI). One winner per question: on a *model* fact the ML foundation wins, on a *system* fact this file wins. If this file and a system-layer file (`architecture.md`, `build-graph.md`, ...) disagree, this file wins.
> **Name:** Caught, the verdict a NIDS exists to deliver (an intrusion caught, or a false alarm). Continues the v1 naming line: Inertia, Graphite, now Caught.

**Status key:** ✅ locked · 🟡 in progress · ⬜ planned · 🕗 TBD (decide later) · **[LOCKED]** inline on settled decisions

---

## Section 0 — Build constraints

Solo. This is **phase 2** of the project. The ML research project (v1, `context/foundation.md`) is complete: Sprint 6, a five-model zoo built, evaluated, and compared. That work deliberately scoped the deployable system *out* (`context/foundation.md` Section 8 and its roadmap footer: a real deployment "stays out of scope, the trained model is only ~20% of it"). This foundation opens that ~80% as a deliberate new product.

**Purpose split:** v1 was a *learning* project (understanding beats speed). This is a *build* project: a working, deployable, demoable system that is a portfolio piece and runs on real infrastructure. Different purpose, different stack, different definition of "done."

**Build mode (hybrid) [LOCKED]:** normal build pace on standard plumbing (NestJS and React scaffolding, wiring, config); deep, block-by-block teaching reserved for the genuinely novel seams (the model-serving contract, model-switching, live-flow feature extraction and its parity problem, the streaming topology). This relaxes the intensive learn-everything protocol of `context/foundation.md` Section 4, by the builder's explicit choice, for this phase.

**Deploy intent:** the system is meant to run on **real infrastructure** (Linux hosts and containers), not only a laptop. This gives it a genuine deploy surface.

## Section 1 — What it is

A deployable Network Intrusion Detection System that captures network flows (from **replayed** data or a **live** interface), classifies each flow benign vs malicious using the trained model zoo from v1, and lets the operator **switch models at runtime** the way you switch models in a chat app. It shows the flows and verdicts live in a web UI.

The edge, same spirit as v1: the deliverable a reader values is the *integrated, legible system*, not just a running model. It turns a notebook result into a thing you can point at live traffic.

## Section 2 — Who it's for

Primarily the builder (now learning system integration and deployment, not ML theory). Secondarily: (a) a portfolio viewer, who sees a working NIDS with a live UI and model-switching, far more tangible than a notebook; (b) future agent sessions continuing the build without re-deciding what is settled.

## Section 3 — Success and stage

**Success** = a deployed system that ingests flows (replay first, live later), classifies them with any of the five models, lets the operator switch the active model at runtime, and streams flows plus verdicts to a web UI, running on real infra. Bonus: in replay mode over the labeled CICIDS data, it shows live detection quality (recall/precision, and the delta-ratio lens from v1).

**Non-goals for success:** it does not need to be a production-grade sensor (no SIEM integration, no distributed sensor fleet, no alert-response automation, no high-availability guarantees). It needs to be real, correct on the features it sees, and demoable.

**Stage:** **Foundation converged** (v2). No system code yet. Next: the remaining system context files (build-graph, architecture, library-docs, code-standards, README), then the keystone vertical slice.

## Section 4 — Guiding principles

- **Replay before live.** The CSV replay path feeds the models their exact training features (zero parity risk). Build the whole system on it first; add live capture only once the end-to-end path works. (Section 9, Section 11.)
- **Parity is measured, never assumed.** No live-capture tool is trusted until its output features are compared against the training distribution. (Section 11.)
- **Explicit contracts over shared internals.** The seams (flow record, verdict, model registry) are explicit, versioned data contracts, so capture, serving, backend, and UI stay decoupled and any piece can be swapped.
- **The model is a black box behind a contract.** The system loads the joblib pipelines from v1 and treats them as artifacts; it does not retrain or restate model reasoning (that lives in `context/foundation.md`).
- **Reuse the v1 pipeline.** Featurization is the exact `02`/`02b` cleaning and port bucketing from v1, reused as a shared step, not reimplemented, so serving-time features match training.
- **Deploy-shaped from the start.** Runs in containers on Linux; secrets and config via environment, not hard-coded.

## Section 5 — Core model

The central object is still a **network flow** (`context/foundation.md` Section 5), now moving through a live pipeline:

```
source (replay CSV / replay PCAP / live NIC)
   -> capture adapter        == FLOW RECORD contract ==>
   -> featurize (reuse 02/02b: clean + port-bucket)  -> 67-feature vector
   -> inference (active model from the registry)      == VERDICT contract ==>
   -> stream (Redis -> backend -> websocket)
   -> UI (flow table + verdicts + model switcher)
```

Two contracts define the system: the **flow record** (capture out) and the **verdict** (inference out); shapes locked in Section 7 #9. The **model registry** is the third named object: the set of loadable models and the currently active one.

## Section 6 — Surfaces and services

A polyglot set of services under `system/` (repo subfolder):

- `system/capture/` — Python capture adapters: CSV-replay (first), PCAP-replay, live-NIC (later). Emits flow records.
- `system/ml-service/` — Python inference service (FastAPI): loads the model registry and the v1 featurizer, classifies flows, emits verdicts. Owns model-switching.
- `system/backend/` — NestJS: orchestration, control API (start/stop, select source, switch model), holds the websocket to the UI.
- `system/frontend/` — React: live flow table, verdict stream, model switcher, source selector, live detection metrics.
- Redis — pub/sub spine between services.
- `system/shared/` — the versioned contracts (flow record, verdict, registry manifest).

## Section 7 — Locked decisions

Other system files cite these as `system/context/foundation.md Section 7 #N`.

| # | Decision | Reasoning | Rejected alternative |
|---|---|---|---|
| 1 | **Separate context system** in `system/`, citing the ML `context/foundation.md` for model facts | Two genuinely different projects (learning vs build; sklearn/Jupyter vs polyglot app); one welded foundation would fight itself. Clean precedence, two legible portfolio pieces | Extend the v1 foundation to a "phase 2" (muddies the clean v1 artifact; the learning-project framing conflicts with an app build) |
| 2 | **Hybrid build mode** for this phase | Section 4 of v1 (decide-everything, teach-with-citations, block-by-block) was written for learning ML; a mostly-plumbing app build does not need every line taught. Deep-dive the novel seams, move on the rest | Full v1 protocol (agonizingly slow over standard plumbing); pure build mode (loses the learning value on the interesting seams) |
| 3 | **Capture is a pluggable interface behind the flow-record contract; replay-first** | The models need training-parity features; CSV replay gives them *exactly* (zero risk) and unblocks the whole system without solving live capture first. The live tool becomes a swappable implementation | Build live capture first (front-loads the hardest, riskiest part; blocks everything on it) |
| 4 | **Live-capture tool chosen on measured parity, not now** (leaning containerized original Java CICFlowMeter) | The original Java tool made the training data (best bug-for-bug parity) but is dormant (last commit 2023-12) and painful to build; the Python fork is fresher (2026-03) but a third-party reimplementation with unverified parity. Neither is safe to lock blind; measure drift against training, then choose | Lock the Java tool now (unverified build/parity on live); lock the Python fork now (reimplementation parity risk) |
| 5 | **Reuse the v1 featurizer** (`02`/`02b` clean + IANA port bucketing) as the serving-time feature step | Serving features must match training exactly (`context/foundation.md` Section 7 #4-#9, #13); reimplementing invites drift | Reimplement featurization in the service (silent divergence from training) |
| 6 | **Model registry of the five v1 models, hot-switchable at runtime** | The core demo idea (switch models like a chat app); the joblib pipelines already bundle scaler and model; all five are small enough to hold in memory | One fixed model (loses the comparison story that is the project's spine); retrain-on-switch (pointless, the models are frozen artifacts) |
| 7 | **Redis pub/sub as the streaming spine; WebSockets to the UI** | Decouples capture, serving, and backend, fits a continuous flow stream, standard for live dashboards | Direct HTTP calls end to end (couples services, awkward for a continuous stream) |
| 8 | **Deploy on Linux and containers (real infra)** | The stated goal; containerizing also solves the Java tool's build-pain and makes the sensor placeable near real traffic | Laptop-only demo (not the goal); serverless (awkward for a stateful live packet-capture sensor) |
| 9 | **Reference architecture ratified:** flow-record and verdict contracts (`system/shared/`); a **FastAPI** ml-service loading the featurizer + registry; Redis `flows`/`verdicts` channels; NestJS control API + websocket; React UI. Registry = a manifest (model_id -> joblib + v1 metrics), all five loaded at startup, switch by id | Standard, decoupled, swappable seams; FastAPI is the common Python serving choice and pairs cleanly with the sklearn/joblib artifacts | A single monolith (loses the polyglot showcase and the decoupling); gRPC between services (heavier than needed for a demo) |
| 10 | **Phase scope: CSV replay + PCAP replay + live detection metrics; keystone built full-topology from the start** | Prove the polyglot architecture end to end before fanning out; the metrics tie the system back to v1's evaluation story (the CICIDS labels are already present) | Thin vertical then refactor (rebuilds the seams); CSV-only MVP (defers the parts with the most portfolio value) |

## Section 8 — Scope

### In (this phase)
Replay ingestion (CSV and PCAP); the v1 featurizer as a serving step; a Python inference service over the five-model registry with runtime model-switching; a NestJS backend with a control API and a websocket; a React UI (flow table, verdicts, model switcher, source selector, live metrics); live detection metrics (recall/precision + delta-ratio) in replay over labeled data; Redis streaming; containerized deployment on Linux; live-NIC capture as the final in-phase slice, gated on a parity measurement.

### Out / cut
SIEM integration, alert-response automation, distributed multi-sensor fleets, high-availability/failover, user accounts/multi-tenancy, retraining or online learning, model-explainability UI beyond the verdict and score.

### Deferred
Attack-family (multi-class) verdicts (v1 kept binary); a "corrected" feature extractor for better-than-CICIDS parity; historical storage/search of past flows; auth if it ever leaves a demo context.

## Section 9 — Architecture keystone

The keystone unlock is the **end-to-end verdict path on replayed CSV data**: one flow record in, featurized, classified by the active model, verdict out, streamed to the UI. Everything before it is scaffolding; everything after it ("add live capture", "add model-switching UI", "add metrics") is the same path with a different source or a richer view. Build this one vertical slice first, then fan out (this shapes `build-graph.md`).

**Built full-topology from the start (Section 7 #10):** the keystone already spans the real services (Python ml-service, Redis, NestJS, React) on CSV replay, so the architecture is proven before the fan-out, not retrofitted.

- **Contracts are the boundaries.** Flow record and verdict are versioned; services communicate only through them plus Redis channels.
- **The featurizer is shared, not duplicated.** One implementation, reused from v1, so training and serving cannot drift.

## Section 10 — Known scale seams

- **Live packet capture needs a real vantage point** (a SPAN/mirror port or a TAP) and capture privileges (root or `CAP_NET_RAW`) on the sensor host. Replay has neither constraint, another reason it is first. 🕗
- **Single active model per service instance** (single-user demo). Multi-session or per-stream model selection is out of scope for now. 🕗
- **Throughput:** the O(n^2) kernel SVMs (Graphite 2.x) are slow per-flow at inference; fine for a demo stream, a bottleneck at real line rate. Inertia (the tree) is near-instant. Flag when live. 🕗
- **In-memory only:** flows and verdicts stream through; no persistence in this phase (deferred, Section 8).

## Section 11 — The deepest risk

**Live-capture feature parity.** The whole system is meaningful only if the features it computes at capture time match what the models saw in training. The training data carries CICFlowMeter's specific quirks (a timestamp-encoding bug in the Active/Idle stats, a duplicated header-length feature, TCP-flow construction choices), so "more correct" live features can be *worse* for these models. If live features drift, the models are blind on real traffic and the live demo is hollow: the exact hollow-number failure v1 was built to avoid, now at the system layer. This is why replay-first (exact features) is the spine, and why any live tool must be validated by measuring feature drift against the training distribution before it is trusted (Section 4, Section 7 #3-#4). It detonates at the **live-capture slice**, not before.

## Section 12 — Open questions

- ✅ **The flow-record contract** — shape locked (Section 7 #9): JSON, the CICFlowMeter fields plus capture metadata (flow_id, 5-tuple, timestamp). The exact field list and version tag are pinned when the contract is built (`system/shared/`).
- 🕗 **Verdict `score` semantics** — the verdict *shape* is locked (Section 7 #9); what `score` *means* across models (tree class probability vs SVM margin distance, and whether to normalize to a common 0..1) is decided when inference is built. This is one of the seams to teach.
- ✅ **Service topology / Redis** — locked (Section 7 #7, #9): `flows` and `verdicts` channels; control over HTTP.
- ✅ **ML serving shape** — FastAPI (Section 7 #9).
- ✅ **Model registry shape** — manifest, all five loaded at startup, switch by id (Section 7 #9).
- ✅ **Replay sources** — CSV and PCAP, both in-phase (Section 7 #10).
- ✅ **Live detection metrics** — in-phase (Section 7 #10).
- ✅ **System name** — **Caught** (the verdict a NIDS delivers; continues the Inertia/Graphite naming line).
- 🕗 **Live-capture tool** — deferred to a measured parity comparison (Section 7 #4).

---

> Cites: the ML project `context/foundation.md` (model, features, evaluation) is the authority for everything about the classifier; this file never restates it.
