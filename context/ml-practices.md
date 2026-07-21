# ML Practices — implementation law

> Governs *how code is written* in this project. Read top to bottom each working session.
> For **why** any rule exists, and for the decisions it enforces, see `foundation.md` (this file cites `foundation.md Section 7 #N`). When this file and `foundation.md` disagree, **`foundation.md` wins.**

**Status key:** ✅ enforced · 🟡 in progress · ⬜ applies from a later sprint

---

## Section 1 — Engineering mindset (before any code)

1. **Read the context first.** `foundation.md` Section 4 (how we work), Section 7 (locked decisions), Section 12 (open questions) — before touching code.
2. **Scope is sacred.** Implement only the block the builder approved. No optimizing, refactoring, or scaffolding ahead (foundation Section 4). One thing at a time.
3. **Verify before you claim.** Every cleaning/transform step is checked against the real data before it's called done — and the check stays in the notebook as a `print(...)` assertion. If something is unverified or failed, say so.

## Section 2 — The leakage boundary (the law that outranks convenience) ✅

The train/test split is the project's keystone (`foundation.md Section 9`, `Section 7 #9`). It divides every operation into two kinds:

- **Row-local ops** — decided per row, independent of other rows: dropping inf/NaN/duplicate/negative rows, mapping a label, clipping to a *fixed* constant, snake-casing columns. **Safe anytime**, on the full dataset.
- **Fitted ops** — learn a quantity *from the data*: imputation values, feature **scaling** stats, resampling. **Computed on `X_train` only**, then applied to `X_test`. Never before the split. (`foundation.md Section 7 #10`)

Non-negotiables:

- A statistic used to fill/scale/resample is fit on **train only** — the pending rate-column max-fill (`Section 7 #5`) uses the *train* max.
- **No label column ever enters `X`** — `label`, `label_binary`, `label_text` are dropped from features (`Section 7 #9`). Leaving one in is target leakage.
- `clip(lower=0)` and `fillna(0)` use a *chosen constant*, so they are row-local and may run pre-split; a `mean/median/max` fill may not.

## Section 3 — Reproducibility ✅

- **Fixed `random_state=42`** on every stochastic step (the split, and any future model with randomness) — so results are stable and DT-vs-SVM compare on the *identical* split (`Section 7 #9`).
- **Run from the project root.** `nid.py` uses `./data/raw/...`; notebooks (one level down) use `../data/raw/...`. Launch Jupyter from root.
- **`data/raw/` is immutable.** Never edit it; derive everything into `data/processed/`. A notebook rebuilds `df` from raw each run — never mutate `df` in place and rely on kernel state (the mistake `01_eda` made with Destination Port).
- **Pin dependencies.** `requirements.txt` is frozen (Python 3.14); don't `pip install` outside it without updating it.

## Section 4 — Data & cleaning conventions ✅

- **Columns are snake_case** via the cleaner in `02_cleaning` (`Section 7 #4`) — CICIDS ships leading-space names; never index a raw ` Label`.
- **Keep original + derived.** The multi-class `label` is preserved alongside `label_binary` / `label_text` (`Section 7 #3`).
- **Know your sentinels.** `init_win_bytes_*` = `-1` means "no TCP window" — legitimate, **not** a negative to repair (`Section 7 #7`). Don't blanket-drop negatives.
- **Each cleaning cell self-verifies** — after a transform, print the residual count it should have driven to zero (infinities, impossible negatives) so a silent regression can't hide.

## Section 5 — Notebook conventions ✅

- **Numbered, single-purpose notebooks** (`01_eda`, `02_cleaning`, then `03_*` for the tree…). A markdown header per numbered step; code cells stay small and readable (explicit over a black-box `Pipeline` — `foundation.md Section 9`).
- **A new notebook is a new kernel** — it cannot see a prior notebook's `df`; reload from `data/raw/`. This is a feature (pristine start), not a workaround.
- **Run top-to-bottom before committing** so the portfolio reader sees outputs, not just code.

## Section 6 — Style

Readable beats clever. Match the surrounding code's idiom. Comments explain **why**, not what. No unexplained magic numbers — a threshold or constant gets a one-line reason.

## Section 7 — Secrets & data hygiene ✅

No credentials or private data in this project (public dataset). Still: never commit `data/` or `.venv/` (both git-ignored); no tokens/paths-to-private-data hard-coded in notebooks.

---

*Read this file top to bottom each session. When a rule and a shortcut conflict, the rule wins.*
