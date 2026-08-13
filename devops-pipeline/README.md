<div align="center">

# 🚀 Automated Microservices Deployment & CI/CD Pipeline

### A production-grade DevOps demonstration — Docker multi-stage builds · GitHub Actions · Nginx · PostgreSQL

[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088ff?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![GHCR](https://img.shields.io/badge/GHCR-Registry-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/features/packages)

</div>

A complete, containerized full-stack application demonstrating the **entire DevOps toolchain end-to-end**: multi-stage Docker builds, health-checked multi-service orchestration, an automated **CI/CD pipeline** that publishes multi-architecture images to **GHCR**, and a **zero-downtime** remote deployment script.

```
┌────────────┐    ┌───────────────────────────────┐    ┌───────────────┐    ┌──────────────────┐
│ Developer  │───▶│  GitHub Actions (CI/CD)       │───▶│  GHCR         │───▶│  Production      │
│  Push      │    │  PR → lint · test · build     │    │  Registry     │    │  Server          │
│            │    │  main → build · push · deploy │    │  amd64/arm64  │    │  docker compose  │
└────────────┘    └───────────────────────────────┘    └───────────────┘    └──────────────────┘
                                                                                  │
                                                    ┌─────────────────────────────┼──────────────────────────┐
                                                    ▼                             ▼                          ▼
                                           ┌──────────────┐              ┌──────────────┐          ┌──────────────┐
                                           │  Frontend    │  /api/* ───▶ │  Backend     │  SQL ───▶ │  PostgreSQL  │
                                           │  Nginx :80   │              │  Express :5000│          │  :5432       │
                                           └──────────────┘              └──────────────┘          └──────────────┘
```

---

## ✨ What it demonstrates

| Area | What's included |
|------|-----------------|
| **Dockerization** | Multi-stage `Dockerfile`s — frontend built in Node 20, served by **Nginx**; backend compiled with `tsc`, runtime image ships production deps only. Final images run as non-root users. |
| **Orchestration** | `docker-compose.yml` with **PostgreSQL** (persistent volume + init SQL seed), healthchecks on every service, and boot ordering via `depends_on: condition: service_healthy`. |
| **CI/CD** | `.github/workflows/deploy.yml` — CI gates every PR (lint → test → build → Docker assembly); CD on `main` push builds **multi-arch (amd64/arm64)** images, publishes SHA + `latest` tags to **GHCR**, then SSH-deploys. |
| **Reverse proxy** | `nginx.conf` routes `/api/*` → backend, serves the SPA with `try_files` fallback, and sets hardened security headers (CSP, X-Frame-Options, X-Content-Type-Options…). |
| **Reliability** | Health-checked rollouts, graceful shutdown on SIGTERM/SIGINT, `deploy.sh` with a health wait + failure hints. |

---

## 📁 Repository layout

```
devops-pipeline/
├── docker-compose.yml              # Orchestration (frontend + backend + db)
├── nginx.conf                      # Reverse proxy, SPA fallback, security headers
├── deploy.sh                       # Zero-downtime remote deploy script
├── .env.example                    # Environment variable template
├── portfolio-data-entry.ts         # Ready-to-paste entry for the Portfolio OS UI
├── .github/workflows/
│   └── deploy.yml                  # CI (PR) + CD (main) pipeline
├── frontend/                       # React + Vite SPA (status dashboard)
│   ├── Dockerfile                  # Multi-stage: node build → nginx runtime
│   └── src/App.tsx                 # Fetches /api/health + /api/projects
└── backend/                        # Express + PostgreSQL API
    ├── Dockerfile                  # Multi-stage: tsc build → slim runtime
    ├── src/
    │   ├── server.ts               # Entry + graceful shutdown
    │   ├── app.ts                  # Express app (testable factory)
    │   ├── db.ts                   # pg connection pool
    │   └── app.test.ts             # Vitest API tests
    └── db/init.sql                 # Schema + seed data (auto-run on first boot)
```

---

## 🚀 Quick start (local)

**Prerequisites:** Docker Engine 24+ with the Compose plugin.

```bash
cd devops-pipeline
cp .env.example .env        # set a real POSTGRES_PASSWORD

docker compose up -d --build
```

Then open **http://localhost** — you should see the dashboard showing:

- ✅ API Gateway **healthy**
- ✅ PostgreSQL **connected**
- ✅ Projects served from the database

The whole stack, one command:

```bash
docker compose ps          # all three services healthy
docker compose logs -f backend
docker compose down        # stop
docker compose down -v     # stop + wipe the database volume
```

### Verification

```bash
curl http://localhost/api/health      # → {"status":"ok","db":"connected",...}
curl http://localhost/api/projects    # → projects seeded from PostgreSQL
```

---

## 🔐 CI/CD pipeline

Copy `.github/workflows/deploy.yml` to your **repository root** `.github/workflows/` to activate it (workflows only auto-trigger from the root).

### CI — on every `pull_request` → `main`

1. Checkout + Node.js 20
2. Frontend: `npm ci` → `npm run lint` → `npm run build`
3. Backend: `npm ci` → `npm run lint` → `npm test` → `npm run build`
4. **Docker assembly test** — both images must build or the PR is blocked

### CD — on every `push` → `main`

1. Log in to **GHCR** (built-in `GITHUB_TOKEN` — no extra secrets)
2. Build & push **multi-arch** images (`linux/amd64`, `linux/arm64`) with `latest` + commit-SHA tags:
   ```
   ghcr.io/<owner>/<repo>/frontend:latest
   ghcr.io/<owner>/<repo>/frontend:<sha>
   ghcr.io/<owner>/<repo>/backend:latest
   ghcr.io/<owner>/<repo>/backend:<sha>
   ```
3. **Zero-downtime deploy** over SSH → `deploy.sh` pulls new images, runs `docker compose up -d --build`, waits for health, prunes old images.

### Required repository secrets

| Secret | Purpose |
|--------|---------|
| `DEPLOY_HOST` | Production server hostname / IP |
| `DEPLOY_USER` | SSH user (e.g. `ubuntu`, `deploy`) |
| `DEPLOY_SSH_KEY` | Private SSH key (add the public key to the server's `~/.ssh/authorized_keys`) |
| `DEPLOY_PORT` | *Optional* — SSH port (defaults to 22) |

### Rollback

Every build is tagged with its commit SHA, so rolling back is pinning an older tag:

```bash
IMAGE_TAG=<previous-sha> docker compose pull   # pull the pinned image from GHCR
IMAGE_TAG=<previous-sha> docker compose up -d  # recreate with it
```

### Server prerequisites

The CD step assumes the server has:
1. This repo cloned at `~/pipeline-demo` (with its `.env` configured)
2. Docker Engine + the Compose plugin installed, and the user in the `docker` group
3. For **private** repos: credentials for `git pull` on the server (e.g. a deploy key or fine-grained PAT)

---

## 🌐 Nginx (reverse proxy & SSL)

The `frontend` container ships `nginx.conf`, which:

- **Routes `/api/*`** → `http://backend:5000` (compose service DNS)
- **Serves the SPA** with `try_files $uri $uri/ /index.html` fallback (deep links work)
- **Hardens responses** with `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, a strict `Content-Security-Policy`, `Referrer-Policy`, and `Permissions-Policy`
- Caches hashed static assets (`immutable`, 1 year) and enables gzip

**Adding TLS (port 443):** for production, terminate TLS at this Nginx or a load balancer. With Docker, the simplest path is a companion `certbot` container or a Caddy proxy in front — see the [official Nginx SSL docs](https://nginx.org/en/docs/http/configuring_https_servers.html). The compose file maps `${WEB_PORT:-80}:80` so you can bind 443 externally.

---

## 🗄️ Database

- **PostgreSQL 16 (Alpine)** with a named **persistent volume** (`pgdata`)
- Schema + seed data auto-load from `backend/db/init.sql` on first boot (`/docker-entrypoint-initdb.d`)
- Healthchecked with `pg_isready`; the backend refuses to start until the DB is ready

---

## 📋 Roadmap

- [x] Reproducible installs — `package-lock.json` committed, Dockerfiles & CI use `npm ci`
- [ ] Add Docker-layer caching with `--mount=type=cache` for npm in the build stages
- [ ] Add a `canary` / staged rollout to the deploy script
- [ ] Wire up Terraform/Ansible for server provisioning
- [ ] Add Prometheus metrics + Grafana dashboards

---

## 🖥️ Portfolio UI integration

This project is featured inside the portfolio's **DevOps** folder. The entry in `portfolio-data-entry.ts` matches the portfolio's `Project` schema and is **already registered** in `frontend/src/data/initialData.ts` — the portfolio merges new seed projects into existing browser data on next load, so no action is needed.

To re-add it manually (e.g. after clearing browser data): right-click the desktop → **New → Portfolio Project** → complete the UAC admin prompt → paste the fields from `portfolio-data-entry.ts` into the **DevOps** folder.

---

## 📬 Author

**Yonatan Altaye** — Software Engineer | Network & System Admin
[GitHub](https://github.com/yonialt) · [LinkedIn](https://www.linkedin.com/in/yonatan-altaye-a18260375/)

## 📄 License

MIT — part of the [Windows 11 Portfolio OS](../README.md) monorepo.
