# SEO Automation — Synergy Business

State of SEO on the `apps/web` Next.js 16 (App Router) project, and how it's
wired up. Goal: every new page gets correct sitemap, metadata, JSON-LD,
robots, OG image, and structured data — automatically.

> ⚠️ This project is on **Next 16.2.4**. SEO uses native App Router file
> conventions (`app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`,
> `app/icon.tsx`, `app/manifest.ts`). Do **not** add `next-sitemap` — it
> would conflict with the native `app/sitemap.ts`.

---

## 1. What ships in the repo (live now)

### File-convention assets (auto-routed by Next)

| File                              | Endpoint              | Purpose                                     |
| --------------------------------- | --------------------- | ------------------------------------------- |
| `app/sitemap.ts`                  | `/sitemap.xml`        | Native sitemap with all routes              |
| `app/robots.ts`                   | `/robots.txt`         | Allow/disallow rules + sitemap reference    |
| `app/opengraph-image.tsx`         | `/opengraph-image`    | 1200×630 brand OG image                     |
| `app/twitter-image.tsx`           | `/twitter-image`      | 1200×630 Twitter card image                 |
| `app/icon.tsx`                    | `/icon`               | 32×32 favicon (S monogram, navy + gold)     |
| `app/apple-icon.tsx`              | `/apple-icon`         | 180×180 iOS home-screen icon                |
| `app/manifest.ts`                 | `/manifest.webmanifest` | PWA manifest, theme color, icons          |
| `app/favicon.ico`                 | `/favicon.ico`        | Static favicon (legacy browsers)            |

### Helpers in `lib/`

| File             | Exports                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `lib/seo.ts`     | `buildMetadata({ title, description, path, image?, type?, noindex? })` — Metadata factory      |
| `lib/jsonld.ts`  | `localBusinessLd`, `organizationLd`, `serviceLd(...)`, `faqLd(...)`, `breadcrumbLd(...)`, `articleLd(...)` |

### Root layout

`app/layout.tsx` exports:
- `metadata` — title template, default OG, Twitter, robots, optional `verification` from `GOOGLE_SITE_VERIFICATION` env.
- `viewport` — themeColor `#0a2540` (light + dark), device-width.
- `metadataBase` set to `siteUrl` so all relative OG / canonical URLs resolve.
- `alternates: { canonical: "/", languages: { "en-AE": "/" } }`.

### Marketing layout

`app/(marketing)/layout.tsx` injects a site-wide `ProfessionalService`
JSON-LD on every marketing page (org name, address, areaServed across all 7
emirates).

---

## 2. JSON-LD coverage per page

| Route                | Emits                                                        |
| -------------------- | ------------------------------------------------------------ |
| `/`                  | `FAQPage` + ProfessionalService                              |
| `/about`             | ProfessionalService                                          |
| `/contact`           | `LocalBusiness` + Breadcrumb + ProfessionalService           |
| `/book`              | `Service` (free 30-min consultation) + Breadcrumb + ProfessionalService |
| `/cost-calculator`   | `WebApplication` + Breadcrumb + ProfessionalService          |
| `/free-zones`        | `ItemList` + Breadcrumb + ProfessionalService                |
| `/blog`              | `Blog` + Breadcrumb + ProfessionalService                    |
| `/blog/[slug]`       | `BlogPosting` + Breadcrumb + ProfessionalService             |
| `/services/[slug]`   | `Service` + `FAQPage` + Breadcrumb + ProfessionalService     |
| `/legal/*`           | ProfessionalService (no page-specific schema needed)         |

---

## 3. Per-page metadata: how to add a new page

```ts
// app/(marketing)/some-route/page.tsx
import { buildMetadata } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/jsonld";

export const metadata = buildMetadata({
  title: "Page Title",
  description: "Page description for search engines and OG cards.",
  path: "/some-route",
});

const breadcrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Page Title", path: "/some-route" },
]);

export default function Page() {
  return (
    <>
      <YourComponent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
    </>
  );
}
```

For dynamic routes (`[slug]`), use `generateMetadata` with the same call
inside it.

---

## 4. Sitemap

`app/sitemap.ts` includes:
- Static routes: `/`, `/about`, `/contact`, `/free-zones`, `/cost-calculator`, `/blog`, `/book`, `/legal/{privacy,terms,cookies}`
- Dynamic routes: every entry in `SERVICE_SLUGS` and `BLOG_POSTS`

When you add a new service or blog post, the sitemap picks it up
automatically. New static routes need to be added by hand.

---

## 5. Search Console + Analytics

- **Verify domain**: paste the meta-tag content from GSC into
  `GOOGLE_SITE_VERIFICATION` in `apps/web/.env.local`. The root layout reads
  it conditionally and emits the meta tag at build/request time.
- **Submit sitemap**: after first deploy, submit
  `https://synergybusiness.ae/sitemap.xml` in GSC.
- **GA4** (not yet wired): add via `@next/third-parties/google` when ready.

---

## 6. Environment variables

```
NEXT_PUBLIC_APP_URL=https://synergybusiness.ae
GOOGLE_SITE_VERIFICATION=                # optional — paste the GSC meta content here
```

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
