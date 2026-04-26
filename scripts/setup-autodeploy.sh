#!/usr/bin/env bash
# ============================================================================
# Synergy Business — one-shot auto-deploy setup
#
# Run on the VPS as root, ONCE, after the initial install. Sets up:
#   1. SSH access for the `synergy` user from a deploy keypair (so GitHub
#      Actions can ssh in and run deploy.sh)
#   2. Optionally: a 5-minute cron poller as a backup auto-deploy path
#
# Usage from a fresh shell, paste it in fully:
#
#     # generate the keypair on your laptop first:
#     #   ssh-keygen -t ed25519 -f synergy-deploy -N ""
#     # then upload the .pub contents:
#     PUBKEY="ssh-ed25519 AAAA...comment"
#     curl -fsSL https://raw.githubusercontent.com/ddotsmedia/synergybusiness/main/scripts/setup-autodeploy.sh \
#       | sudo PUBKEY="$PUBKEY" ENABLE_CRON=1 bash
#
# After this, paste the PRIVATE key into your GitHub repo:
#   Settings -> Secrets and variables -> Actions -> New repository secret
#     VPS_HOST     = 194.164.151.202
#     VPS_USER     = synergy
#     VPS_SSH_KEY  = (contents of ~/synergy-deploy, the private file)
#
# Idempotent — safe to re-run.
# ============================================================================
set -euo pipefail

APP_USER="${APP_USER:-synergy}"
APP_HOME="/home/${APP_USER}"
APP_DIR="${APP_HOME}/app"
SSH_DIR="${APP_HOME}/.ssh"
AUTH_KEYS="${SSH_DIR}/authorized_keys"
PUBKEY="${PUBKEY:-}"
ENABLE_CRON="${ENABLE_CRON:-0}"

C_RESET=$'\033[0m'
C_GREEN=$'\033[1;32m'
C_BLUE=$'\033[1;34m'
C_YELLOW=$'\033[1;33m'
C_RED=$'\033[1;31m'

log()  { printf "%s==> %s%s\n" "${C_BLUE}" "$*" "${C_RESET}"; }
ok()   { printf "%s   %s%s\n" "${C_GREEN}" "$*" "${C_RESET}"; }
warn() { printf "%s   %s%s\n" "${C_YELLOW}" "$*" "${C_RESET}"; }
die()  { printf "%s!! %s%s\n" "${C_RED}" "$*" "${C_RESET}" >&2; exit 1; }

if [[ "${EUID}" -ne 0 ]]; then
  die "Run as root. Try: sudo PUBKEY=\"...\" bash $0"
fi

if ! id -u "${APP_USER}" >/dev/null 2>&1; then
  die "User '${APP_USER}' doesn't exist. Run install-vps.sh first."
fi

if [[ ! -d "${APP_DIR}" ]]; then
  die "App dir '${APP_DIR}' missing. Run install-vps.sh first."
fi

# ---------- 1. SSH access for synergy ---------------------------------------

log "Preparing ${SSH_DIR}"
sudo -u "${APP_USER}" mkdir -p "${SSH_DIR}"
sudo -u "${APP_USER}" chmod 700 "${SSH_DIR}"
sudo -u "${APP_USER}" touch "${AUTH_KEYS}"
sudo -u "${APP_USER}" chmod 600 "${AUTH_KEYS}"

if [[ -n "${PUBKEY}" ]]; then
  if grep -qF "${PUBKEY}" "${AUTH_KEYS}" 2>/dev/null; then
    ok "Public key already authorised"
  else
    echo "${PUBKEY}" | sudo -u "${APP_USER}" tee -a "${AUTH_KEYS}" >/dev/null
    ok "Authorised public key for ${APP_USER}"
  fi
else
  warn "No PUBKEY provided. Skipping SSH key install."
  warn "When you have the public key, append it manually:"
  warn "  sudo -u ${APP_USER} bash -c 'echo \"<pubkey>\" >> ${AUTH_KEYS}'"
fi

# Confirm sshd accepts password-less login for synergy. We don't change
# /etc/ssh/sshd_config — most VPS images already allow key auth.
ok "SSH dir + authorized_keys ready"

# Make sure pm2 + node are reachable from the *non-interactive* SSH session
# Actions uses. SSH non-interactive shells skip ~/.profile and ~/.bashrc, so
# we add a small drop-in.
NODE_DIR="$(dirname "$(command -v node || true)")"
if [[ -n "${NODE_DIR}" ]]; then
  PROFILE_FILE="${APP_HOME}/.ssh/environment"
  PROFILE_TMP="$(mktemp)"
  echo "PATH=${NODE_DIR}:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" > "${PROFILE_TMP}"
  install -m 600 -o "${APP_USER}" -g "${APP_USER}" "${PROFILE_TMP}" "${PROFILE_FILE}"
  rm -f "${PROFILE_TMP}"
  ok "Wrote ${PROFILE_FILE} (PATH for non-interactive SSH)"

  # Enable PermitUserEnvironment so ~/.ssh/environment is honoured.
  if ! grep -qE '^[[:space:]]*PermitUserEnvironment[[:space:]]+yes' /etc/ssh/sshd_config; then
    if grep -qE '^[[:space:]]*#?[[:space:]]*PermitUserEnvironment' /etc/ssh/sshd_config; then
      sed -i 's|^[[:space:]]*#\?[[:space:]]*PermitUserEnvironment.*|PermitUserEnvironment yes|' /etc/ssh/sshd_config
    else
      echo "PermitUserEnvironment yes" >> /etc/ssh/sshd_config
    fi
    systemctl reload ssh 2>/dev/null || systemctl reload sshd 2>/dev/null || true
    ok "Enabled PermitUserEnvironment in sshd"
  fi
fi

# ---------- 2. Cron poller (optional) ---------------------------------------

if [[ "${ENABLE_CRON}" == "1" ]]; then
  POLLER="${APP_DIR}/scripts/poll-deploy.sh"
  if [[ ! -f "${POLLER}" ]]; then
    warn "Cron requested but ${POLLER} not found. Skipping."
  else
    chmod +x "${POLLER}"
    LOG_DIR="/var/log/synergy"
    install -d -o "${APP_USER}" -g "${APP_USER}" -m 750 "${LOG_DIR}"

    CRON_TAG="# synergy-poll-deploy"
    NEW_LINE="*/5 * * * * ${POLLER} ${CRON_TAG}"

    EXISTING="$(sudo -u "${APP_USER}" crontab -l 2>/dev/null || true)"
    if echo "${EXISTING}" | grep -q "${CRON_TAG}"; then
      ok "Cron poller already installed"
    else
      ( echo "${EXISTING}" | grep -v "${CRON_TAG}" || true; echo "${NEW_LINE}" ) \
        | sudo -u "${APP_USER}" crontab -
      ok "Installed cron poller (every 5 min) -> ${LOG_DIR}/poll-deploy.log"
    fi
  fi
else
  warn "Cron poller NOT installed. Pass ENABLE_CRON=1 to enable it."
fi

# ---------- 3. Summary ------------------------------------------------------

cat <<EOF

${C_GREEN}========================================================================${C_RESET}
${C_GREEN}  Auto-deploy ready.${C_RESET}
${C_GREEN}========================================================================${C_RESET}

  GitHub Actions secrets to add at:
  https://github.com/<your-user>/synergybusiness/settings/secrets/actions

    VPS_HOST        $(hostname -I | awk '{print $1}')
    VPS_USER        ${APP_USER}
    VPS_SSH_KEY     <paste the PRIVATE key, the file WITHOUT .pub>
    VPS_PORT        22 (optional)

  After secrets are set, every push to 'main' triggers .github/workflows/deploy.yml
  which SSHes to this server and runs scripts/deploy.sh.

  Backup cron poller: ${ENABLE_CRON}
  Manual deploy:      sudo -u ${APP_USER} bash ${APP_DIR}/scripts/deploy.sh
  Tail logs:          sudo -u ${APP_USER} pm2 logs synergy-web

EOF
