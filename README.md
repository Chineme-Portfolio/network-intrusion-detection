# Network Intrusion Detection System (NIDS)

A build-first learning project: Decision Tree and SVM classifiers on the **CICIDS 2017**
network-flow dataset. Structured as self-paced sprints (see `NIDS_Sprint_Framework.pdf`).

> Status: Sprint 2 — Clean & Prep (Sprints 0–1 complete: setup + EDA).

## Dataset

This repo does **not** include the data. Download the CICIDS 2017
"MachineLearningCVE" CSVs from the
[Canadian Institute for Cybersecurity](https://www.unb.ca/cic/datasets/ids-2017.html)
and place them at:

```
data/raw/MachineLearningCVE/*.csv
```

Combined: ~2.83M flows × 79 columns, heavily imbalanced (~80% BENIGN).

## Structure

```
.
├── data/
│   ├── raw/         # CICIDS 2017 CSVs (immutable, not committed)
│   └── processed/   # cleaned + split outputs (regenerable)
├── notebooks/
│   └── 01_eda.ipynb # Sprint 1 exploratory analysis
├── nid.py           # data loader
├── LEARNING_LOG.md  # session log
├── THOUGHTS.md      # raw thinking / diagnoses
└── QUESTIONS.md     # running question list
```

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Python 3.14. Run scripts and launch Jupyter from the project root.
