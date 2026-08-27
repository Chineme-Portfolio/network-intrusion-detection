# Caught frontend (React 19 + Vite). Layer 0: serves the placeholder page via the
# Vite dev server. A production multi-stage build (static assets behind a slim
# server, devops.md Section 2) is hardened in the deploy slice (build-graph.md F7).
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
