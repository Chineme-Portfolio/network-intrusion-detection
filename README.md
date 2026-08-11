# Network Intrusion Detection System (NIDS)

A build-first **learning project**: Decision Tree and SVM classifiers on the **CICIDS 2017**
network-flow dataset, run as self-paced sprints. The deliverable that matters is the
*documented reasoning*, not just the classifier.

> Status: **Sprint 6 complete (model zoo + comparison)**. Sprints 0-5 done (setup, EDA,
> cleaning + split, the Decision Tree, the leakage gate, and the SVMs); port bucketing is
> folded into the pipeline (`data/processed/featured/`). Five named models built and compared
> in `07_comparison.ipynb` (the tree wins). Next: the full NIDS, a live-traffic system.

## Dataset

This repo does **not** include the data. Download the CICIDS 2017 "MachineLearningCVE" CSVs
from the [Canadian Institute for Cybersecurity](https://www.unb.ca/cic/datasets/ids-2017.html)
and place them at:

```
data/raw/MachineLearningCVE/*.csv
```

Combined: ~2.83M flows × 79 columns, heavily imbalanced (~80% BENIGN).

## Structure

```
.
├── context/
│   ├── foundation.md      # source of truth — every locked decision + reasoning
│   └── ml-practices.md    # implementation law (leakage discipline, reproducibility)
├── data/
│   ├── raw/               # CICIDS 2017 CSVs (immutable, not committed)
│   └── processed/         # cleaned + split outputs (regenerable)
├── notebooks/
│   ├── 01_eda.ipynb       # Sprint 1 exploratory analysis
│   └── 02_cleaning.ipynb  # Sprint 2 cleaning + split pipeline
├── nid.py                 # data loader
├── LEARNING_LOG.md · THOUGHTS.md · QUESTIONS.md
└── NIDS_Sprint_Framework.pdf   # the methodology (sprint structure + exit checks)
```

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Python 3.14. Run scripts and launch Jupyter from the project root.

---

## The context system (read this before continuing the build)

The source-of-truth docs an agent (or the builder's future self) reads before writing code, so decisions stay consistent across sessions.

| File | What it's for |
|---|---|
| [`context/foundation.md`](context/foundation.md) | **Source of truth.** Every locked decision + reasoning (Section 7), how-we-work (Section 4), scope, deepest risk (Section 11), open questions (Section 12). |
| [`context/ml-practices.md`](context/ml-practices.md) | Implementation law — leakage discipline, reproducibility, cleaning/notebook conventions. |
| `LEARNING_LOG.md` | Living build log (what/when) + the standing "log after any work" instruction. |
| `THOUGHTS.md` · `QUESTIONS.md` | The builder's raw thinking / running question list. |
| `NIDS_Sprint_Framework.pdf` | The methodology: sprint structure and exit checks. |

**Reading order:** `foundation.md` (esp. Section 4, Section 7, Section 12) → `ml-practices.md` → `LEARNING_LOG.md` (latest entries) → the current notebook.

**Route by need:**

| You need… | Go to |
|---|---|
| A current decision or *why* it was made | `foundation.md` Section 7 |
| A coding / cleaning convention | `ml-practices.md` |
| What's been done / what changed | `LEARNING_LOG.md` |
| The sprint structure / exit checks | `NIDS_Sprint_Framework.pdf` |
| The builder's open thinking | `THOUGHTS.md` / `QUESTIONS.md` |

**The golden rule:** when a decision changes, update `foundation.md` **first**, then ripple it into every file that references it. Never let two files disagree — `foundation.md` wins.

**Non-negotiables (must never happen):**

- Never edit `data/raw/` — it's immutable; derive into `data/processed/`.
- Never commit the data or `.venv/` (both git-ignored).
- Never let a *fitted* operation (impute / scale / resample) see the test set — train-only, post-split (leakage).
- Never let a label column leak into the feature matrix `X`.
- **Agent:** read `foundation.md` before continuing work; add a `LEARNING_LOG.md` entry after.

*Not used in this project (intentionally cut): a UI trio, `security.md`, and team-collaboration files — no UI, public dataset, solo build.*
