#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Synergy Business — deploy a new version
#
# Run as the app user (e.g. synergy):
#
#     sudo -u synergy bash /home/synergy/app/scripts/deploy.sh
#
# Or, if you rsync'd new code instead of pulling from git:
#
#     sudo -u synergy SKIP_GIT=1 bash /home/synergy/app/scripts/deploy.sh
#
# What it does:
#   1. git pull (unless SKIP_GIT=1)
#   2. pnpm install
#   3. pnpm db:push  (apply pending migrations)
#   4. pnpm build
#   5. pm2 reload   (zero-downtime)
# ----------------------------------------------------------------------------
set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
SKIP_GIT="${SKIP_GIT:-0}"
SKIP_DB="${SKIP_DB:-0}"

C_RESET=$'\033[0m'
C_GREEN=$'\033[1;32m'
C_BLUE=$'\033[1;34m'
C_YELLOW=$'\033[1;33m'
C_RED=$'\033[1;31m'

log()  { printf "%s==> %s%s\n" "${C_BLUE}" "$*" "${C_RESET}"; }
ok()   { printf "%s   %s%s\n" "${C_GREEN}" "$*" "${C_RESET}"; }
warn() { printf "%s   %s%s\n" "${C_YELLOW}" "$*" "${C_RESET}"; }
die()  { printf "%s!! %s%s\n" "${C_RED}" "$*" "${C_RESET}" >&2; exit 1; }

if [[ "${EUID}" -eq 0 ]]; then
  die "Don't deploy as root. Run as the app user: sudo -u synergy bash $0"
fi

cd "${APP_DIR}"

if [[ "${SKIP_GIT}" != "1" ]]; then
  if [[ -d .git ]]; then
    log "Pulling latest"
    git fetch --all --prune
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if ! git diff --quiet || ! git diff --staged --quiet; then
      die "Working tree is dirty. Commit or stash before deploying."
    fi
    git pull --ff-only origin "${BRANCH}"
    ok "Now at $(git rev-parse --short HEAD) on ${BRANCH}"
  else
    warn "Not a git repo — skipping git pull"
  fi
fi

log "Installing dependencies"
pnpm install --frozen-lockfile || pnpm install

if [[ "${SKIP_DB}" != "1" ]]; then
  log "Applying database migrations"
  if pnpm db:push --force 2>/dev/null; then
    ok "Migrations applied"
  else
    warn "db:push exited non-zero. Inspect manually with: pnpm db:studio"
  fi
fi

log "Building"
pnpm build
ok "Build complete"

log "Reloading PM2 (zero-downtime)"
if pm2 describe synergy-web >/dev/null 2>&1; then
  pm2 reload synergy-web --update-env
else
  pm2 startOrReload scripts/ecosystem.config.cjs
fi
pm2 save
ok "Reload complete"

log "Recent logs (Ctrl-C to exit)"
pm2 logs synergy-web --lines 20 --nostream || true

cat <<EOF

${C_GREEN}Deploy finished.${C_RESET}

  Status:  pm2 status
  Live:    pm2 logs synergy-web
  Reload:  pm2 reload synergy-web --update-env
EOF
