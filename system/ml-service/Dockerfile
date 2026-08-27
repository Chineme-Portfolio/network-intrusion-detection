# Caught ml-service (FastAPI + the v1 ML stack). K1: loads one model + the featurizer,
# streams flows -> verdicts (spec 0002). Build context is system/ (the parent), so the
# build can codegen the Pydantic contracts from the shared schemas (single source of
# truth; consumers codegen at build, L0.2).
#
# python:3.12-slim matches the runtime the v1 models were pickled under, and carries
# scikit-learn 1.8.0 wheels; the pin lives in requirements.txt (library-docs.md).

# Stage 1: generate the Pydantic contracts from the JSON Schemas, then throw the tool away.
FROM python:3.12-slim AS contracts
WORKDIR /gen
RUN pip install --no-cache-dir "datamodel-code-generator>=0.25,<1.0"
COPY shared/schemas ./schemas
RUN mkdir -p /out/caught_contracts && : > /out/caught_contracts/__init__.py \
 && for name in flow-record verdict registry-manifest; do \
      out=$(echo "$name" | tr '-' '_'); \
      datamodel-codegen --input "schemas/$name.schema.json" --input-file-type jsonschema \
        --output "/out/caught_contracts/$out.py" --output-model-type pydantic_v2.BaseModel \
        --use-standard-collections --use-union-operator --use-schema-description --field-constraints; \
    done

# Stage 2: the runtime image (no codegen tool, no build deps).
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app
WORKDIR /app

COPY ml-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --from=contracts /out/caught_contracts ./caught_contracts
COPY ml-service/app ./app
COPY ml-service/featurizer ./featurizer
COPY ml-service/registry.manifest.json ./registry.manifest.json

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
