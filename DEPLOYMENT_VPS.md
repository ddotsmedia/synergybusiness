# Deploy Synergy Business to a Hostinger VPS

Single-VPS, single-script deployment. The installer provisions a fresh
Ubuntu 22.04 / 24.04 box from zero to a live HTTPS site at
`https://synergybusiness.ae`.

## What it provisions

| Layer            | Software                                         |
| ---------------- | ------------------------------------------------ |
| OS               | Ubuntu 22.04 / 24.04 (Hostinger VPS default)     |
| Runtime          | Node.js 20 LTS, pnpm 10                          |
| Process manager  | PM2 (auto-restarts on crash & boot via systemd)  |
| Reverse proxy    | nginx (HTTP/2, gzip, security headers)           |
| TLS              | Let's Encrypt via certbot (auto-renew timer)     |
| Database         | PostgreSQL 16 (local, password-secured)          |
| Firewall         | UFW (allow 22, 80, 443; deny everything else)    |
| App              | Next.js 16 + Drizzle + Clerk + R2-ready          |

The whole thing fits on Hostinger's smallest VPS plan (~2 GB RAM).

---

## 0 · Before you start

You need:

1. **A Hostinger VPS** with Ubuntu 22.04 or 24.04. Note the public IP.
2. **Root SSH access** to it (Hostinger emails the credentials when the VPS
   is provisioned).
3. **DNS records** pointing to the VPS:
   - `A     @       <vps-ip>` — public marketing site
   - `A     www     <vps-ip>` — alias of the public site
   - `A     admin   <vps-ip>` — admin panel (separate subdomain)

   Add these in **hPanel → Domains → synergybusiness.ae → DNS / Manage**.
   Wait 5–10 minutes for them to propagate before running the installer
   (otherwise certbot will skip the missing ones and you'll need to re-run).

   The setup serves two domains from one Next.js process:

   | URL                                  | Routes                       |
   | ------------------------------------ | ---------------------------- |
   | `https://synergybusiness.ae`         | Public marketing + `/portal` |
   | `https://www.synergybusiness.ae`     | (alias)                      |
   | `https://admin.synergybusiness.ae/admin` | Admin panel              |

   `synergybusiness.ae/admin` redirects to the admin subdomain — you can't
   accidentally expose the admin panel on the public domain.

   Confirm with:
   ```bash
   dig +short synergybusiness.ae
   dig +short www.synergybusiness.ae
   ```
   Both should return your VPS IP.

---

## 1 · Get the code onto the VPS

Pick one of two options.

### Option A — Git clone (recommended)

Push this repo to GitHub (private repo is fine; the VPS will need an
SSH-deploy key or a Personal Access Token to clone). Then run the installer
with `REPO_URL` set:

```bash
ssh root@<vps-ip>

curl -fsSL https://raw.githubusercontent.com/<you>/synergybusiness/main/scripts/install-vps.sh \
  | sudo DOMAIN=synergybusiness.ae \
         LE_EMAIL=admin@synergybusiness.ae \
         REPO_URL=https://github.com/<you>/synergybusiness.git \
         bash
```

If your repo is private, use a token in the URL:
`https://<user>:<token>@github.com/<you>/synergybusiness.git`. The installer
clones once; later deploys pull as the `synergy` user.

### Option B — Rsync from your laptop

If you'd rather not push to GitHub, use the helper script on your
laptop:

```bash
# From your laptop
cd ~/Desktop/synergybusiness
bash scripts/upload-from-local.sh root@<vps-ip>
```

Then SSH into the VPS and run the installer:

```bash
ssh root@<vps-ip>

sudo DOMAIN=synergybusiness.ae \
     LE_EMAIL=admin@synergybusiness.ae \
     bash /home/synergy/app/scripts/install-vps.sh
```

---

## 2 · What the installer does

```
==> Installing system packages
==> Installing Node.js 20
==> Installing pnpm 10
==> Installing PM2
==> Creating user synergy
==> Configuring PostgreSQL
   Created PG user synergy
   Created database synergybusiness
==> Cloning repository (or finding rsync'd code)
==> Writing initial .env.local (placeholders for API keys; fill them in later)
==> Installing dependencies (pnpm install)
==> Applying database migrations (pnpm db:push)
==> Building Next.js app (pnpm build)
==> Configuring PM2
==> Installing nginx site
==> Requesting SSL certificate
==> Configuring UFW firewall

========================================================================
  Synergy Business is live!
========================================================================
  Site:            https://synergybusiness.ae
  ...
```

End-to-end on a fresh VPS this takes roughly 5–8 minutes (the bulk is
`pnpm install` and `pnpm build`).

---

## 3 · Add your API keys

Right after install, the site is **up at HTTPS but every integration is
gracefully disabled** (chat returns 503, leads log to console only, blog
shows seed posts, the portal shows demo data with the amber banner).

Edit `.env.local` and reload:

```bash
sudo -u synergy nano /home/synergy/app/apps/web/.env.local
sudo -u synergy pm2 reload synergy-web --update-env
```

Keys to fill in:

| Variable                              | Unlocks                                    |
| ------------------------------------- | ------------------------------------------ |
| `ANTHROPIC_API_KEY`                   | Chat widget + calculator AI explanation    |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | Portal authentication                      |
| `CLERK_SECRET_KEY`                    | Portal authentication (server-side)        |
| `RESEND_API_KEY`                      | Lead confirmation + internal notifications |
| `HUBSPOT_API_KEY`                     | Lead → CRM contact                         |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`       | Sanity-managed blog                        |
| `SANITY_API_TOKEN`                    | Read draft posts (optional)                |
| `R2_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` | Document uploads in the portal             |

`DATABASE_URL` is set automatically by the installer.

---

## 4 · Deploy a new version

After you push code to GitHub:

```bash
ssh root@<vps-ip>
sudo -u synergy bash /home/synergy/app/scripts/deploy.sh
```

If you re-rsync from your laptop instead of pushing to git, pass `SKIP_GIT=1`:

```bash
sudo -u synergy SKIP_GIT=1 bash /home/synergy/app/scripts/deploy.sh
```

The deploy script:

1. `git pull` (unless `SKIP_GIT=1`)
2. `pnpm install`
3. `pnpm db:push` (apply schema changes)
4. `pnpm build`
5. `pm2 reload synergy-web --update-env`  ← zero-downtime

---

## 5 · Day-to-day operations

| Task                          | Command                                          |
| ----------------------------- | ------------------------------------------------ |
| App status                    | `sudo -u synergy pm2 status`                     |
| Live logs                     | `sudo -u synergy pm2 logs synergy-web`           |
| Restart app                   | `sudo -u synergy pm2 reload synergy-web`         |
| Edit env, then reload         | see step 3                                       |
| Database shell                | `sudo -u postgres psql synergybusiness`          |
| DB UI                         | `sudo -u synergy pnpm db:studio` (then ssh-tunnel port 4983) |
| nginx config test             | `sudo nginx -t && sudo systemctl reload nginx`   |
| Renew SSL manually            | `sudo certbot renew && sudo systemctl reload nginx` |
| View firewall                 | `sudo ufw status`                                |

---

## 6 · Troubleshooting

### Certbot fails — `unauthorized` or `connection refused`

DNS hasn't propagated yet, or the A records don't point to this VPS.
Fix the DNS, then re-run:

```bash
sudo certbot --nginx -d synergybusiness.ae -d www.synergybusiness.ae
```

### `502 Bad Gateway` from nginx

The Next.js process isn't running on `127.0.0.1:3000`.

```bash
sudo -u synergy pm2 logs synergy-web --lines 100
sudo -u synergy pm2 restart synergy-web
```

### Build runs out of memory on a 1 GB VPS

Add a swap file before re-running:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Database connection errors after install

```bash
sudo systemctl status postgresql
sudo -u postgres psql -c '\l'   # list databases — should include synergybusiness
sudo cat /etc/synergybusiness.state   # contains DATABASE_URL & saved password
```

If `DATABASE_URL` in `apps/web/.env.local` is stale, re-run the installer
— it's idempotent and will rewrite the line.

### Port 3000 already in use

You probably have a stale process. Find and kill it:

```bash
sudo lsof -i :3000
sudo -u synergy pm2 delete synergy-web
sudo -u synergy pm2 startOrReload /home/synergy/app/scripts/ecosystem.config.cjs
```

---

## 7 · Files this deployment ships

```
scripts/
├── install-vps.sh                ← run once, on fresh VPS, as root
├── deploy.sh                     ← run on every code update, as synergy
├── nginx-synergybusiness.conf    ← installed to /etc/nginx/sites-available/
├── ecosystem.config.cjs          ← PM2 process definition
└── upload-from-local.sh          ← runs on your laptop (rsync helper)

DEPLOYMENT.md                     ← DNS guide for any host (Vercel etc.)
DEPLOYMENT_VPS.md                 ← this file (Hostinger VPS specifics)
```

---

## 8 · Optional hardening (do these once you're settled in)

- **SSH**: disable password auth, root login.
  ```bash
  sudo nano /etc/ssh/sshd_config
  # Set: PermitRootLogin no
  # Set: PasswordAuthentication no
  sudo systemctl reload sshd
  ```
  Make sure you have an SSH key for a non-root sudoer first!
- **Auto security updates**: `sudo apt install unattended-upgrades && sudo dpkg-reconfigure -plow unattended-upgrades`
- **Off-site Postgres backups**: schedule `pg_dump synergybusiness` to S3
  (or Hostinger object storage) with a daily cron.
- **Monitoring**: `pm2 install pm2-server-monit` for a quick CPU/RAM/disk
  view, or wire to Sentry / Logtail / Hostinger's monitoring panel.
