# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────────────
#  Frontend — multi-stage build
#    Stage 1 (build):  Node 20 → `npm run build` produces static assets (dist/)
#    Stage 2 (runtime): Nginx 1.27 → serves the SPA and reverse-proxies /api/*
#  Final image contains only static files + Nginx — no Node runtime, no sources.
# ─────────────────────────────────────────────────────────────────────────────

# ---- Stage 1: build ----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first (layer caching: package.json changes less often than source)
# `npm ci` installs exactly what package-lock.json pins → reproducible builds
COPY frontend/package*.json ./
RUN npm ci

# Compile the app
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: runtime ----
FROM nginx:1.27-alpine AS runtime

# Static SPA assets
COPY --from=build /app/dist /usr/share/nginx/html
# Reverse proxy + SPA fallback + security headers (see nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop root privileges for defense-in-depth
USER nginx

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
