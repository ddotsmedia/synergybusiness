#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Run this on YOUR LAPTOP (not the VPS) to rsync the project to the VPS
# without going through GitHub.
#
# Usage:
#
#     bash scripts/upload-from-local.sh root@<vps-ip>
#     bash scripts/upload-from-local.sh root@<vps-ip> /home/synergy/app
#
# Requires: rsync + ssh key access to the server.
# ----------------------------------------------------------------------------
set -euo pipefail

SSH_TARGET="${1:-}"
REMOTE_DIR="${2:-/home/synergy/app}"
APP_USER="${APP_USER:-synergy}"

if [[ -z "${SSH_TARGET}" ]]; then
  cat <<'USAGE'
Usage:
  bash scripts/upload-from-local.sh <user@host> [remote-dir]

Example:
  bash scripts/upload-from-local.sh root@45.123.45.67
  bash scripts/upload-from-local.sh root@45.123.45.67 /home/synergy/app
USAGE
  exit 2
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${REPO_ROOT}"

echo "==> Rsyncing ${REPO_ROOT} -> ${SSH_TARGET}:${REMOTE_DIR}"
echo "    (excluding node_modules, .next, .git/objects/pack, .env.local)"

# Make sure remote parent directory exists and is owned correctly.
ssh "${SSH_TARGET}" "
  set -e
  id -u ${APP_USER} >/dev/null 2>&1 || useradd -m -s /bin/bash ${APP_USER}
  install -d -o ${APP_USER} -g ${APP_USER} ${REMOTE_DIR}
"

rsync -avz --delete --human-readable \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git/objects/pack' \
  --exclude='.env.local' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  --rsync-path="sudo -u ${APP_USER} rsync" \
  ./ "${SSH_TARGET}:${REMOTE_DIR}/"

echo
echo "==> Code uploaded. Now SSH in and run the installer:"
echo
echo "    ssh ${SSH_TARGET}"
echo "    sudo DOMAIN=synergybusiness.ae LE_EMAIL=admin@synergybusiness.ae bash ${REMOTE_DIR}/scripts/install-vps.sh"
echo
