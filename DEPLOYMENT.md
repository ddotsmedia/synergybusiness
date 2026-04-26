# Deployment & DNS — synergybusiness.ae

This guide covers everything you need to point `synergybusiness.ae` at the
deployed Next.js app. The codebase is already configured for the canonical
URL `https://synergybusiness.ae` (env, metadata, sitemap, robots, JSON-LD).

You said **Hostinger nameservers are already configured at the registrar**.
That means DNS records are managed inside the **Hostinger hPanel**, under
**Domains → DNS / nameservers → Manage DNS records** for `synergybusiness.ae`.

Pick one of the two deployment scenarios below and add the matching records.

---

## Scenario A — Deploy on Vercel (recommended for Next.js)

Vercel runs Next.js 16 + Turbopack natively, with edge caching, image
optimisation, and per-route serverless functions. Best DX for this codebase.

### 1. Push to GitHub

```bash
cd ~/Desktop/synergybusiness
git init   # if not already
git add .
git commit -m "Initial commit"
git branch -M main
gh repo create synergybusiness --private --source=. --push   # or use the GitHub UI
```

### 2. Import to Vercel

- Go to [vercel.com/new](https://vercel.com/new) and import the repo.
- **Framework preset:** Next.js (auto-detected).
- **Root directory:** `apps/web`.
- **Build command:** `pnpm build` (default).
- **Install command:** `pnpm install` (default).
- **Output directory:** `.next` (default).
- Add the env vars from `apps/web/.env.example` to the Vercel project (Project
  Settings → Environment Variables). At minimum, set:
  - `NEXT_PUBLIC_APP_URL=https://synergybusiness.ae`
  - All API keys you've obtained (Anthropic, Clerk, Sanity, HubSpot, Resend,
    R2, `DATABASE_URL`).

### 3. Add the domain in Vercel

- Vercel → Project → **Settings → Domains** → add `synergybusiness.ae` and
  `www.synergybusiness.ae`.
- Vercel will show you the exact records it expects. They will be:

| Type  | Name | Value                    | TTL   |
| ----- | ---- | ------------------------ | ----- |
| A     | @    | `76.76.21.21`            | 3600  |
| CNAME | www  | `cname.vercel-dns.com.`  | 3600  |

(The IP and CNAME above are Vercel's stable values at time of writing —
**use whatever Vercel shows you in the dashboard** as it's the source of truth.)

### 4. Add the records in Hostinger hPanel

- hPanel → **Domains → synergybusiness.ae → DNS / Nameservers → Manage DNS
  records**.
- Delete any existing `A` record for `@` and any existing `CNAME` for `www`
  before adding new ones.
- Add the two records exactly as Vercel showed you.
- Save. Propagation is usually under 10 minutes when nameservers are already
  Hostinger's.

### 5. Verify

- Wait 5–10 minutes, then click **Verify** in Vercel's domain panel.
- Vercel will issue a Let's Encrypt SSL cert automatically.
- Visit [https://synergybusiness.ae](https://synergybusiness.ae) — the site
  should load over HTTPS with a valid cert.

---

## Scenario B — Deploy on Hostinger (Node hosting / VPS)

Use this only if you specifically want Hostinger's hosting. Hostinger's
shared hosting **does not** run Node.js — you need either **Hostinger Cloud
Hosting** or a **VPS** plan.

### 1. Build locally and ship the bundle

```bash
cd ~/Desktop/synergybusiness/apps/web
pnpm build
```

The output is a Node-server-compatible build under `.next`. Copy the entire
`apps/web/` folder (excluding `node_modules`) to your Hostinger server.

### 2. On the server

```bash
cd /home/u123/htdocs/synergybusiness
pnpm install --production
NODE_ENV=production pnpm start    # runs `next start`, listens on port 3000
```

Configure Hostinger's reverse proxy / Apache to forward port 80/443 to
3000, or run behind PM2.

### 3. DNS records in Hostinger hPanel

If the site lives on the same Hostinger account, hPanel offers a "Use this
domain for hosting" button that wires the records automatically. Otherwise:

| Type  | Name | Value                  | Notes                          |
| ----- | ---- | ---------------------- | ------------------------------ |
| A     | @    | (your VPS public IPv4) | Hostinger shows this in hPanel |
| CNAME | www  | `synergybusiness.ae.`  | Trailing dot is required       |

### 4. SSL

Hostinger's Let's Encrypt button is in **Hosting → SSL**. Click it once DNS
has propagated. Renewal is automatic.

---

## Other DNS records you'll likely want

These are independent of the hosting scenario.

### Google Workspace / email forwarding

If `hello@synergybusiness.ae` should be a real mailbox:

| Type | Name | Priority | Value                            |
| ---- | ---- | -------- | -------------------------------- |
| MX   | @    | 1        | `aspmx.l.google.com.`            |
| MX   | @    | 5        | `alt1.aspmx.l.google.com.`       |
| MX   | @    | 5        | `alt2.aspmx.l.google.com.`       |
| MX   | @    | 10       | `alt3.aspmx.l.google.com.`       |
| MX   | @    | 10       | `alt4.aspmx.l.google.com.`       |
| TXT  | @    | —        | `v=spf1 include:_spf.google.com ~all` |

(If you're using Hostinger's bundled email instead, hPanel sets MX records
for you.)

### Resend domain verification

When you set up `resend.com` to send transactional email from
`synergybusiness.ae`, Resend gives you 3 records — usually **TXT** for SPF, a
**TXT** for DKIM (CNAME-style) and a **MX** for inbound.

Add them exactly as Resend shows in the dashboard. Without them, our
confirmation emails will deliver as `onboarding@resend.dev` (the dev
default already wired in `apps/web/.env.local`).

### Cloudflare R2 public bucket

If you serve uploaded documents from a public R2 bucket via a custom domain
(e.g. `docs.synergybusiness.ae`), add a CNAME pointing to your R2 public URL
(Cloudflare gives you the value in the bucket settings). Then set
`R2_PUBLIC_URL=https://docs.synergybusiness.ae` in `.env.local`.

---

## After DNS is live

Run these one-time checks:

```bash
# Verify the canonical URL is resolving and serving HTTPS
curl -sI https://synergybusiness.ae | head -3
curl -sI https://www.synergybusiness.ae | head -3   # should redirect to apex

# Verify the sitemap and robots.txt
curl -s https://synergybusiness.ae/sitemap.xml | head -10
curl -s https://synergybusiness.ae/robots.txt
```

Submit the sitemap to:

- [Google Search Console](https://search.google.com/search-console) — add
  property `synergybusiness.ae`, verify via DNS TXT or Vercel's auto-verify.
- [Bing Webmaster Tools](https://www.bing.com/webmasters) — same flow.

---

## Quick checklist

- [ ] Decide hosting (A: Vercel, recommended — or B: Hostinger)
- [ ] Push code to GitHub
- [ ] Import / upload to chosen host
- [ ] Set all `.env` vars in the hosting dashboard
- [ ] Add A + CNAME records in Hostinger hPanel per the host's instructions
- [ ] Wait 5–10 minutes; verify SSL is issued
- [ ] Test the live site, the contact form (one real submission), and the
      `/portal` redirect to sign-in (once Clerk keys are set in production)
- [ ] Submit `https://synergybusiness.ae/sitemap.xml` to Google Search Console
