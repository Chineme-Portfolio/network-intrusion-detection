# Caught backend (NestJS): the Redis flow/verdict subscriber, the correlator, and the
# WebSocket gateway (spec 0002). Build context is system/ (the parent), so the build can
# codegen the TypeScript contract types from the shared schemas (single source of truth,
# L0.2). It compiles once (nest build) and runs the built output; a full slim multi-stage
# runtime is hardened in the containerized-deploy slice (build-graph.md F7).

# Stage 1: generate the TS contract types from the JSON Schemas.
FROM node:22-slim AS contracts
WORKDIR /gen
RUN npm install -g json-schema-to-typescript@^15
COPY shared/schemas ./schemas
RUN mkdir -p /out && for n in flow-record verdict registry-manifest; do \
      out=$(echo "$n" | tr '-' '_'); \
      json2ts -i "schemas/$n.schema.json" -o "/out/$out.ts"; \
    done

# Stage 2: build + run the backend.
FROM node:22-slim
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/ .
# The generated contract types land in src/ before the compile, so imports resolve.
COPY --from=contracts /out ./src/contracts
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
