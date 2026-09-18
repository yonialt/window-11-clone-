# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
#  Backend (Express API) — multi-stage build
#    Stage 1 (build):  Node 20 → npm install + TypeScript compile (tsc)
#    Stage 2 (runtime): Node 20 slim → production deps + compiled dist only
#  Final image excludes devDependencies, source files, and build tooling.
# ─────────────────────────────────────────────────────────────────────────────

# ---- Stage 1: build ----
FROM node:20-alpine AS build
WORKDIR /app

# Install ALL deps (dev + prod) for compilation
# `npm ci` installs exactly what package-lock.json pins → reproducible builds
COPY backend/package*.json ./
RUN npm ci

# Compile TypeScript → dist/
COPY backend/ ./
RUN npm run build

# Prune devDependencies so the runtime image stays small
RUN npm prune --omit=dev

# ---- Stage 2: runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Drop root privileges
USER node

EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD wget -qO- http://localhost:5000/api/health >/dev/null 2>&1 || exit 1

CMD ["node", "dist/server.js"]
