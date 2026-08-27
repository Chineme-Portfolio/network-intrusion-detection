# Caught backend (NestJS). Layer 0: boots + serves /health.
# It compiles once (nest build) and runs the built output, rather than a file watcher.
# `nest start --watch` is meant for local dev against mounted source and hangs in a
# container with copied source; compiling is robust and closer to the deploy shape. A
# full multi-stage build (build -> slim runtime, devops.md Section 2) is hardened in the
# containerized-deploy slice (build-graph.md F7). For a live edit loop, run
# `npm run start:dev` on the host, outside Docker.
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
