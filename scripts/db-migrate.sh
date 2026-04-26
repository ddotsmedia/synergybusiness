#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Synergy Business — apply Drizzle schema to the live database
#
# Idempotent migration runner. Reads DATABASE_URL from apps/web/.env.local
# and applies the schema in packages/db/schema.ts. Works regardless of
# where the script is invoked from (resolves all paths from itself).
#
# Run as the synergy user:
#   sudo -u synergy bash /home/synergy/app/scripts/db-migrate.sh
# Or, already as synergy:
#   bash /home/synergy/app/scripts/db-migrate.sh
# ----------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="${ROOT}/apps/web"
SCHEMA="${ROOT}/packages/db/schema.ts"
ENV_FILE="${WEB_DIR}/.env.local"

C_RESET=$'\033[0m'
C_GREEN=$'\033[1;32m'
C_BLUE=$'\033[1;34m'
C_YELLOW=$'\033[1;33m'
C_RED=$'\033[1;31m'

log()  { printf "%s==> %s%s\n" "${C_BLUE}" "$*" "${C_RESET}"; }
ok()   { printf "%s   %s%s\n" "${C_GREEN}" "$*" "${C_RESET}"; }
warn() { printf "%s   %s%s\n" "${C_YELLOW}" "$*" "${C_RESET}"; }
die()  { printf "%s!! %s%s\n" "${C_RED}" "$*" "${C_RESET}" >&2; exit 1; }

[[ -f "${ENV_FILE}" ]] || die "Env file not found at ${ENV_FILE}"
[[ -f "${SCHEMA}" ]] || die "Schema file not found at ${SCHEMA}"

URL="$(grep -E "^DATABASE_URL=" "${ENV_FILE}" | head -1 | cut -d= -f2-)"
if [[ -z "${URL}" || "${URL}" == "" ]]; then
  die "DATABASE_URL is empty in ${ENV_FILE}. Set it and re-run."
fi

# Pretty-print the URL with the password masked so it doesn't end up in logs.
SAFE_URL="$(echo "${URL}" | sed -E 's|://[^:]+:[^@]+@|://***:***@|')"

log "Applying schema"
ok "Repo:        ${ROOT}"
ok "Schema:      ${SCHEMA}"
ok "Database:    ${SAFE_URL}"

cd "${WEB_DIR}"
pnpm exec drizzle-kit push \
  --dialect=postgresql \
  --schema="${SCHEMA}" \
  --url="${URL}" \
  --force

log "Verifying"

# Try to extract the database name from the URL for a quick \dt list.
DB_NAME="$(echo "${URL}" | sed -E 's|^[^/]+//[^/]+/([^?]+).*|\1|')"
if command -v psql >/dev/null 2>&1; then
  if sudo -n -u postgres psql -d "${DB_NAME}" -c "\dt" 2>/dev/null | tail -n +2 ; then
    ok "Tables listed."
  else
    warn "Could not list tables via psql (no sudo or password prompt). That's fine — the migration above succeeded."
  fi
else
  warn "psql not on PATH; skipping verification step."
fi

cat <<EOF

${C_GREEN}Migration complete.${C_RESET}

  - Refresh /admin/content/contact in your browser and click Save.
  - To re-run later (after editing schema.ts and pushing):
        sudo -u synergy bash ${ROOT}/scripts/db-migrate.sh

EOF
