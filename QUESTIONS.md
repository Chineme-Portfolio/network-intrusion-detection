# QUESTIONS.md

---
### Compiled questions Day 1

1. Is the Turing test not passed everyday with modern AI? `[Discussed]` `[Book - Ch.26]`

2. How can we tell a machine understands? `[Discussed]` `[Unsolved]`

3. Does modern LLM truly understand or compare words with training data? `[Discussed]`

4. Don't humans work on the same pattern recognition when "understanding"? `[Discussed]`

5. Is text and video not the same thing conceptually in the Turing test? `[Discussed]`

6. How complete are the four approaches of AI? `[Discussed]` `[Book - throughout]`

7. Is the goal for AI full autonomy in an open ended world? `[Unsolved]`

8. Where does AI research stop? We are not pursuing bird flight anymore. `[Unsolved]`

9. Doesn't a rationally acting computer need to think rationally too? `[Discussed]` `[Book - Ch.3, Ch.7]`

10. If AI uses decision tree, why is that not "understanding", again is that not similar to a human process? `[Discussed]` `[Book - Ch.18]`

11. Decision tree vs pattern recognition vs large neural network? `[Discussed]`

12. Is it the machine that chooses what's more important in a vague prompt or the human? `[Discussed]`

13. What is the difference between doing whatever to achieve a goal and AI hallucination? `[Discussed]`

14. What approach of AI is an LLM — ChatGPT, Claude, Copilot etc? `[Discussed]`

---

---
### Compiled questions Day 2 — reviewing `01_eda`

15. How do you compress 78 features onto a 2-D plot? `[Discussed]` — EDA plots show 1–2 features at a time; seeing all 78 needs *dimensionality reduction* (PCA / t-SNE), which trades interpretability for a picture.

16. Is the `X` in `X_train` the same as the x-axis on a graph? `[Discussed]` — No. Two conventions reusing the same letters: `X`/`y` come from `y = f(X)`; capital = matrix (65 cols), lowercase = vector (1 col). Nothing is compressed.

17. A flow is a packet *collection* — but isn't that an "action" (HTTP request, file transfer)? `[Discussed]` — No. A flow is a 5-tuple + idle timeout, so many actions can share one flow (HTTP keep-alive) and one action can span many flows (a page load).

18. In general, what symptoms should EDA look for? `[Discussed]` — 16-item checklist in 5 groups: structure, validity, redundancy, shape-of-data, traps (leakage / temporal / missingness pattern).

19. Why was `clean_df` wrong if I never mutated `df`? `[Discussed]` — It wasn't; deriving a new name is correct practice. The real `01` mistake was the in-place, non-idempotent `Destination Port` mapping.

20. Was the `01` port categorization ever applied in `02`/`03`? `[Discussed]` `[Open — Section 12]` — No. `destination_port` is still raw `int64`; matters for SVM in Sprint 5.

---

### Compiled questions Day 2 (cont.) — reviewing `02_cleaning`

21. Why does the split stratify on the multi-class `label` when we binarized the target to benign/malicious? `[Discussed]` — Two labels, two jobs: `label_binary` is the *target* (`y`); `label` (15-class) is the *stratify guide*. Stratifying on the 15 classes keeps rare attacks (Heartbleed, 11 rows → ~9 train / ~2 test) in BOTH splits, so they can be learned and — crucially — evaluated (Section 11).

22. What decides whether a cleaning step goes before or after the split? `[Discussed]` — Row-local ops (rename, binarize, clip to a *fixed* constant) can't leak → safe anytime. Fitted ops (mean/max/scale — *learned* from data) must be train-only, post-split (Section 7 #10). That is why step 3 *marks* the infinities but step 7 *fills* them.

---

### Compiled questions Day 2 (cont.) — reviewing `03_dt`

23. Why a `DummyClassifier`, and is it also a decision tree? `[Discussed]` — It's a *baseline*, not a learner and not a tree; `most_frequent` always predicts the modal class (benign), ignoring every feature.

24. Does `.fit()` just mean "train"? `[Discussed]` — Yes. How much happens varies: the dummy just tallies the majority class; the tree builds the whole thing.

25. What other `DummyClassifier` strategies exist? `[Discussed]` — `most_frequent`, `prior`, `stratified`, `uniform`, `constant`.

26. An unpruned tree should hit 100% train accuracy — why 99.98%? `[Discussed]` — Contradictory duplicate rows (identical features, opposite labels) can't be split; ~450 in train are impossible to get right.

27. Confusion matrix — why do "actual benign" and "pred benign" share one number? `[Discussed]` — Each cell is an *intersection* (truth × guess); the top-left counts flows that are both actually AND predicted benign.

28. Classification report — explain precision, recall, f1, support, macro/weighted avg. `[Discussed]` — precision = of alarms how many real (down the predicted column); recall = of real attacks how many caught (across the actual row); f1 = blend; support = class size; macro = classes equal, weighted = size-weighted ≈ accuracy.

29. recall < precision — is that bad? `[Discussed]` — Right instinct: misses (378) > false alarms (310) is the less-ideal tilt for an IDS. But the gap is 0.0006 and sits under the leakage cloud, so not worth much yet.

---