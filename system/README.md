# Caught — Context Map

Front door for the **deployable NIDS system** (phase 2): capture (replay + live), model serving, runtime model-switching, backend, UI. This is a **separate context system** from the ML research project at the repo root; it cites that project for model facts and never restates them.

> **Precedence.** The repo-root `context/foundation.md` is the authority on the **model** (trained artifacts, feature contract, evaluation). The files here are the authority on the **system**. On a model question the ML foundation wins; on a system question `system/context/foundation.md` wins.

## The files

| File | Its job |
|---|---|
| `context/foundation.md` | The seed: every locked system decision + reasoning (the authority here) |
| `context/architecture.md` | How the services fit: shape, stack, boundaries, what-lives-where |
| `context/code-standards.md` | How code is written here (read top-to-bottom each session); folds in data-handling security |
| `context/library-docs.md` | The stack, per-library usage + gotchas, approved dependencies |
| `context/devops.md` | Environments, container deploy, secrets, and the DevSecOps gates |
| `context/build-graph.md` | What depends on what (the dependency map, keystone-first) |
| `context/progress-log.md` | What has actually been built (newest first) |
| `context/design-handoff.md` | The Claude Design intake prompt + the prompt that generates the UI trio |
| `context/ui-tokens.md`, `ui-rules.md`, `ui-registry.md` | The UI trio (PENDING until the design export exists) |

## Reading order

`foundation.md` → `architecture.md` → `code-standards.md` → `library-docs.md` → `devops.md` → `build-graph.md`. `progress-log.md` is ongoing.

## Route by need

- **Building a slice?** → `build-graph.md` (pick it) + `architecture.md` (where it lives)
- **Adding a dependency?** → `library-docs.md` (add a row first)
- **Deploying or securing the pipeline?** → `devops.md`
- **How is code written here?** → `code-standards.md`
- **Why is something the way it is?** → `foundation.md` (or the ML `context/foundation.md` for the model)
- **What is already built?** → `progress-log.md`

## Golden rule

When a decision changes, update `foundation.md` **first**, then ripple it into every file that references it, and log it in `progress-log.md`. Never let two files disagree.

## Non-negotiables

- **Parity is measured, never assumed** (`foundation.md` Section 11). No live tool is trusted until its features are compared to training.
- **The featurizer is reused from v1, not reimplemented** (`foundation.md` Section 7 #5).
- **Contracts before code** (`shared/` first), and services talk only through them + Redis.
- **Secrets via environment only; never persist or log captured payloads** (`code-standards.md` Section 6).
- **Replay before live** (`build-graph.md`).

## Pending

- **UI trio** (`ui-tokens.md`, `ui-rules.md`, `ui-registry.md`) are **PENDING stubs**, generated from a Claude Design export once it exists. The intake prompt (what to paste into Claude Design) and the generation prompt live in `design-handoff.md`.
- **Live-capture tool** is undecided pending the parity spike (`build-graph.md` F4).
