#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Synergy Business — cron-friendly auto-deploy poller
#
# Designed to be run from cron every few minutes as the synergy user. Silent
# when there are no upstream changes; runs deploy.sh when there are. All
# output is captured to /var/log/synergy/poll-deploy.log so cron emails
# stay quiet.
#
# Cron entry (installed by scripts/setup-autodeploy.sh):
#   */5 * * * * /home/synergy/app/scripts/poll-deploy.sh
# ----------------------------------------------------------------------------
set -euo pipefail

APP_DIR="${APP_DIR:-/home/synergy/app}"
BRANCH="${BRANCH:-main}"
LOG_FILE="${LOG_FILE:-/var/log/synergy/poll-deploy.log}"

# Make sure the log dir exists. Cron has a tiny PATH so be explicit.
LOG_DIR="$(dirname "${LOG_FILE}")"
if [[ ! -d "${LOG_DIR}" ]]; then
  mkdir -p "${LOG_DIR}" 2>/dev/null || {
    LOG_FILE="${HOME:-/tmp}/synergy-poll-deploy.log"
  }
fi

# A simple file lock so two cron ticks can't deploy in parallel.
LOCK="/tmp/synergy-poll-deploy.lock"
exec 9>"${LOCK}"
if ! flock -n 9; then
  exit 0
fi

stamp() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

cd "${APP_DIR}"

# Quiet network call — no stdout unless something interesting happens.
if ! git fetch origin "${BRANCH}" 2>/dev/null; then
  exit 0
fi

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/${BRANCH}")

if [[ "${LOCAL}" == "${REMOTE}" ]]; then
  # No-op tick. Stay silent so cron doesn't spam mail.
  exit 0
fi

{
  echo
  echo "===== $(stamp) — auto-deploy ====="
  echo "Updating ${LOCAL} -> ${REMOTE}"
  git --no-pager log --oneline "${LOCAL}..${REMOTE}" || true
  echo

  # Reset to upstream and run the regular deploy.
  if git reset --hard "origin/${BRANCH}"; then
    echo "Reset OK"
  else
    echo "ERROR: git reset failed"
    exit 1
  fi

  if SKIP_GIT=1 bash "${APP_DIR}/scripts/deploy.sh"; then
    echo "Deploy OK at $(stamp)"
  else
    echo "ERROR: deploy.sh failed"
    exit 1
  fi
} >> "${LOG_FILE}" 2>&1
