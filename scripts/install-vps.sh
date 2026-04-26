#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Synergy Business — Hostinger VPS bootstrap
#
# Run once on a fresh Ubuntu 22.04 / 24.04 VPS as root:
#
#     curl -fsSL https://raw.githubusercontent.com/<you>/synergybusiness/main/scripts/install-vps.sh | sudo DOMAIN=synergybusiness.ae LE_EMAIL=admin@synergybusiness.ae REPO_URL=https://github.com/<you>/synergybusiness.git bash
#
# Or after rsync'ing the repo to /home/synergy/app:
#
#     cd /home/synergy/app
#     sudo DOMAIN=synergybusiness.ae LE_EMAIL=admin@synergybusiness.ae bash scripts/install-vps.sh
#
# Idempotent — safe to re-run.
# ----------------------------------------------------------------------------
set -euo pipefail

# -------- defaults & inputs -------------------------------------------------

DOMAIN="${DOMAIN:-synergybusiness.ae}"
WWW_DOMAIN="www.${DOMAIN}"
LE_EMAIL="${LE_EMAIL:-}"
REPO_URL="${REPO_URL:-}"
APP_USER="${APP_USER:-synergy}"
APP_HOME="/home/${APP_USER}"
APP_DIR="${APP_HOME}/app"
WEB_DIR="${APP_DIR}/apps/web"
APP_PORT="${APP_PORT:-3000}"
NODE_MAJOR="${NODE_MAJOR:-20}"
PNPM_VERSION="${PNPM_VERSION:-10.33.0}"
PG_DB="${PG_DB:-synergybusiness}"
PG_USER="${PG_USER:-synergy}"
NGINX_SITE="/etc/nginx/sites-available/synergybusiness"
STATE_FILE="/etc/synergybusiness.state"

# -------- helpers -----------------------------------------------------------

C_RESET=$'\033[0m'
C_GREEN=$'\033[1;32m'
C_BLUE=$'\033[1;34m'
C_YELLOW=$'\033[1;33m'
C_RED=$'\033[1;31m'

log()  { printf "%s==> %s%s\n" "${C_BLUE}" "$*" "${C_RESET}"; }
ok()   { printf "%s   %s%s\n" "${C_GREEN}" "$*" "${C_RESET}"; }
warn() { printf "%s   %s%s\n" "${C_YELLOW}" "$*" "${C_RESET}"; }
die()  { printf "%s!! %s%s\n" "${C_RED}" "$*" "${C_RESET}" >&2; exit 1; }

require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    die "This script must run as root. Try: sudo bash $0"
  fi
}

require_ubuntu() {
  if ! grep -qiE 'ubuntu|debian' /etc/os-release; then
    die "Only Ubuntu/Debian is supported. Detected $(lsb_release -ds 2>/dev/null || cat /etc/os-release | head -1)"
  fi
  . /etc/os-release
  case "${VERSION_ID:-}" in
    20.04|22.04|24.04|11|12) ok "OS: ${PRETTY_NAME}";;
    *) warn "Untested OS version ${PRETTY_NAME} — proceeding anyway";;
  esac
}

prompt_if_empty() {
  local var="$1" prompt="$2"
  if [[ -z "${!var:-}" ]]; then
    printf "%s? %s%s " "${C_YELLOW}" "${prompt}" "${C_RESET}"
    read -r value
    printf -v "$var" '%s' "$value"
    eval "export ${var}"
  fi
}

random_pw() {
  # 32-char URL-safe random password
  head -c 32 /dev/urandom | base64 | tr -d '/+=\n' | cut -c1-32
}

save_state() {
  install -m 600 /dev/null "${STATE_FILE}"
  cat > "${STATE_FILE}" <<EOF
DOMAIN=${DOMAIN}
APP_USER=${APP_USER}
APP_DIR=${APP_DIR}
PG_DB=${PG_DB}
PG_USER=${PG_USER}
PG_PASSWORD=${PG_PASSWORD:-}
DATABASE_URL=${DATABASE_URL:-}
APP_PORT=${APP_PORT}
INSTALLED_AT=$(date -Iseconds)
EOF
  chmod 600 "${STATE_FILE}"
}

load_state() {
  if [[ -f "${STATE_FILE}" ]]; then
    # shellcheck disable=SC1090
    source "${STATE_FILE}"
  fi
}

# -------- pre-flight --------------------------------------------------------

require_root
require_ubuntu
load_state
prompt_if_empty LE_EMAIL "Email for Let's Encrypt SSL notifications"

log "Configuration"
ok "Domain:           ${DOMAIN}"
ok "Email:            ${LE_EMAIL}"
ok "App user:         ${APP_USER}"
ok "App directory:    ${APP_DIR}"
ok "Postgres DB:      ${PG_DB}"
ok "Repo URL:         ${REPO_URL:-<rsync expected at ${APP_DIR}>}"

# -------- 1. system packages ------------------------------------------------

log "Installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq \
  ca-certificates curl git build-essential ufw \
  nginx certbot python3-certbot-nginx \
  postgresql postgresql-contrib \
  unzip rsync gnupg lsb-release \
  >/dev/null
ok "System packages installed"

# -------- 2. Node.js + pnpm -------------------------------------------------

if ! command -v node >/dev/null || ! node -v | grep -qE "^v${NODE_MAJOR}\."; then
  log "Installing Node.js ${NODE_MAJOR}"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
ok "Node.js: $(node -v)"

if ! command -v pnpm >/dev/null || ! pnpm -v | grep -q "^${PNPM_VERSION%.*}"; then
  log "Installing pnpm ${PNPM_VERSION}"
  npm install -g "pnpm@${PNPM_VERSION}" >/dev/null
fi
ok "pnpm: $(pnpm -v)"

# -------- 3. PM2 ------------------------------------------------------------

if ! command -v pm2 >/dev/null; then
  log "Installing PM2"
  npm install -g pm2 >/dev/null
fi
ok "PM2: $(pm2 -v)"

# -------- 4. App user -------------------------------------------------------

if ! id -u "${APP_USER}" >/dev/null 2>&1; then
  log "Creating user ${APP_USER}"
  useradd -m -s /bin/bash "${APP_USER}"
fi
ok "User ${APP_USER} exists"

# -------- 5. PostgreSQL -----------------------------------------------------

log "Configuring PostgreSQL"
systemctl enable --now postgresql >/dev/null
sleep 2

DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${PG_DB}'" 2>/dev/null || echo "")
USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${PG_USER}'" 2>/dev/null || echo "")

if [[ "${USER_EXISTS}" != "1" ]]; then
  PG_PASSWORD="$(random_pw)"
  sudo -u postgres psql >/dev/null <<SQL
CREATE USER ${PG_USER} WITH ENCRYPTED PASSWORD '${PG_PASSWORD}';
SQL
  ok "Created PG user ${PG_USER}"
else
  if [[ -z "${PG_PASSWORD:-}" ]]; then
    PG_PASSWORD="$(random_pw)"
    sudo -u postgres psql >/dev/null <<SQL
ALTER USER ${PG_USER} WITH ENCRYPTED PASSWORD '${PG_PASSWORD}';
SQL
    ok "Rotated password for existing PG user"
  else
    ok "Re-using saved password for ${PG_USER}"
  fi
fi

if [[ "${DB_EXISTS}" != "1" ]]; then
  sudo -u postgres createdb -O "${PG_USER}" "${PG_DB}"
  ok "Created database ${PG_DB}"
else
  ok "Database ${PG_DB} already exists"
fi

DATABASE_URL="postgresql://${PG_USER}:${PG_PASSWORD}@127.0.0.1:5432/${PG_DB}"
save_state

# -------- 6. Code on disk ---------------------------------------------------

if [[ ! -d "${APP_DIR}" ]]; then
  if [[ -n "${REPO_URL}" ]]; then
    log "Cloning repository"
    sudo -u "${APP_USER}" git clone "${REPO_URL}" "${APP_DIR}"
  else
    die "App not found at ${APP_DIR}. Either pass REPO_URL=<git-url> or rsync the repo to ${APP_DIR} first."
  fi
else
  ok "Repo found at ${APP_DIR}"
  # If this is a git checkout, pull latest so re-runs pick up new commits
  # (e.g. config fixes pushed after a failed first install).
  if [[ -d "${APP_DIR}/.git" ]]; then
    log "Pulling latest from origin"
    if [[ -n "${REPO_URL}" ]]; then
      sudo -u "${APP_USER}" -H bash -c "cd ${APP_DIR} && git remote set-url origin '${REPO_URL}'" || true
    fi
    sudo -u "${APP_USER}" -H bash -c "cd ${APP_DIR} && git fetch origin && git reset --hard origin/HEAD" \
      || warn "git pull failed; continuing with on-disk code"
  fi
fi
chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"

if [[ ! -d "${WEB_DIR}" ]]; then
  die "Expected web app at ${WEB_DIR}. Is the repo layout correct?"
fi

# -------- 7. .env.local -----------------------------------------------------

ENV_FILE="${WEB_DIR}/.env.local"
if [[ ! -f "${ENV_FILE}" ]]; then
  log "Writing initial .env.local (placeholders for API keys; fill them in later)"
  cat > "${ENV_FILE}" <<EOF
# Synergy Business — production env
NEXT_PUBLIC_APP_URL=https://${DOMAIN}

# Anthropic Claude API
ANTHROPIC_API_KEY=

# Database
DATABASE_URL=${DATABASE_URL}
REDIS_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/portal/dashboard

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# HubSpot CRM
HUBSPOT_API_KEY=

# Resend Email
RESEND_API_KEY=
EMAIL_FROM=Synergy Business <hello@${DOMAIN}>
LEAD_NOTIFICATION_EMAIL=hello@${DOMAIN}

# Cloudflare R2 (Document Storage)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=synergybusiness-docs
R2_PUBLIC_URL=
EOF
  chown "${APP_USER}:${APP_USER}" "${ENV_FILE}"
  chmod 600 "${ENV_FILE}"
  ok "Wrote ${ENV_FILE}"
else
  # Always make sure DATABASE_URL is current
  if grep -q '^DATABASE_URL=' "${ENV_FILE}"; then
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${DATABASE_URL}|" "${ENV_FILE}"
  else
    printf "\nDATABASE_URL=%s\n" "${DATABASE_URL}" >> "${ENV_FILE}"
  fi
  if ! grep -q '^NEXT_PUBLIC_APP_URL=' "${ENV_FILE}"; then
    printf "NEXT_PUBLIC_APP_URL=https://%s\n" "${DOMAIN}" >> "${ENV_FILE}"
  fi
  ok "Refreshed DATABASE_URL in ${ENV_FILE}"
fi

# -------- 8. install + build ------------------------------------------------

log "Installing dependencies (pnpm install)"
sudo -u "${APP_USER}" -H bash -c "cd ${APP_DIR} && pnpm install --frozen-lockfile" \
  || sudo -u "${APP_USER}" -H bash -c "cd ${APP_DIR} && pnpm install"

log "Applying database migrations (pnpm db:push)"
if sudo -u "${APP_USER}" -H bash -c "cd ${APP_DIR} && pnpm db:push --force 2>/dev/null"; then
  ok "Migrations applied"
else
  warn "Migration step exited non-zero — usually OK on first run with no schema yet."
  warn "Re-run 'pnpm db:push' as ${APP_USER} after editing the schema if needed."
fi

log "Building Next.js app (pnpm build)"
sudo -u "${APP_USER}" -H bash -c "cd ${APP_DIR} && pnpm build"
ok "Build complete"

# -------- 9. PM2 + systemd --------------------------------------------------

log "Configuring PM2"
PM2_ECOSYSTEM="${APP_DIR}/scripts/ecosystem.config.cjs"
if [[ ! -f "${PM2_ECOSYSTEM}" ]]; then
  die "Missing ${PM2_ECOSYSTEM}. Make sure you've pulled the latest scripts/ folder."
fi

sudo -u "${APP_USER}" -H bash -c "cd ${APP_DIR} && pm2 startOrReload scripts/ecosystem.config.cjs"
sudo -u "${APP_USER}" -H bash -c "pm2 save"

# Install systemd unit so PM2 (and the app) auto-start on reboot.
PM2_STARTUP_CMD=$(sudo -u "${APP_USER}" pm2 startup systemd -u "${APP_USER}" --hp "${APP_HOME}" \
  | grep -E '^sudo ' || true)
if [[ -n "${PM2_STARTUP_CMD}" ]]; then
  bash -c "${PM2_STARTUP_CMD}" >/dev/null
fi
ok "PM2 + systemd configured"

# -------- 10. nginx ---------------------------------------------------------

log "Installing nginx site for ${DOMAIN}"
TEMPLATE="${APP_DIR}/scripts/nginx-synergybusiness.conf"
if [[ ! -f "${TEMPLATE}" ]]; then
  die "Missing nginx template at ${TEMPLATE}"
fi

sed \
  -e "s|__DOMAIN__|${DOMAIN}|g" \
  -e "s|__WWW_DOMAIN__|${WWW_DOMAIN}|g" \
  -e "s|__APP_PORT__|${APP_PORT}|g" \
  "${TEMPLATE}" > "${NGINX_SITE}"

ln -sf "${NGINX_SITE}" /etc/nginx/sites-enabled/synergybusiness
rm -f /etc/nginx/sites-enabled/default

nginx -t >/dev/null
systemctl reload nginx
ok "nginx serving HTTP on :80"

# -------- 11. SSL via certbot ----------------------------------------------

if ! [[ -d "/etc/letsencrypt/live/${DOMAIN}" ]]; then
  log "Requesting SSL certificate for ${DOMAIN}, ${WWW_DOMAIN}"
  certbot --nginx \
    --non-interactive --agree-tos \
    --redirect \
    --email "${LE_EMAIL}" \
    -d "${DOMAIN}" -d "${WWW_DOMAIN}" \
    || warn "Certbot failed — make sure DNS A records for ${DOMAIN} and ${WWW_DOMAIN} point to this VPS, then re-run."
else
  ok "Certificate already issued"
fi

# Renewal — Ubuntu installs a systemd timer automatically with the certbot
# package, so we just confirm it's enabled.
systemctl enable --now certbot.timer >/dev/null 2>&1 || true
ok "SSL renewal timer active"

# -------- 12. firewall ------------------------------------------------------

log "Configuring UFW firewall"
ufw --force reset >/dev/null
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw allow OpenSSH >/dev/null
ufw allow 'Nginx Full' >/dev/null
ufw --force enable >/dev/null
ok "Firewall: 22, 80, 443 open; everything else denied"

# -------- 13. summary -------------------------------------------------------

cat <<EOF

${C_GREEN}========================================================================${C_RESET}
${C_GREEN}  Synergy Business is live!${C_RESET}
${C_GREEN}========================================================================${C_RESET}

  Site:            https://${DOMAIN}
  App user:        ${APP_USER}
  App directory:   ${APP_DIR}
  Database:        postgresql://${PG_USER}@127.0.0.1/${PG_DB}
  PM2 status:      sudo -u ${APP_USER} pm2 status
  Logs:            sudo -u ${APP_USER} pm2 logs synergy-web

${C_YELLOW}Next steps${C_RESET}

  1. Edit ${ENV_FILE} and fill in API keys
     (Anthropic, Clerk, HubSpot, Resend, Sanity, R2). Then:

       sudo -u ${APP_USER} pm2 reload synergy-web

  2. To deploy a new version of the code later:

       sudo -u ${APP_USER} bash ${APP_DIR}/scripts/deploy.sh

  3. Database credentials are stored in ${STATE_FILE} (root-only).

EOF
