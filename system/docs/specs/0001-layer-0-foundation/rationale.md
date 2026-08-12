# 0001. Layer 0 foundation, rationale

The decision record for [index.md](index.md). `/develop` does not need this file.

## Context

Caught turns the v1 model zoo into a live system. Before any flow can be classified, three things must exist: a place for the services to run, a shared language for the messages they pass, and a feature pipeline that turns a captured flow into exactly the vector the models were trained on. None of these is the keystone, but the keystone cannot be built without all three.

The forces at play:
- **Two languages share the seams.** The ml-service and capture are Python; the backend is TypeScript. The flow record and verdict cross that boundary on every flow. If the two sides define these shapes separately, they drift, and drift on the hot path is a whole class of silent bugs.
- **Feature parity is the deepest risk** (`foundation.md` Section 11). The v1 models learned on CICFlowMeter features carrying that tool's specific quirks. If the serving featurizer computes even slightly different numbers, the models are blind and the demo is hollow. One detail makes this sharp: the v1 rate column fill uses a *train max*, a fitted value (`flow_bytes_s = 2.071e9`, `flow_packets_s = 4.0e6`). That value is not in the transform logic; it must be carried from v1 or serving silently diverges.
- **The score is not uniform across models.** The tree yields a probability; the SVMs yield a signed distance. The verdict contract has to express a single comparable number without pretending an uncalibrated distance is a probability.

The consequence of not deciding: each of these gets improvised inside the keystone build, where a wrong guess on the featurizer or the contract shape is expensive to unwind.

## Options considered

### Option 1: Thin start, wire the contracts and featurizer later

Stand up the scaffold and get one flow moving in the simplest way, hardcoding the feature transform and the message shapes, then formalize once it works.

**Pros**:
- Fastest to a first moving flow.
- Less upfront structure to design.

**Cons**:
- The featurizer is the risk; deferring its parity guard means building the keystone on an unproven feature path.
- Hardcoded shapes drift the moment a second language touches them, which is immediately (Python plus TypeScript).
- Reintroduces exactly the "impressive but hollow" failure v1 was built to avoid.

### Option 2: Shared contracts and a parity guarded featurizer as the foundation (chosen)

Author the contracts once as JSON Schema with codegen both sides, and extract the v1 pipeline into a shared featurizer whose parity is frozen and test guarded, all before the keystone.

**Pros**:
- The seams cannot drift; one schema generates both languages.
- Parity is provable and guarded by a test, so drift is caught mechanically, not by eye.
- The train max and column order are frozen artifacts, closing the silent divergence path.

**Cons**:
- More upfront work before the first visible verdict.
- Adds a codegen toolchain and a duplicated (but tested) transform module.

### Option 3: One shared Python featurizer package imported by every service

Put the featurizer in `system/shared/` as a Python package that any service can import.

**Pros**:
- A single home if more than one service ever needed featurization.

**Cons**:
- Only the ml-service featurizes; a shared package is premature structure.
- Puts Python code in `shared/`, which is otherwise language neutral (schemas only), muddying the boundary.

## Rationale

Option 2 fits the forces directly. Feature parity is the project's deepest risk, so the featurizer earns a real module and a parity test now, not a hardcode deferred into the keystone. The golden fixture approach proves parity against a frozen sample of v1 output, which is fast and decoupled from the 1.7 GB dataset, and it doubles as the harness the later live capture parity spike (F4) will reuse. Authoring contracts as JSON Schema with codegen answers the two language drift force at its root: there is one definition, and both Pydantic and TypeScript are generated from it, so they cannot disagree. A lighter alternative, hand authoring Pydantic and TypeScript and guarding drift with a cross language equivalence test, was weighed; for only three low churn schemas it is plausibly less machinery, but codegen removes drift by construction rather than by a test that can be forgotten. The builder chose codegen, and it can be revisited if the toolchain proves heavier than three schemas warrant. The featurizer stays in the ml-service rather than `shared/` (Option 3) because it has exactly one consumer and `shared/` is kept to language neutral schemas, matching the boundaries in `architecture.md`.

On the score, a single 0 to 1 number keeps the UI comparable across models, and the `score_kind` field keeps it honest: the tree is calibrated, the SVMs are a squashed distance and labeled uncalibrated. Calibrating the SVMs would mean refitting the frozen v1 models, which is out of scope, so the squash plus an honest label is the right trade for a demo.

## References

**Project sources** (in this repo):
- `system/context/foundation.md` (Caught): Section 7 #3 to #5 (capture interface, live tool deferred, reuse the v1 featurizer), Section 9 (keystone), Section 11 (the parity risk), Section 12 (the open `score` question, now settled here).
- `system/context/architecture.md`: service boundaries and the stack table.
- `system/context/build-graph.md`: L0.1 to L0.3 and the keystone K1.
- The repo root `context/foundation.md` (v1): Section 7 #4 to #9 and #13 (the exact cleaning and bucketing decisions the featurizer reproduces).
- `notebooks/02_cleaning.ipynb` and `notebooks/02b_features.ipynb`: the transform logic and the train max values.

**Practices and standards**:
- Schema first contracts with codegen, so cross language message shapes have one source of truth.
- A golden fixture (frozen input plus expected output) as a drift guard for a ported transform.
