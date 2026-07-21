# Learning Log

Living record of this project — study sessions and build work, **newest first**.

**Standing instruction (for any AI agent):** after completing work in this project, before ending your response, prepend a progress entry below. This is mandatory — the same way reading `context/foundation.md` first is mandatory. If an entry is a `decision` that changes `context/foundation.md` (or another context file), **update that file too** and add a `docs` note, so the context never drifts from what was decided.

**Entry format:** `### YYYY-MM-DD · <category> · <title>` — category ∈ {`study`, `feature`, `fix`, `refactor`, `decision`, `docs`, `chore`}. Then a line or two of *what*, and *notes* (gotchas, follow-ups). `study` entries may add `Hours:`.

---

### 2026-07-06 · feature · Folded port buckets into the pipeline (02b_features)
Created `notebooks/02b_features.ipynb`: loads `02`'s persisted split, re-encodes `destination_port` as IANA range-buckets (well-known/registered/ephemeral, one-hot), and writes a new *featured* split to `data/processed/featured/*.parquet` — the modeling input going forward. Feature set **65 → 67**. Bucketing is row-local (fixed thresholds), so applying it post-split is leakage-safe and identical to pre-split. `02`'s raw split kept (03/04 baseline).
Docs: added `foundation.md` Section 7 #13 (port encoding adopted); Section 12 port bullet → ✅. Next: Sprint 5 (SVM) trains on the featured split — where the encoding should matter most.

### 2026-07-06 · feature · Port experiment — range buckets beat raw on the DT
`exp_port_buckets.ipynb` (non-destructive; loads the split): re-encoded `destination_port` as IANA range-buckets (well-known 0–1023 / registered / ephemeral, one-hot) and retrained the same tree. **Buckets won:** acc 0.9988→0.9990, **recall 0.9966→0.9984 (missed intrusions ~379→178, roughly halved)**, precision 0.9972→0.9967 (~+57 false alarms), tree simpler (depth 67→61, leaves **3109→1733**). Trade clearly favours an IDS (FN ≫ FP cost).
Correction (again): I predicted the tree wouldn't gain — it did. Why: 51k raw port values let the tree overfit capture-specific port quirks; coarsening to 3 ranges *regularises* it and pushes it toward generalisable flow behaviour (fewer leaves + higher unseen-recall = the fingerprint). Partially validates the earlier "port might be a shortcut" worry. Docs: Section 12 port bullet updated (measured; adoption TBD); footer roadmap added. Seeds Sprint 5 — SVM (distance-based) should care even more.

### 2026-07-06 · decision · Per-attack recall out of scope — binary evaluation stands
Builder scoped per-attack recall **out**: it's inherently a multi-class breakdown, and this project is binary yes/no (Section 8, where per-attack was already "deferred"). Recovering the multi-class `label` (step 8 persisted only `label_binary`) isn't worth it for a binary detector. So Sprint 4's evaluate gate concludes on the **binary** numbers: honest recall **0.9969** on truly-unseen flows (0.9966 overall), leakage non-material — the DT baseline is validated.
Note: spot-checked per-attack once before scoping out (labels recovered via preserved index, verified against `y_test`) — no attack type below ~0.85 recall (worst: Bot 0.85; both Heartbleed test rows caught), and the rarest classes (2–7 test rows) can't be evaluated meaningfully anyway — which is itself why binary is the sane scope.

### 2026-07-06 · feature · Sprint 4 — leakage measured; it does NOT inflate the score
Built `notebooks/04_leakage.ipynb` (non-destructive; loads the persisted split). Cross-split leakage by exact feature-twins: **76,235 test rows (13.47%) have a feature-twin in train** (76,059 identical / 176 fraternal); **86.53% truly unseen**. Full unpruned tree (depth 67, **3,109 leaves**): all test 0.9988 acc / 0.9966 recall; **leaked 0.9969 / 0.9959; clean (unseen) 0.9991 / 0.9969**.
**Correction:** my earlier hypothesis (small train–test gap ⇒ duplicate leakage inflating the 0.9988) is **refuted**. clean ≥ overall — leaked rows are if anything *harder*, so leakage inflated nothing; the honest number is ~0.999. The tiny gap is because the flows are genuinely separable (3,109 leaves for 2.26M rows = rules, not row-by-row memorisation). Caveat: measures *exact* twins only (near-duplicates uncounted — matters more for SVM than trees). Section 7 #8 leakage caveat = measured, non-material → the dedup/group-split fix is now **optional** (builder's call). Still open: per-attack recall (does 0.9966 hide misses on rare classes like Heartbleed?).

### 2026-07-06 · study · Consolidation — `03_dt` reviewed (baseline + evaluation metrics)
Discussion-only walk of `03`. **Dummy** = a baseline (no learning, not a tree); `strategy='most_frequent'` always predicts the modal class (benign) → 80.3% acc, 0 recall *by construction*; other strategies noted (`prior`/`stratified`/`uniform`/`constant`). `.fit()` = train (trivial for the dummy, full tree-build for the tree). **Train acc 99.98% < 100%** on an unpruned tree = proof of *contradictory duplicate rows* (identical features, opposite labels — unsplittable; ~450 in train). **Confusion matrix**: rows = truth, cols = guess, each cell = the (truth, guess) intersection. **Classification report**: precision = down the predicted column (false-alarm meter), recall = across the actual row (miss meter = detection rate), f1 = blend, support = class size, macro avg = classes equal (honest under imbalance), weighted avg ≈ accuracy (majority dominates). recall 0.9966 < precision 0.9972 because misses (378) > false alarms (310) — the less-ideal tilt for an IDS, but a 0.0006 gap under the leakage cloud.
Q&A → `QUESTIONS.md` #23–29; framing → `THOUGHTS.md`. Next: the leakage investigation (Sprint 4).

### 2026-07-06 · docs · Replaced silcrow (§) with "Section" across all docs + notebooks
Builder preference: removed the `§` symbol project-wide. 117 occurrences across 7 files → 0. Section headers now read `## Section N — Title`; cross-references read `Section N #M`. Notebooks `02`/`03` comment + markdown refs updated too; both still parse as valid JSON. Scripted global replace was safe because every `§` was followed by a digit (no `§§`, no spaced variants) — no edge cases.

### 2026-07-06 · study · Consolidation — `02_cleaning` reviewed (leakage boundary, stratification)
Discussion-only walk of `02`. Organizing idea: the **leakage boundary** — row-local ops (rename, binarize, clip-to-a-fixed-constant) are safe either side of the split; *fitted* ops (mean/max/scale — *learned* from data) must be train-only, post-split (`Section 7 #10`). That is why step 3 *marks* the infinities but step 7 *fills* them (a max is fitted). Then the split's sharp point: it stratifies on the 15-class `label`, not the binary target — `label_binary` is the *question* (`y`), `label` is the *divider*. Stratifying on the multi-class keeps rare attacks (Heartbleed, 11 rows) in **both** splits, which is what makes the Sprint 4 per-attack evaluation possible (`Section 11`, `Section 7 #3`/`#9`).
Q&A → `QUESTIONS.md` #21–22; framing → `THOUGHTS.md`.

### 2026-07-06 · study · Consolidation — `01_eda` reviewed, core ML vocabulary
Walked `01` back conceptually (discussion only, no code): EDA as **diagnosis, not treatment**; the table model (row = *sample*, column = *feature*, one column = *label*); the `X`/`y` convention (capital = matrix, lowercase = vector, from `y = f(X)` — unrelated to plot axes); what a **flow** actually is (5-tuple + idle timeout, *not* a semantic action — keep-alive collapses many actions into one flow, a page load spans many); dimensionality reduction (PCA) as the only way to see 78 features at once; a 16-item EDA symptom checklist, 10 of which already appear in `Section 7`.
Notes: two corrections surfaced. (a) `clean_df` was **not** the `01` mistake — deriving a new name is correct; the real one was the in-place, non-idempotent `Destination Port` mapping that collapsed 51,266 ports into `"others"`. (b) That port idea was **never carried into `02`/`03`** — `destination_port` is still raw `int64`, 51,271 unique values. Logged as an open question (`Section 12`). Q&A → `QUESTIONS.md` #15–20; raw framing → `THOUGHTS.md`.

### 2026-07-06 · feature · Sprint 3 baseline tree — first results
Unpruned entropy tree on the real 80/20: **test accuracy 0.9988, train 0.9998**; malicious **precision 0.9972 / recall 0.9966**; **FN 378 (missed intrusions), FP 310 (false alarms)** of 566,126 test flows. Dummy for contrast: accuracy 0.8030, recall 0.0000.
Notes: two red flags for Sprint 4 — (a) train accuracy < 1.0000 on an *unpruned* tree proves contradictory duplicate rows exist (identical features, opposite labels; ~450 in train) → `Section 7 #8`; (b) the train−test gap is only 0.0010, far too small for an unpruned tree → exact duplicates shared across the split are likely inflating the test score. Also: aggregate recall hides per-attack performance, and step 8 persisted only `label_binary`, not the multi-class `label` (`Section 7 #3`) needed for that breakdown — recoverable via the preserved index.

### 2026-07-06 · feature · Sprint 3 — baseline Decision Tree notebook
Created `notebooks/03_dt.ipynb`: loads the persisted split from `data/processed/*.parquet` (fresh kernel, no re-clean) → `DummyClassifier(most_frequent)` to expose the Section 11 trap → `DecisionTreeClassifier(criterion='entropy', max_depth=None, random_state=42)` → accuracy (test + train), confusion matrix with FN/FP named, per-class `classification_report`. Builder's calls: **entropy** (information gain, AIMA Section 18.3.4), **unpruned** (true baseline, exposes the overfit gap), **dummy baseline included**. No `class_weight` — that is the next experiment (`Section 7 #12`).
Notes: dummy numbers are exact — **accuracy 0.8030, recall 0.0000, 0 of 111,529 attacks caught**. Code path smoke-tested on a 200k subsample (every call executes); the full unpruned fit on 2.26M rows is the builder's run (~minutes). Docs: `foundation.md Section 3` stage → Sprint 3, `Section 6` arc + notebook list updated.

### 2026-07-06 · feature · Persist split to data/processed + Sprint 2 verified
Ran the full pipeline on real data — **Sprint 2 exit check passes** (notebook outputs): load 2,830,743×79 → clean 2,830,628×68 → split train (2264502, 65) / test (566126, 65), both 0.1970 malicious; step 5 impossible negatives 0, Heartbleed 11 kept; step 7 filled 1509/2867 (train max 2.07e9 / 4.0e6), NaN 0/0. Added `02` step 8: saves the four splits → `data/processed/*.parquet` with a reload round-trip check, so Sprint 3/5 train on the identical split (`Section 7 #9`, Section 10).
Docs: `foundation.md Section 12` persist ✅, Section 10 updated; `pyarrow==24.0.0` pinned in `requirements.txt`. Sprint 2 **done** → next: Sprint 3 (plain Decision Tree baseline, `Section 7 #12`).
Gotcha: `pyarrow` was installed into an **already-running kernel** — pandas caches its pyarrow detection at import time, so `to_parquet` kept raising `ArrowKeyError` until a full **kernel restart** (not just "Run All"). Verified on disk: `X_train.parquet` (2264502, 65), 41 int64 + 24 float64, 0 NaN, loads via `pd.read_parquet`.

### 2026-07-06 · decision · Imbalance strategy — baseline first, then reweight
Locked the class-imbalance approach: train the plain tree on the real 80/20 and evaluate by **recall + confusion matrix (never accuracy)**; *then* apply `class_weight` (hand-set ~`{0:1, 1:3}` or `'balanced'` ≈ `{0:1, 1:4}`) and measure the shift; under/oversampling (SMOTE) deferred unless the numbers demand it. Rebalancing is train-only, post-split.
Docs: added `foundation.md Section 7 #12`; rippled to Section 3, Section 11, Section 12 and `README.md` status. Rationale: you can't value an intervention without a baseline — confront the Section 11 trap by measuring it first.

### 2026-07-06 · feature · Rate-column train-max fill (step 7)
`notebooks/02_cleaning.ipynb`: added step 7 — fills the marked `+inf→NaN` in `flow_bytes_s`/`flow_packets_s` with each column's **train** max (`X_train[rate_cols].max()`, applied to both splits), closing the deferred fitted step in `foundation.md Section 7 #5`. In-cell checks print the filled counts (expect 1509 / 2867), the fill values, and NaN-remaining.
Notes: **unverified on this machine** — `data/raw/` is empty here and there's no env with pandas, so the cell hasn't been executed; the prints confirm on the builder's machine. Row-local + fitted cleaning now complete → next is the imbalance strategy decision (`Section 12`).

### 2026-07-06 · docs · Context system built
Consolidated all decisions into an in-repo source of truth: `context/foundation.md` (v2, converged), upgraded `README.md` into the system map, added `context/ml-practices.md` (implementation law), and evolved this log into the progress record.
Notes: lean set — UI trio / `security.md` / team files cut as N/A. `foundation.md Section 7` holds the decision table; private session-memory now just points here.

### 2026-07-06 · feature · Sprint 2 cleaning pipeline + train/test split
`notebooks/02_cleaning.ipynb`: snake_case headers → binary label (`label_binary`/`label_text`, malicious=1) → rate-column inf/NaN handling (`0/0→0`; `+inf→NaN` for a post-split train-max fill) → dropped 13 redundant/constant columns → repaired impossible negatives (dropped 115 benign neg-duration rows, clipped the rest, kept `init_win` −1 sentinels) → stratified split (`test_size=0.2`, `random_state=42`). Cleaned frame **2,830,628 × 68**; train 2,264,502 / test 566,126, both 19.70% malicious.
Notes: kept 308k duplicate rows (`foundation.md Section 7 #8`). Pending: the rate-column train-max fill, then the imbalance strategy (`Section 12`).

### 2026-07-06 · chore · Repo structure + first push
Lightweight structure (`data/{raw,processed}`, `notebooks/`), `.gitignore`, frozen `requirements.txt`, renamed `Untitled.ipynb` → `01_eda.ipynb`, added `nid.py`. Pushed to `origin/main`.

### 2026-04-08 · study · AIMA Ch.1 — four approaches to AI
Hours: 2. Read the four approaches to AI and the standard model.
Takeaway: the approaches support each other rather than standing independently; the standard model can be chaotic outside a controlled environment.
