#!/usr/bin/env bash
# Regenerate the language bindings from the JSON Schemas (the source of truth).
#   Python:     Pydantic v2 models via datamodel-code-generator
#   TypeScript: types via json-schema-to-typescript
# Output lands in system/shared/generated/ (git ignored; regenerated, never hand edited).
#
# Prereqs (see codegen/README.md):
#   Python:     pip install -r codegen/python/requirements.txt   (datamodel-codegen on PATH)
#   TypeScript: (cd codegen/typescript && npm install)
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
shared="$(cd "$here/.." && pwd)"
schemas="$shared/schemas"
py_out="$shared/generated/python/caught_contracts"

echo "[codegen] python (pydantic v2) -> $py_out"
mkdir -p "$py_out"
: > "$py_out/__init__.py"
for name in flow-record verdict registry-manifest; do
  datamodel-codegen \
    --input "$schemas/$name.schema.json" \
    --input-file-type jsonschema \
    --output "$py_out/${name//-/_}.py" \
    --output-model-type pydantic_v2.BaseModel \
    --use-standard-collections \
    --use-union-operator \
    --use-schema-description \
    --field-constraints
done

echo "[codegen] typescript -> $shared/generated/typescript"
( cd "$here/typescript" && node generate-ts.mjs )

echo "[codegen] done"
