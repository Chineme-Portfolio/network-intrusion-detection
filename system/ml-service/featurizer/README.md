# featurizer — the v1 parity feature step

Turns one raw CICFlowMeter flow into the exact 67 feature vector the v1 models consume.
A faithful port of notebooks `02` (row local cleaning) and `02b` (IANA port bucketing).
Only the ml-service imports it (`architecture.md`). This is the parity guarantee
(`foundation.md` Section 7 #5, Section 11): serving features must match training exactly,
or the models are blind on real traffic.

## Files

| File | What it is |
|---|---|
| `featurizer.py` | `Featurizer(meta).featurize(raw)` returns a 1 row, 67 column frame. Validates first: a missing field, an out of range port, or a negative duration is rejected, never classified silently. |
| `featurizer_meta.json` | The frozen artifact (committed): `train_max`, the 67 `feature_order`, per column `dtypes`. Generated from v1, read by the featurizer, never hardcoded. |
| `extract_meta.py` | Regenerates the artifact from `data/processed/featured/X_train.parquet` (AC-5). |
| `tests/generate_fixture.py` | Builds the golden fixture from the raw and frozen featured data, one run, paired by preserved index, with a destination_port sanity check (AC-6). |
| `tests/golden_fixture.json` | Committed: 25 raw rows plus their exact v1 featured output. Covers each port bucket, the rate fill, the 0/0 case, init_win sentinels, and the negative clip. |
| `tests/test_parity.py` | Asserts `featurize(raw)` equals frozen v1 exactly (columns, order, dtypes, values, dtype strict). The drift guard. |

## Run

```bash
# regenerate the artifact + fixture (needs the git ignored v1 data; run locally):
python system/ml-service/featurizer/extract_meta.py
python system/ml-service/featurizer/tests/generate_fixture.py

# the parity test (needs only the committed fixture, no git ignored data):
python system/ml-service/featurizer/tests/test_parity.py
```

## Notes

- Needs pandas and numpy (approved, `library-docs.md`). The ml-service gains these and
  wires the featurizer into `POST /predict` at K1; Layer 0 only proves parity.
- It stays a faithful port, not a cleaner rewrite. The parity test is what keeps the
  copy honest: change one step and it fails loudly.
- **K1 follow up:** the flow record invariant `features.destination_port == dst_port`
  (spec 0001 Feature design) is documented in the schema but not yet enforced. The
  featurizer only receives the `features` object, so it never sees the top level
  `dst_port`; the cross check belongs where a full flow record is ingested (K1 capture),
  and should reject a flow whose two ports disagree.
