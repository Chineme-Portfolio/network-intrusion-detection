# Caught — Code Standards

> How code is written here. Read top to bottom each working session. For *why* a rule exists, see `foundation.md`; for the stack, see `library-docs.md`; for deploy/pipeline security, see `devops.md` (which wins on pipeline questions). This file folds in **data-handling security** as Section 6 (no separate `security.md` this phase).
> **Authority:** `foundation.md` wins on any conflict.

## Section 1 — Engineering mindset (before any code)

1. **Read the context first:** `foundation.md` (Section 7 decisions, Section 12 open), `architecture.md` (boundaries), this file.
2. **Scope is sacred.** Build only the slice at hand (`build-graph.md`). No scaffolding ahead, no optimizing beyond the block. Hybrid mode (`foundation.md` Section 0) means fast on plumbing, careful on the seams, never sloppy.
3. **Contracts before code.** A new seam is a schema in `shared/` first, then the code that satisfies it.
4. **Verify before claiming.** A verdict path is not "done" until a real flow produces a real verdict end to end.

## Section 2 — Language and style

- **Python (capture, ml-service):** type hints on public functions; `ruff`/`black` formatting; small, readable functions over cleverness. The featurizer stays a faithful port of `02`/`02b`, not a "cleaner" rewrite (parity, `foundation.md` Section 7 #5).
- **TypeScript (backend, frontend):** `strict` on; no `any` (use the shared contract types); one source of truth for a shared type is `system/shared/`, imported, never re-declared.

## Section 3 — Repo and boundary rules

- Respect the service boundaries in `architecture.md`: services talk only via contracts + Redis channels + the control API. No cross-service imports of internals.
- Anything used by more than one service is a **contract in `shared/`**, not a copy.
- Only the ml-service imports sklearn/joblib and the featurizer.

## Section 4 — Framework conventions

- **FastAPI:** load models in a `lifespan` handler into app state; endpoints are thin (validate with Pydantic, call a service function, return a typed response). No model loading per request.
- **NestJS:** logic in providers/services, not controllers; the WebSocket gateway only relays (subscribe Redis → emit to clients); control endpoints proxy to the ml-service. Wrap external calls (ml-service HTTP, Redis) so failures are handled in one place.
- **React:** the socket layer is one module; components render state, they do not hold socket logic. Keep the flow table virtualized-friendly (streams can be long).

## Section 5 — Error handling

- No empty catches. Prefix errors with context (`[ml-service] registry load failed: ...`).
- A dropped/failed flow must not crash the stream: log it, emit nothing (or an explicit error verdict), keep consuming.
- User-facing messages are safe and generic; details go to logs.

## Section 6 — Security and secrets (folded in)

- **Secrets via environment only** (`.env` locally, never committed; injected in deploy, see `devops.md`). No hostnames, Redis URLs, or paths hard-coded.
- **Captured traffic is sensitive.** In live/PCAP mode the system sees real network data. Do **not** persist packet payloads, and do **not** log full flow contents or payloads; log flow *ids* and verdicts, not raw data. This phase persists nothing (`foundation.md` Section 8).
- **No data in URLs.** Flow/verdict data moves in message bodies and websocket frames, never in query strings.
- The dataset is public; there are no user credentials in scope. If any are ever added, they follow the same env-only rule and this section is promoted to a `security.md` (re-open the conditional-file offer).

## Section 7 — Testing posture

- The keystone gets an end-to-end check: a known replayed flow yields the expected verdict for a given model.
- The featurizer gets a parity test: its output on a sample equals the v1 pipeline's output (guards drift).
- Contracts get schema-validation tests. Fuller coverage grows with the slices; do not gold-plate ahead.

## Section 8 — Naming and comments

Readable over clever; match surrounding idiom. Comments explain **why**, not what. Channel names, model ids, and contract field names are the same strings across all services (the shared contract is the source).

---

*Read this file top to bottom each session. When a rule and a shortcut conflict, the rule wins.*
