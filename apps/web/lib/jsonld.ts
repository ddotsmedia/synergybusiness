import { siteUrl, contactEmails, phoneNumbers } from "@/lib/site";

export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Synergy Business",
  url: siteUrl,
  email: contactEmails.general,
  telephone: phoneNumbers.abuDhabi,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abu Dhabi",
    addressCountry: "AE",
  },
  areaServed: ["AE"],
  priceRange: "AED",
} as const;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Synergy Business",
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image`,
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: phoneNumbers.abuDhabi,
      contactType: "customer service",
      areaServed: "AE",
      availableLanguage: ["English", "Arabic"],
    },
  ],
} as const;

export function serviceLd(input: {
  name: string;
  description: string;
  slug: string;
  startingPrice?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: { "@type": "LocalBusiness", name: "Synergy Business" },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    url: `${siteUrl}/services/${input.slug}`,
    ...(input.startingPrice
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "AED",
            price: input.startingPrice,
          },
        }
      : {}),
  };
}

export function faqLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${c.path.startsWith("/") ? c.path : `/${c.path}`}`,
    })),
  };
}

export function articleLd(input: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string | Date;
  updatedAt?: string | Date;
  author?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: `${siteUrl}/blog/${input.slug}`,
    datePublished: new Date(input.publishedAt).toISOString(),
    dateModified: new Date(input.updatedAt ?? input.publishedAt).toISOString(),
    author: { "@type": "Organization", name: input.author ?? "Synergy Business" },
    publisher: { "@type": "Organization", name: "Synergy Business" },
    ...(input.image ? { image: input.image } : {}),
  };
}
