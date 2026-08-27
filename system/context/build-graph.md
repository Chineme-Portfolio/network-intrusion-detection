# Caught — Build Graph

> **What this is:** a map of what-requires-what for the system, **not** a timeline or a prescribed order. For *why* any piece exists, see `foundation.md` (cited as `foundation.md Section 7 #N`). For lifecycle/what-is-built, see `progress-log.md`.
> **Authority:** `system/context/foundation.md` wins on any conflict.

**How to read this file.** Nodes are capabilities. An edge "X needs Y" is a **hard requirement** (X cannot work without Y) unless marked *soft* (X is easier or better with Y, but buildable without). Build the **keystone** first, then fan out; most later work is "the same path, different source or richer view." Slices may span more than one service.

**Status key:** ✅ built · 🟡 in progress · ⬜ planned

---

## Layer 0 — foundational prerequisites (build first, unblock everything)

These have no dependencies and gate almost all downstream work. All three are buildable from a cold start.

- **L0.1 Repo + infra scaffold** ✅ — the `system/` service skeletons (`capture/`, `ml-service/`, `backend/`, `frontend/`, `shared/`) and a `docker-compose` that stands up Redis and the services locally. *Needs:* nothing. *Built 2026-08-12:* `docker compose up` starts all five; ml-service `GET /health` returns 200 (AC-1 verified).
- **L0.2 The shared contracts** ✅ — `system/shared/`: the **flow-record** schema, the **verdict** schema, and the **registry manifest** schema (versioned). Every service reads these. *Needs:* nothing (design from `foundation.md` Section 7 #9). *Built 2026-08-12:* three JSON Schemas (draft 2020-12) in `shared/schemas/`, codegen to Pydantic v2 + TypeScript, and a two language validation check (samples validate, a missing required field is rejected) both green (AC-2, AC-3 verified).
- **L0.3 The v1 featurizer as an importable module** ✅ — extract the `02`/`02b` cleaning + IANA port bucketing from the notebooks into a shared Python function the ml-service imports, plus access to the five joblib models in `models/`. *Needs:* nothing (pure refactor of v1 code). This is the parity guarantee (`foundation.md` Section 7 #5). *Built 2026-08-12:* `system/ml-service/featurizer/` ports `02`/`02b` faithfully, reads the frozen `featurizer_meta.json` (train max, 67 column order, dtypes), and a golden fixture parity test reproduces frozen v1 exactly on 25 rows and catches drift (AC-4, AC-5, AC-6 verified). Model loading is wired at K1.

## Keystone unlock — the end-to-end verdict path on CSV replay

- **K1 One flow to one verdict, streamed, full topology** ✅ — CSV-replay capture publishes a flow record to Redis `flows`; the FastAPI ml-service subscribes, featurizes (L0.3), classifies with a single loaded model, publishes a verdict to Redis `verdicts`; NestJS subscribes and pushes it over a websocket; React renders it in a flow/verdict table. *Needs:* L0.1, L0.2, L0.3. *Built 2026-08-27 (spec 0002):* `docker compose up` runs the whole spine; 1500 flows classified end to end, malicious flagged, verdicts match ground truth; locked with 36 unit tests. The fan-out (F1 to F7) is now unblocked.
- **Why keystone:** once one flow travels the whole spine, every other capability below is "more of the same": another source, another model, a richer view. It proves the polyglot architecture before the fan-out (`foundation.md` Section 9, Section 7 #10).

## Fan-out — capabilities and their dependency edges

Each needs the keystone (K1) unless noted.

- **F1 Model registry + runtime switching** ⬜ — load all five models at startup from the manifest; a control endpoint switches the active model by id. *Needs:* K1, L0.2 (manifest). *Soft:* independent of the UI (testable via the control API alone).
- **F2 Model-switcher UI** ⬜ — the React control to pick the active model, calling NestJS -> ml-service. *Needs:* F1, K1.
- **F3 Live detection metrics** ⬜ — with CSV replay of *labeled* CICIDS data, accumulate running recall/precision and the delta-ratio lens (`context/foundation.md` Section 12 evaluation method) from verdicts vs ground-truth labels; surface in the UI. *Needs:* K1. *Soft:* better with F1 (compare models live).
- **F4 Capture-tool parity spike** ⬜ — run each candidate tool (original Java CICFlowMeter, the Python fork) on a known PCAP; compare the output feature distribution against the CICIDS training data; pick the live tool on the result. *Needs:* L0.3 (the training-feature reference). Gates F5 and F6. (`foundation.md` Section 7 #4, Section 11.)
- **F5 PCAP replay** ⬜ — replay a PCAP file through the chosen capture tool into the `flows` channel (same contract as CSV replay). *Needs:* F4 (a chosen tool), K1.
- **F6 Live-NIC capture** ⬜ — the chosen tool reads a live interface into `flows`. *Needs:* F4, plus a vantage point (SPAN/mirror or TAP) and capture privileges (root / `CAP_NET_RAW`) on the sensor host (`foundation.md` Section 10). Last in-phase slice.
- **F7 Containerized deploy on Linux** ⬜ — Dockerfiles per service + compose/orchestration for real infra. *Needs:* the services it packages (incremental; can start once K1 runs). *Soft:* the Java tool, if chosen, is containerized here (`foundation.md` Section 7 #8).

## Buildable from a cold start (no prerequisites)

L0.1, L0.2, L0.3, and the F4 parity spike (it only needs the training-feature reference, not the running system). Everything else waits on the keystone.

## The one genuine tension

PCAP replay (F5) and live capture (F6) are both in-phase, but they **hard-depend on the live-capture-tool decision** (F4), which was deliberately deferred to a parity measurement (`foundation.md` Section 7 #4). The apparent circularity ("you need a tool to measure, but you measure to pick a tool") resolves because **F4 is a standalone spike**: it runs each candidate tool offline against a known PCAP and compares to the training distribution, with no running system required. So the honest order is: keystone and the CSV-replay capabilities (K1, F1, F2, F3) do not wait on F4; PCAP and live (F5, F6) sequence *after* F4. Do not start F5/F6 before F4 has picked a tool on evidence.

## Explicitly out of scope (not in this graph)

SIEM integration, multi-sensor fleets, high-availability, auth/multi-tenancy, flow persistence/history, retraining or online learning (`foundation.md` Section 8).
