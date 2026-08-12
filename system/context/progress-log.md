# Caught — Progress Log

> The living build record for the **system** (phase 2). For the ML research project's history, see the root `LEARNING_LOG.md`. For settled decisions, see `foundation.md`; for what-depends-on-what, see `build-graph.md`.

**Standing instruction (for any AI agent):** after completing any work in `system/`, before ending your response, prepend a progress entry below. This is mandatory, the same way reading `foundation.md` first is mandatory. If an entry is a `decision` that changes `foundation.md` (or another context file), **update that file too** and add a `docs` note, so the context never drifts from what was decided.

**Entry format:** `### YYYY-MM-DD · <category> · <title>` where category is one of {`feature`, `fix`, `refactor`, `chore`, `decision`, `docs`}. Then **area** (capture / ml-service / backend / frontend / shared / infra / context), one line of *what*, and *notes* (gotchas, follow-ups). Newest first.

---

### 2026-08-11 · decision · Named the system "Caught"; added the design handoff
Area: context. Named the system **Caught** (the verdict a NIDS delivers: an intrusion caught, or a false alarm; continues the Inertia/Graphite naming line). Rippled the name across all `system/` files and the root `AGENTS.md`; `foundation.md` -> v3, Section 12 name question resolved. Added `design-handoff.md` (the Claude Design intake prompt + the UI-trio generation prompt) and created `ui-tokens.md` / `ui-rules.md` / `ui-registry.md` as PENDING stubs. UI prime directive chosen: "make the current verdict, and whether to trust it, obvious at a glance."

### 2026-08-11 · docs · Phase 2 kickoff, system context system created
Area: context. Opened phase 2 (the deployable NIDS system) as a separate context system in `system/`, layered on the v1 ML foundation. Wrote `foundation.md` (v2, converged), `build-graph.md`, and this log.
Decisions locked (`foundation.md` Section 7): separate context system citing the v1 model facts; hybrid build mode; capture behind a pluggable interface with replay-first; live-capture tool deferred to a measured parity comparison (Java CICFlowMeter last commit 2023-12, Python fork 2026-03 but a third-party reimplementation); reuse the v1 featurizer; five-model hot-switchable registry; FastAPI ml-service; Redis `flows`/`verdicts` spine + websockets; CSV + PCAP replay + live metrics in-phase; keystone built full-topology; Linux/container deploy.
Then wrote the rest of the context system, grounded in current docs (2026-08): `architecture.md`, `library-docs.md`, `code-standards.md`, `devops.md` (real deploy surface; security folded into code-standards), and `system/README.md`; provisioned the root `AGENTS.md` routing both context systems. Context system complete.
Next: the keystone slice (build-graph K1), starting with Layer 0 (L0.1 scaffold, L0.2 contracts, L0.3 featurizer extraction).
