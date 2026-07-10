# Network Intrusion Detection (NIDS) — Foundation

> **Status:** v2 — converged. Last updated 2026-07-06. Changes from v1: inlined the full "how we work" collaboration protocol into §4 (removed the pointer to private session memory); builder signed off on the §7 decision table and the §11 risk framing.
> **Source of truth.** Every other file (`README.md`, `context/ml-practices.md`, `LEARNING_LOG.md`) references this; none restate it. If any file disagrees with this one, this one wins.
> Real name — no codename. Methodology lives in `NIDS_Sprint_Framework.pdf`; this file holds the *technical* decisions and reasoning.

**Status key:** ✅ locked · 🟡 in progress · ⬜ planned · 🕗 TBD (decide later) · **[LOCKED]** inline on settled decisions

---

## §0 Build constraints

Solo. A **learning project** first, portfolio artifact second. Self-paced — no calendar; sprints advance on exit checks, sessions logged in `LEARNING_LOG.md`. Budget: local machine + a public dataset (free). Builder background: M.S. Software Engineering, Application Security → AI Security — the security domain knowledge is the asset the ML is layered onto.

**The forcing function:** understanding beats speed. The goal is to grasp every decision deeply enough to replicate the whole workflow solo later. This is why scope stays narrow (§8) and why *how we work* (§4) is itself a locked constraint, not a preference.

## §1 What it is

A Network Intrusion Detection System that classifies network flows as **benign vs malicious**, built as a hands-on vehicle for learning machine learning — Decision Tree first, then SVM — on the CICIDS 2017 dataset.

The edge: it leverages an existing security background rather than starting cold, and it optimizes for *understood* decisions over an impressive-looking model. The deliverable a reader values isn't the classifier — it's the documented reasoning around it.

## §2 Who it's for

Primarily the builder (learning ML from a security foundation). Secondarily: (a) future AI coding-agent sessions that need to continue without re-deciding what's settled, and (b) a portfolio reader — a hiring manager, or the builder's own future "AI Fundamentals" self — who should be able to read the repo and follow the thinking.

## §3 Success & stage

**Success** = both: a portfolio piece whose reasoning is legible to someone else, and genuine ML understanding (can explain every choice cold). Not a production detector.

**Stage:** **Sprint 3** (Decision Tree). Sprints 0–2 complete — cleaning, split, and the train-max fill verified on real data; the split is persisted to `data/processed/`. The imbalance strategy is **decided** (§7 #12). `03_dt.ipynb` holds the baseline tree, awaiting its first full run. See the sprint arc in §6.

## §4 Guiding principles

### How we work — the collaboration protocol [LOCKED]

This is a **learning project**, so the working method is itself a locked constraint (§0). Any agent picking up this repo works this way:

- **The builder drives every decision** — methodology, data handling, modeling, down to small details. The agent does **not** make methodological or architectural calls on their behalf.
- **The agent builds only after a decision is made**, then writes exactly the code that implements it — nothing more. No optimizing, refactoring, or scaffolding beyond the current block.
- **Block by block.** Finish one block, wait for review and the builder's call on the next, then proceed. Never jump ahead.
- **Surface decision points first.** For each block, lay out the realistic options and their trade-offs (in ML *and* security terms), give a strong recommendation, then wait — don't pick for them.
- **Teaching is part of the job.** Explain the reasoning behind each decision (what it does, why it matters, what the alternatives cost) and cite the source — the relevant AIMA (Russell & Norvig, 3rd ed.) section and the library/tool docs — so the builder can read it themselves.
- **Push-back is the service.** If the builder is about to make a weak decision, say so and steelman the alternative — then let them make the final call. Affirmation teaches nothing.
- **Verify before claiming.** Check every transform against the real data before calling it done; report outcomes honestly — if something is unverified or failed, say so.
- **Documentation discipline:** `LEARNING_LOG.md` (what/when/hours), `THOUGHTS.md` (raw thinking, diagnoses), `QUESTIONS.md` (running question list). The builder directs when to write to these.
- **Between sprints, run the checkpoint ritual:** (1) what the exit check produced, (2) what surprised or broke, (3) what's still `[Unsolved]` — then spec the next sprint together.

*Why this shape:* the friction of deciding **is** the curriculum; if the agent decides or builds ahead, the learning happens to the wrong party. (The framework PDF says "you write the code"; in this collaboration the builder has asked the agent to be the hands — the builder stays the decider.)

### Technical principles

- **"Done" is defined, not felt.** Every sprint has an exit check; advance on proof, not boredom.
- **Just-in-time theory.** Pull the exact slice of AIMA / scikit-learn docs when a concrete confusion makes the question real — not chapter-first.
- **Honest evaluation over flattering numbers.** The imbalance and leakage traps are confronted, not hidden (§11).
- **Raw data is immutable.** Never edit `data/raw/`; derive everything into `data/processed/`.

## §5 Core model

The central object is a **network flow** — one CICFlowMeter record: 78 numeric features (durations, packet counts, byte/packet rates, IATs, TCP flags, header/segment sizes…) plus a label.

Its lifecycle through the project:

```
raw flow (data/raw) → cleaned (leak-free, in 02_cleaning) → split (train/test)
                    → fitted-clean (train-only stats applied) → classified (DT / SVM) → evaluated
```

Label identity: original 15-class `label` (kept) → `label_binary` (0 benign / 1 malicious, **positive = malicious**) → `label_text` (human-readable). See §7 #3.

## §6 Core flows & surfaces

**Surfaces:** Jupyter notebooks + a small loader script. No app, API, DB, or UI.

- `nid.py` — data loader (glob + concat the raw CSVs)
- `notebooks/01_eda.ipynb` — Sprint 1 exploratory analysis (the diagnosis)
- `notebooks/02_cleaning.ipynb` — Sprint 2 cleaning + split pipeline; persists the split to `data/processed/` (complete)
- `notebooks/03_dt.ipynb` — 🟡 the baseline Decision Tree (Sprint 3–4); then SVM (Sprint 5), then the comparison (Sprint 6)

**The sprint arc** (methodology in `NIDS_Sprint_Framework.pdf`):
`0 Setup ✅ · 1 EDA ✅ · 2 Clean & Prep ✅ · 3 DT build 🟡 · 4 DT evaluate (the gate) ⬜ · 5 SVM ⬜ · 6 compare + writeup ⬜`

## §7 Locked decisions

The heart of the file. Other files cite these as `foundation.md §7 #N`.

| # | Decision | Reasoning | Rejected alternative |
|---|---|---|---|
| 1 | **Dataset: CICIDS 2017 "MachineLearningCVE" CSVs** (pre-engineered CICFlowMeter features), all 8 days combined → **2,830,743 × 79** | Security background is the asset; pre-engineered features keep focus on the ML workflow, not feature extraction | Raw PCAPs + own feature engineering (deferred, §8) |
| 2 | **Lightweight repo structure** (`data/{raw,processed}`, `notebooks/`, docs at root); **data git-ignored** | Scales cleanly, portfolio-ready, no over-scaffolding; 1.7 GB must never enter git history | Flat (junk drawer); full cookiecutter (empty-dir over-scaffold) |
| 3 | **Binary target** `label_binary` (malicious=1, benign=0); keep multi-class `label`; add `label_text` | Tames catastrophic 15-class imbalance to ~80/20; sidesteps the `�` label corruption; matches the core IDS question; **malicious = positive** → recall = detection rate, FN = missed intrusion | Multi-class (rare classes 11–36 rows, unlearnable/unevaluable); attack-family grouping (deferred) |
| 4 | **Column names → snake_case** via `re.sub(r'[^0-9a-zA-Z]+','_', name.strip()).strip('_').lower()` | CICIDS ships **leading-space** column names (known gotcha); clean, collision-free references | Leave as-is (fragile selections) |
| 5 | **Rate columns** (`flow_bytes_s`, `flow_packets_s`): `0/0 → 0`; `+inf → NaN` now, **filled with the train max after the split** | All inf/NaN trace to **2,867 zero-duration flows**; `0` is truthful for zero-activity, `max` for genuine high-rate; fill-after-split is leak-free | Fill now with global max (tiny leak, chose discipline); `min(col)` fill (poison — the min is a corrupted negative) |
| 6 | **Drop 13 columns**: 8 constant (zero-variance) + 5 exact duplicates | Zero variance = no signal; duplicates redundant under a second name | Keep all (dead weight) |
| 7 | **Negatives**: keep `init_win_bytes_*` = −1 (legit "no window" sentinel); **drop** the 115 negative-`flow_duration` rows (all benign); **clip** other impossible negatives to 0 | Repair-not-drop preserves 194 malicious rows incl. **4 of 11 Heartbleed**; −1 is legitimate, not corruption | Blanket drop-all-negatives (would delete ~2.44M sentinel rows + the rarest attacks) |
| 8 | **Keep all 308,381 exact duplicate rows** | In network traffic identical flows are often real (a port scan emits near-identical probes); dropping removes genuine attack volume + shifts balance | Drop duplicates — accepted cost of keeping = mild train/test leakage, flagged for Sprint 4 |
| 9 | **Split**: X = 65 features (3 label cols dropped), y = `label_binary`, **stratify on multi-class `label`**, `test_size=0.2`, `random_state=42` | Stratify-on-multiclass keeps rare attacks in **both** splits *and* preserves 80/20; fixed seed = reproducibility + fair DT-vs-SVM comparison | Stratify on binary only (rare classes could vanish from test); no seed (non-reproducible) |
| 10 | **Leakage discipline**: row-local ops anytime; **fitted ops (impute/scale/resample) computed on train only, post-split** | The test set must not influence cleaning, or the Sprint 4 scores lie | Clean-everything-then-split (leaks fitted stats into test) |
| 11 | **Modeling arc: Decision Tree first, then SVM** (SVM gated on DT genuinely understood) | DT is explainable (traceable splits; entropy/info-gain made concrete); SVM contrasts (margins, scaling suddenly matters) | Jump to a strong model / skip the understanding step |
| 12 | **Imbalance: baseline first, then reweight; resampling deferred.** Train the plain tree on the real 80/20 and evaluate by **recall + confusion matrix, never accuracy**; *then* apply `class_weight` (hand-set ~`{0:1, 1:3}` or `'balanced'` ≈ inverse-frequency `{0:1, 1:4}`) and measure the shift; under/oversampling (SMOTE) deferred unless the numbers demand it. All rebalancing is **train-only, post-split** (see #10). | Can't value an intervention without a baseline; keeps every real row first; confronts the §11 trap by *measuring* it before treating it. `class_weight` weights each row by class, so errors on the rare class (missed attacks / FN) cost more | Jump straight to SMOTE / undersampling — invents synthetic flows or discards ~1.7M real benign rows before knowing a reweight suffices |

Cleaned frame after §7 #4–#9: **2,830,628 × 68** (train 2,264,502 / test 566,126, both 19.70% malicious).

## §8 Scope

### In (v1)
Binary benign-vs-malicious classification on the pre-engineered features; Decision Tree + SVM; the full sprint arc through the Sprint 6 comparison + portfolio writeup.

### Out / cut (the forcing function)
Multi-class / per-attack classification · deep learning · deployment / real-time detection · ensemble methods · hyperparameter search beyond hand-reasoned choices.

### Deferred
Attack-**family** grouping (a middle ground between binary and 15-class) · feature engineering from raw PCAPs · revisiting the duplicate-row and imbalance decisions once measured.

## §9 Architecture keystones

Not an app — the "architecture" is a **data pipeline**, and its keystone is the **train/test split (§7 #9): the leakage boundary.** Everything before it is row-local and safe on the full dataset; everything *fitted* (imputation, scaling, resampling) happens after it, on train only.

- **Raw → processed, one direction.** `data/raw/` is immutable; `data/processed/` is derived and regenerable.
- **Explicit over magic.** Cleaning is hand-written, verified steps in a readable notebook — not a black-box `Pipeline` — because the point is to *understand* each transform. (Implementation conventions: `context/ml-practices.md`.)
- **Reproducibility is structural:** fixed `random_state`, run-from-project-root paths, frozen `requirements.txt`.

## §10 Known scale seams

- **Full 2.83M rows loaded into memory each run** (~1.7 GB parse). Fine now; if iteration gets slow, cache the combined/cleaned frame to `data/processed/*.parquet`. 🕗
- **All duplicate rows kept** (§7 #8) — accepted, with the leakage caveat to watch in Sprint 4.
- `02_cleaning` re-runs from raw, then **persists its train/test split to `data/processed/*.parquet`** (§7 #9); modeling notebooks (`03+`) load that split rather than re-cleaning — still reproducible (fixed split), no 1.7 GB re-parse each modeling session.

## §11 The deepest risk

**The imbalance/evaluation-honesty bet.** With ~80% benign, a model that simply predicts "benign" scores ~80% accuracy and detects **nothing**. If that trap isn't confronted — and if leakage inflates the test scores on top of it — the project produces an impressive-looking number that means nothing, which is the exact failure this project exists to *not* make (a lab-strong detector blind to real attacks). The intellectual core is **honest evaluation under class imbalance, in a security frame** (a false negative = a missed intrusion, and costs more than a false alarm). This is why leakage discipline (§7 #10) is non-negotiable and why the imbalance strategy is the pivotal decision (approach locked in **§7 #12**; its outcome settled by measurement in Sprint 4). It **detonates in Sprint 4** — the evaluate-the-tree gate.

## §12 Open questions

- ✅ **Imbalance strategy** — *decided (§7 #12)*: baseline first (plain tree, honest metrics) → `class_weight` → resampling deferred. Still open, and **settled by measurement in Sprint 4**: whether `class_weight` suffices or resampling is needed, and the exact weight ratio (`{0:1, 1:3}` vs `'balanced'`).
- 🟡 **Deferred rate-column max-fill** — decided in principle (train max, §7 #5), not yet implemented.
- ⬜ **Decision Tree hyperparameters** — `criterion`, `max_depth`, etc. (Sprint 3).
- ⬜ **SVM specifics** — kernel, `C`, feature scaling approach (Sprint 5).
- 🕗 **Primary evaluation metric** for an IDS — leaning recall-on-malicious / F1, but not locked (Sprint 4).
- ✅ **Persist processed train/test to `data/processed/`** — *decided*: `02` step 8 saves `X_train/X_test/y_train/y_test` as parquet (`pyarrow`); modeling notebooks load them (git-ignored, regenerable).
