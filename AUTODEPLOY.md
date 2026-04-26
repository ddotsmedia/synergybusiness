# Auto-deploy: every push to `main` lands on the VPS

After this is set up, the cycle is:

```
edit code  ->  git push  ->  ~3-5 min later  ->  changes live on synergybusiness.ae
```

No `GO.bat`, no SSH-and-run, no manual `pnpm build`. The VPS pulls itself.

---

## Easiest setup: one click

Double-click **`SYNC.bat`** at the project root. The PowerShell script behind it does the whole 4-step setup automatically:

1. Generates an SSH deploy keypair at `%USERPROFILE%\.ssh\synergy-deploy`
2. SSHes into the VPS as root (asks for the password once), authorises the public key for the `synergy` user, fixes the non-interactive `PATH`, and installs the 5-minute cron poller as a backup
3. Verifies the new key works (silently re-SSHes as `synergy`)
4. Sets the three GitHub secrets — `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` — via the `gh` CLI if you have it, otherwise pastes each one into your clipboard and walks you through the GitHub UI
5. (Optional) prompts for a Slack webhook URL for deploy notifications
6. Triggers a test workflow run

**Prereqs**

- A successful `GO.bat` run on the VPS so `/home/synergy/app/` exists.
- Ability to SSH in as root (have the password handy).
- *Optional but recommended*: [`gh` CLI](https://cli.github.com/) installed and `gh auth login` done. Without it, secrets are set via copy-paste in the browser.

If anything fails, fix the underlying issue and just re-run `SYNC.bat`. It's idempotent.

---

## Architecture

| Layer            | Trigger              | Speed     | Use as       |
| ---------------- | -------------------- | --------- | ------------ |
| GitHub Actions   | every push to `main` | ~3–5 min  | **Primary**  |
| Cron poller (5m) | every 5 minutes      | up to 5 m | **Backup**   |

Both call the same `scripts/deploy.sh` which does:

```
git fetch + reset --hard origin/main
pnpm install
pnpm db:push   # apply Drizzle schema changes
pnpm build
pm2 reload synergy-web
```

If GitHub Actions ever has an outage, the cron poller will catch up the
next time it runs. If you don't want a cron poller, leave it disabled —
GitHub Actions alone is enough for normal use.

---

## One-time setup (15 minutes)

### Step 1 — Generate a deploy keypair on your laptop

```cmd
ssh-keygen -t ed25519 -C "synergy-vps-deploy" -f %USERPROFILE%\.ssh\synergy-deploy -N ""
```

That creates two files:

```
%USERPROFILE%\.ssh\synergy-deploy        (the PRIVATE key — keep secret)
%USERPROFILE%\.ssh\synergy-deploy.pub    (the PUBLIC key — safe to share)
```

### Step 2 — Authorise the public key on the VPS

Copy the public key:

```cmd
type %USERPROFILE%\.ssh\synergy-deploy.pub
```

Then SSH in and run the autodeploy setup, pasting the public key as
`PUBKEY`:

```bash
ssh root@194.164.151.202

# Paste the entire one-line .pub contents into the quotes:
PUBKEY="ssh-ed25519 AAAA...synergy-vps-deploy"

curl -fsSL https://raw.githubusercontent.com/ddotsmedia/synergybusiness/main/scripts/setup-autodeploy.sh \
  | sudo PUBKEY="$PUBKEY" ENABLE_CRON=1 bash
```

What this does:

- Adds the public key to `/home/synergy/.ssh/authorized_keys`
- Writes `/home/synergy/.ssh/environment` so non-interactive SSH sessions
  (which is what GitHub Actions uses) can find `node`, `pnpm`, `pm2`
- Enables `PermitUserEnvironment yes` in sshd
- (Optional, when `ENABLE_CRON=1`) installs a cron job that runs every 5
  minutes as the synergy user, polls for upstream changes, and runs
  `deploy.sh` if there are any. Drop `ENABLE_CRON=1` if you don't want it.

Confirm the key works from your laptop:

```cmd
ssh -i %USERPROFILE%\.ssh\synergy-deploy synergy@194.164.151.202 "whoami"
```

Should print `synergy`. If it asks for a password, the key isn't being
accepted — re-check `PUBKEY` was pasted correctly.

### Step 3 — Add GitHub repo secrets

Go to https://github.com/ddotsmedia/synergybusiness/settings/secrets/actions
and add three secrets:

| Name           | Value                                    |
| -------------- | ---------------------------------------- |
| `VPS_HOST`     | `194.164.151.202`                        |
| `VPS_USER`     | `synergy`                                |
| `VPS_SSH_KEY`  | full contents of `synergy-deploy` (the file WITHOUT `.pub`) |

Optional:

| Name        | Value                  |
| ----------- | ---------------------- |
| `VPS_PORT`  | `22` (default)         |

To copy the private key contents on Windows:

```cmd
type %USERPROFILE%\.ssh\synergy-deploy | clip
```

Then paste into the secret value field. **Include the entire file** —
both the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`
header lines.

### Step 4 — Push something to test

```cmd
cd C:\Users\home\Desktop\synergybusiness
echo. >> README.md
git add README.md
git commit -m "chore: trigger auto-deploy"
git push
```

Then watch the deploy run live at:

```
https://github.com/ddotsmedia/synergybusiness/actions
```

You'll see the steps stream in real time:

```
==> Fetching origin/main
==> Updated: a63d4bd -> 7f4e2c1
chore: trigger auto-deploy
==> Installing dependencies
==> Applying schema (pnpm db:push)
==> Building
==> Reloading PM2
==> Done. Current commit: 7f4e2c1 chore: trigger auto-deploy
  200  https://synergybusiness.ae/
  200  https://admin.synergybusiness.ae/admin
```

If any step fails, the workflow exits non-zero and GitHub will email you.

---

## Slack / email notifications

**GitHub email** is on by default — if a deploy fails, GitHub emails the
commit author. Nothing to set up.

**Slack** is optional but recommended for shared awareness. Set up an
[Incoming Webhook](https://api.slack.com/messaging/webhooks) for the
channel you want, then add the URL as a GitHub repo secret named
`SLACK_WEBHOOK_URL`. The next deploy will post a green tick on success
and a red X with a "View run log" button on failure.

`SYNC.bat` will prompt for this webhook URL and add it for you if `gh`
CLI is installed.

To set it manually:

```cmd
gh secret set SLACK_WEBHOOK_URL --repo ddotsmedia/synergybusiness --body "https://hooks.slack.com/services/..."
```

Or via the GitHub UI:
`Settings → Secrets and variables → Actions → New repository secret`.

---

## Where to find things later

| What | Where |
| ---- | ----- |
| Workflow definition | `.github/workflows/deploy.yml` |
| Deploy script (runs on VPS) | `/home/synergy/app/scripts/deploy.sh` |
| Cron poller log | `/var/log/synergy/poll-deploy.log` |
| App logs | `sudo -u synergy pm2 logs synergy-web` |
| Active commit on VPS | `ssh synergy@VPS "cd ~/app && git log -1"` |

---

## How to manually trigger a deploy

From the GitHub Actions tab:

1. **Actions** → **Deploy to VPS**
2. Click **Run workflow** → choose `main` → optional reason → **Run workflow**

Or directly on the VPS:

```bash
ssh synergy@194.164.151.202
bash /home/synergy/app/scripts/deploy.sh
```

---

## What if Actions is broken / I want to disable auto-deploy temporarily?

**Pause GitHub Actions:**

```
Settings -> Actions -> General -> Disable Actions for this repository
```

**Pause cron poller** (keeps the SSH key working but stops the 5-min loop):

```bash
sudo -u synergy crontab -l | grep -v synergy-poll-deploy | sudo -u synergy crontab -
```

**Re-enable the cron poller**:

```bash
sudo bash /home/synergy/app/scripts/setup-autodeploy.sh
```

(`PUBKEY` is optional on re-runs; the key is already authorised.)

---

## Troubleshooting

### `ssh: connect to host port 22: Connection refused`

Check the VPS firewall (`sudo ufw status`). It should allow `22/tcp`. The
default install opens it; only customisation closes it.

### `Permission denied (publickey)`

The private key in `VPS_SSH_KEY` doesn't match a public key in
`/home/synergy/.ssh/authorized_keys`. Re-run **Step 2** with the right
public key.

### Workflow runs but `pnpm` not found

The non-interactive SSH session can't find `node`/`pnpm`. The setup
script writes `~/.ssh/environment` and enables `PermitUserEnvironment`,
but if you're on a non-default sshd, double-check by running:

```bash
ssh synergy@VPS_HOST "which pnpm"
```

If empty, append the node bin path to `~/.ssh/environment` manually:

```bash
echo "PATH=/usr/bin:/usr/local/bin:$(dirname $(which node))" \
  | sudo -u synergy tee /home/synergy/.ssh/environment
sudo systemctl reload ssh
```

### Build runs out of memory on the smallest VPS plans

Add 2 GB swap once:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
