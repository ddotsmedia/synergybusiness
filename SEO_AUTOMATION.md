# SEO Automation — Synergy Business

Tailored SEO setup for the `apps/web` Next.js 16 (App Router) project.
Goal: every new page gets correct sitemap entries, metadata, JSON-LD, robots
rules, and OG image **automatically** — no manual steps per page.

> ⚠️ This project is on **Next 16.2.4**. Prefer App Router file conventions
> (`app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`). Do **not**
> add `next-sitemap` — it would conflict with the native `app/sitemap.ts`
> route already in place.

---

## 1. What's already in the repo

| Concern              | File                                           | Status      |
| -------------------- | ---------------------------------------------- | ----------- |
| Sitemap              | `apps/web/app/sitemap.ts`                      | ✅ Native   |
| robots.txt           | `apps/web/app/robots.ts`                       | ✅ Native   |
| `metadataBase`       | `apps/web/app/layout.tsx`                      | ✅          |
| `siteUrl` constants  | `apps/web/lib/site.ts`                         | ✅          |
| Per-page metadata    | `generateMetadata` in route files              | ✅ ad-hoc   |
| JSON-LD              | Inline in `page.tsx` files                     | ✅ ad-hoc   |

---

## 2. What this automation adds

| File                                    | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `apps/web/lib/seo.ts`                   | `buildMetadata({...})` shared helper                 |
| `apps/web/lib/jsonld.ts`                | `localBusinessLd`, `organizationLd`, `serviceLd`, `faqLd`, `breadcrumbLd`, `articleLd` |
| `apps/web/app/opengraph-image.tsx`      | Dynamic OG image (1200×630, brand gradient)          |
| `apps/web/app/layout.tsx` (edit)        | Adds `alternates: { canonical, languages }`          |

---

## 3. How to use the helpers

### Per-page metadata

```ts
// app/(marketing)/services/free-zone/page.tsx
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Free Zone Company Setup in Abu Dhabi",
  description: "ADGM, KIZAD, twofour54, Masdar City — full setup from AED 12,500.",
  path: "/services/free-zone",
});
```

For dynamic routes, call `buildMetadata` from inside `generateMetadata()`.

### JSON-LD on a page

```tsx
import { faqLd, serviceLd } from "@/lib/jsonld";

const ld = serviceLd({ name, description, slug, startingPrice });

return (
  <>
    {/* page content */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  </>
);
```

Available helpers:
- `localBusinessLd` — drop into root layout or contact page once
- `organizationLd` — site-wide org info
- `serviceLd({ name, description, slug, startingPrice? })`
- `faqLd([{ q, a }, ...])`
- `breadcrumbLd([{ name, path }, ...])`
- `articleLd({ title, description, slug, publishedAt, ... })`

### OG image

`/opengraph-image` is now generated automatically at 1200×630 with the brand
gradient. Crawlers (Twitter, Slack, LinkedIn, FB) will pick it up via the
`metadataBase` URL. To override per route, drop another `opengraph-image.tsx`
deeper in the app folder (e.g. `app/(marketing)/services/[slug]/opengraph-image.tsx`).

---

## 4. Per-page checklist (kept short on purpose)

When adding a new page:

1. Export `metadata = buildMetadata({...})` (or `generateMetadata` for dynamic).
2. If the page lists FAQs, render `faqLd(...)` JSON-LD.
3. If the page is a service, render `serviceLd(...)` JSON-LD.
4. Add the route URL to `app/sitemap.ts` if static; dynamic routes (services,
   blog) are already wired via `SERVICE_SLUGS` and `BLOG_POSTS`.

That's it — robots, OG image, canonical, base URL are automatic.

---

## 5. Migration of existing pages (optional, do incrementally)

The home, services/[slug], blog/[slug], free-zones, blog index, and marketing
layout already do `generateMetadata` and inline JSON-LD. They can be migrated
to use `buildMetadata` and the `jsonld.ts` helpers for DRYness, but they
work fine as-is. Migrate only when touching the file for another reason.

---

## 6. Search Console + Analytics

- Add `GOOGLE_SITE_VERIFICATION` meta in `app/layout.tsx` `metadata.verification`
  once you have a token.
- Submit `https://synergybusiness.ae/sitemap.xml` to GSC after first deploy.
- Add GA4 via `@next/third-parties/google` (separate task).

---

## 7. What this does NOT do

- Doesn't write content / keywords for you.
- Doesn't auto-fix Core Web Vitals — that's a perf pass, separate.
- Doesn't do off-page SEO (backlinks, citations, GBP).
- Doesn't audit live pages — see "Recurring audit" below.

---

## 8. Optional next step: recurring audit agent

A `/schedule`'d weekly agent can crawl the live site, check for missing
meta/canonical/JSON-LD, broken links, and GSC errors, then open a PR with
fixes. Ask for it once the site is live.
