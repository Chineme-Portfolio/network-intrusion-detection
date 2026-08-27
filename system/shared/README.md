# shared — the versioned contracts

The single source of truth for the shapes that cross service boundaries: the
**flow-record**, the **verdict**, and the **registry manifest**. Authored once as
JSON Schema, then code generated into Pydantic v2 models (Python) and TypeScript
types so the two languages cannot drift (`foundation.md` Section 7 #9,
`code-standards.md` Section 2).

## Layout

| Path | What it holds |
|---|---|
| `schemas/` | The three contracts as versioned JSON Schema. **The source of truth.** Language neutral. |
| `samples/` | One valid example payload per contract. Shared fixtures for both validators. |
| `codegen/` | The build tooling that turns the schemas into typed bindings, plus a validator per language. See `codegen/README.md`. |
| `generated/` | The generated Pydantic models and TypeScript types. **Git ignored**, regenerated, never hand edited. |

The contract itself (`schemas/`) stays language neutral. The featurizer lives in the
ml-service, not here (`architecture.md`).

## Use it

```bash
# one time: install the two generators (see codegen/README.md)
# then regenerate the bindings from the schemas:
bash codegen/generate.sh

# prove a sample validates in both languages, and a missing field is rejected (AC-2, AC-3):
codegen/python/.venv/bin/python codegen/python/validate.py     # Python (Pydantic, runtime)
( cd codegen/typescript && npm run typecheck )                 # TypeScript (tsc, compile time)
```

Consumers (ml-service, backend, frontend) run codegen as a build step and import from
`generated/`; wiring that into each service is a K1 task.
