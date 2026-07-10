# Learning Log

Living record of this project — study sessions and build work, **newest first**.

**Standing instruction (for any AI agent):** after completing work in this project, before ending your response, prepend a progress entry below. This is mandatory — the same way reading `context/foundation.md` first is mandatory. If an entry is a `decision` that changes `context/foundation.md` (or another context file), **update that file too** and add a `docs` note, so the context never drifts from what was decided.

**Entry format:** `### YYYY-MM-DD · <category> · <title>` — category ∈ {`study`, `feature`, `fix`, `refactor`, `decision`, `docs`, `chore`}. Then a line or two of *what*, and *notes* (gotchas, follow-ups). `study` entries may add `Hours:`.

---

### 2026-07-06 · feature · Sprint 3 baseline tree — first results
Unpruned entropy tree on the real 80/20: **test accuracy 0.9988, train 0.9998**; malicious **precision 0.9972 / recall 0.9966**; **FN 378 (missed intrusions), FP 310 (false alarms)** of 566,126 test flows. Dummy for contrast: accuracy 0.8030, recall 0.0000.
Notes: two red flags for Sprint 4 — (a) train accuracy < 1.0000 on an *unpruned* tree proves contradictory duplicate rows exist (identical features, opposite labels; ~450 in train) → `§7 #8`; (b) the train−test gap is only 0.0010, far too small for an unpruned tree → exact duplicates shared across the split are likely inflating the test score. Also: aggregate recall hides per-attack performance, and step 8 persisted only `label_binary`, not the multi-class `label` (`§7 #3`) needed for that breakdown — recoverable via the preserved index.

### 2026-07-06 · feature · Sprint 3 — baseline Decision Tree notebook
Created `notebooks/03_dt.ipynb`: loads the persisted split from `data/processed/*.parquet` (fresh kernel, no re-clean) → `DummyClassifier(most_frequent)` to expose the §11 trap → `DecisionTreeClassifier(criterion='entropy', max_depth=None, random_state=42)` → accuracy (test + train), confusion matrix with FN/FP named, per-class `classification_report`. Builder's calls: **entropy** (information gain, AIMA §18.3.4), **unpruned** (true baseline, exposes the overfit gap), **dummy baseline included**. No `class_weight` — that is the next experiment (`§7 #12`).
Notes: dummy numbers are exact — **accuracy 0.8030, recall 0.0000, 0 of 111,529 attacks caught**. Code path smoke-tested on a 200k subsample (every call executes); the full unpruned fit on 2.26M rows is the builder's run (~minutes). Docs: `foundation.md §3` stage → Sprint 3, `§6` arc + notebook list updated.

### 2026-07-06 · feature · Persist split to data/processed + Sprint 2 verified
Ran the full pipeline on real data — **Sprint 2 exit check passes** (notebook outputs): load 2,830,743×79 → clean 2,830,628×68 → split train (2264502, 65) / test (566126, 65), both 0.1970 malicious; step 5 impossible negatives 0, Heartbleed 11 kept; step 7 filled 1509/2867 (train max 2.07e9 / 4.0e6), NaN 0/0. Added `02` step 8: saves the four splits → `data/processed/*.parquet` with a reload round-trip check, so Sprint 3/5 train on the identical split (`§7 #9`, §10).
Docs: `foundation.md §12` persist ✅, §10 updated; `pyarrow==24.0.0` pinned in `requirements.txt`. Sprint 2 **done** → next: Sprint 3 (plain Decision Tree baseline, `§7 #12`).
Gotcha: `pyarrow` was installed into an **already-running kernel** — pandas caches its pyarrow detection at import time, so `to_parquet` kept raising `ArrowKeyError` until a full **kernel restart** (not just "Run All"). Verified on disk: `X_train.parquet` (2264502, 65), 41 int64 + 24 float64, 0 NaN, loads via `pd.read_parquet`.

### 2026-07-06 · decision · Imbalance strategy — baseline first, then reweight
Locked the class-imbalance approach: train the plain tree on the real 80/20 and evaluate by **recall + confusion matrix (never accuracy)**; *then* apply `class_weight` (hand-set ~`{0:1, 1:3}` or `'balanced'` ≈ `{0:1, 1:4}`) and measure the shift; under/oversampling (SMOTE) deferred unless the numbers demand it. Rebalancing is train-only, post-split.
Docs: added `foundation.md §7 #12`; rippled to §3, §11, §12 and `README.md` status. Rationale: you can't value an intervention without a baseline — confront the §11 trap by measuring it first.

### 2026-07-06 · feature · Rate-column train-max fill (step 7)
`notebooks/02_cleaning.ipynb`: added step 7 — fills the marked `+inf→NaN` in `flow_bytes_s`/`flow_packets_s` with each column's **train** max (`X_train[rate_cols].max()`, applied to both splits), closing the deferred fitted step in `foundation.md §7 #5`. In-cell checks print the filled counts (expect 1509 / 2867), the fill values, and NaN-remaining.
Notes: **unverified on this machine** — `data/raw/` is empty here and there's no env with pandas, so the cell hasn't been executed; the prints confirm on the builder's machine. Row-local + fitted cleaning now complete → next is the imbalance strategy decision (`§12`).

### 2026-07-06 · docs · Context system built
Consolidated all decisions into an in-repo source of truth: `context/foundation.md` (v2, converged), upgraded `README.md` into the system map, added `context/ml-practices.md` (implementation law), and evolved this log into the progress record.
Notes: lean set — UI trio / `security.md` / team files cut as N/A. `foundation.md §7` holds the decision table; private session-memory now just points here.

### 2026-07-06 · feature · Sprint 2 cleaning pipeline + train/test split
`notebooks/02_cleaning.ipynb`: snake_case headers → binary label (`label_binary`/`label_text`, malicious=1) → rate-column inf/NaN handling (`0/0→0`; `+inf→NaN` for a post-split train-max fill) → dropped 13 redundant/constant columns → repaired impossible negatives (dropped 115 benign neg-duration rows, clipped the rest, kept `init_win` −1 sentinels) → stratified split (`test_size=0.2`, `random_state=42`). Cleaned frame **2,830,628 × 68**; train 2,264,502 / test 566,126, both 19.70% malicious.
Notes: kept 308k duplicate rows (`foundation.md §7 #8`). Pending: the rate-column train-max fill, then the imbalance strategy (`§12`).

### 2026-07-06 · chore · Repo structure + first push
Lightweight structure (`data/{raw,processed}`, `notebooks/`), `.gitignore`, frozen `requirements.txt`, renamed `Untitled.ipynb` → `01_eda.ipynb`, added `nid.py`. Pushed to `origin/main`.

### 2026-04-08 · study · AIMA Ch.1 — four approaches to AI
Hours: 2. Read the four approaches to AI and the standard model.
Takeaway: the approaches support each other rather than standing independently; the standard model can be chaotic outside a controlled environment.
