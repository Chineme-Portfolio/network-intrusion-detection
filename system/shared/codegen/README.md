# Contracts codegen

The three contracts in `../schemas/` are the single source of truth. This folder turns
them into typed bindings for both languages, so Python and TypeScript cannot drift
(`foundation.md` Section 7 #9). Generated output lands in `../generated/` and is **git
ignored**: it is regenerated, never hand edited. Edit a schema, then regenerate.

## Toolchain (spec 0001 recommendation)

- **Python:** `datamodel-code-generator` (JSON Schema to Pydantic v2 models).
- **TypeScript:** `json-schema-to-typescript` (JSON Schema to TS types).

Both are in `library-docs.md` (Approved Dependencies).

## One time setup

```bash
# Python: datamodel-codegen on PATH + pydantic to run the models
python -m venv codegen/python/.venv
codegen/python/.venv/bin/pip install -r codegen/python/requirements.txt

# TypeScript
( cd codegen/typescript && npm install )
```

## Generate

```bash
bash codegen/generate.sh      # writes ../generated/{python,typescript}
```

## Validate (AC-2, AC-3): a sample validates in both languages, a missing field is rejected

```bash
# Python: samples validate through the generated Pydantic models; a missing field is rejected
codegen/python/.venv/bin/python codegen/python/validate.py

# TypeScript: samples type check against the generated types; a missing field fails to compile
( cd codegen/typescript && npm run typecheck )
```

Both must pass. The Python check rejects at runtime (Pydantic `ValidationError`); the
TypeScript check rejects at compile time (`tsc`, proved with a `@ts-expect-error` on a
verdict that omits `score_kind`).

## Notes

- Consumers (the ml-service, backend, frontend) run `generate.sh` as a build step in K1
  and import from `../generated/`. Wiring that into each service is a K1 task.
- The `samples/` payloads are the shared fixtures both checks read.
