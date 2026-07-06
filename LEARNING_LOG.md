# Learning Log

Living record of this project — study sessions and build work, **newest first**.

**Standing instruction (for any AI agent):** after completing work in this project, before ending your response, prepend a progress entry below. This is mandatory — the same way reading `context/foundation.md` first is mandatory. If an entry is a `decision` that changes `context/foundation.md` (or another context file), **update that file too** and add a `docs` note, so the context never drifts from what was decided.

**Entry format:** `### YYYY-MM-DD · <category> · <title>` — category ∈ {`study`, `feature`, `fix`, `refactor`, `decision`, `docs`, `chore`}. Then a line or two of *what*, and *notes* (gotchas, follow-ups). `study` entries may add `Hours:`.

---

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
