# Network Intrusion Detection — Agent context

> Front door for AI agents. This repo holds **two** context systems. Durable decisions live in them; this file routes you and states the rules that never bend.

## The two context systems

- **ML research project (v1, complete)** — repo-root `context/` + `LEARNING_LOG.md`. Authority on the **model**: the trained artifacts (`models/*.joblib`), the feature contract, the delta-ratio evaluation. Start at `context/foundation.md`.
- **Caught, the deployable NIDS system (v2, active build)** — `system/` + `system/context/`. Authority on the **system**: capture, serving, orchestration, UI. Start at `system/README.md`.

**Precedence:** on a *model* question, `context/foundation.md` wins. On a *system* question, `system/context/foundation.md` wins. Never re-decide a locked decision, cite it (`... foundation.md Section N`) instead.

## If you are building the system (the current work)

Read before you build: `system/README.md`, then `system/context/foundation.md`, `architecture.md`, `code-standards.md`, and the relevant `library-docs.md` / `devops.md`. Pick the slice from `system/context/build-graph.md`.

## Agent skills

Installed for this build (open a skill's `SKILL.md` on demand):
- `context-system` — builds/maintains the context systems.
- `architect` — designs a slice; writes its spec to `docs/specs/`.
- `develop` — builds a slice from its spec's `## Build plan`.
- `check` — `verify` proves behavior against the spec; `review` is a senior code review.

## Standing instructions

1. Before writing code: read the relevant context files above (system work → `system/context/`).
2. After completing any work: append an entry to the matching progress log — system work → `system/context/progress-log.md`, ML work → `LEARNING_LOG.md`. Mandatory, like reading context first.
3. A decision made mid-work updates the affected context file immediately, and its `foundation.md` first if it changes a locked decision, then is logged the same session. Two files never disagree.
