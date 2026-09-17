#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  Zero-downtime deployment script (run on the production server).
#
#  Executed remotely by the CD pipeline (see .github/workflows/deploy.yml):
#    - pulls the latest images from GHCR
#    - recreates containers (compose detects changed image IDs)
#    - waits for every service to become healthy
#    - prunes dangling images
#
#  Rollback: the previous image remains tagged with its commit SHA, so you can
#  pin back with:
#      docker compose up -d --no-deps <service>  (after re-tagging the SHA image)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "$0")"

echo "▶ [1/4] Pulling latest images from GHCR…"
docker compose pull --ignore-pull-failures || true
docker compose build --pull

echo "▶ [2/4] Recreating containers (zero downtime)…"
docker compose up -d --remove-orphans

echo "▶ [3/4] Waiting for all services to become healthy…"
total="$(docker compose ps --format '{{.Service}}' | wc -l)"
healthy=0
for i in $(seq 1 30); do
  statuses="$(docker compose ps --format '{{.Service}} {{.Status}}' 2>/dev/null || true)"
  healthy_count="$(grep -c '(healthy)' <<<"$statuses" || true)"
  if [ "$total" -gt 0 ] && [ "$healthy_count" -ge "$total" ]; then
    echo "   ✅ All ${healthy_count}/${total} services healthy after $((i * 5))s"
    healthy=1
    break
  fi
  sleep 5
done

if [ "$healthy" -ne 1 ]; then
  echo "⚠️  Services did not become healthy within the timeout." >&2
  echo "   Check the logs:  docker compose logs --tail=100" >&2
  echo "   Roll back with:  docker compose up -d <service>  (using a previous SHA tag)" >&2
  exit 1
fi

echo "▶ [4/4] Cleaning up dangling images…"
docker image prune -f

echo "✅ Deploy complete."
