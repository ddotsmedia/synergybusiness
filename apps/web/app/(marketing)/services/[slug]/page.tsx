import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { getPublicService } from "@/lib/admin/entities";
import {
  SERVICE_SLUGS,
  type ServiceSlug,
} from "@/lib/services-data";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { breadcrumbLd } from "@/lib/jsonld";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

// Allow new admin-created services (with new slugs) to render on first hit.
export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) return {};

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      url: `/services/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: service.seo.title,
      description: service.seo.description,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = await getPublicService(slug);

  if (!service) notFound();

  const slugTyped = slug as ServiceSlug;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.hero.eyebrow,
    name: service.seo.title,
    description: service.seo.description,
    provider: {
      "@type": "ProfessionalService",
      name: "Synergy Business",
      url: siteUrl,
    },
    areaServed: [
      "Abu Dhabi",
      "Dubai",
      "Sharjah",
      "Ajman",
      "Umm Al Quwain",
      "Ras Al Khaimah",
      "Fujairah",
      "United Arab Emirates",
    ],
    url: absoluteUrl(`/services/${slugTyped}`),
    ...(service.hero.startingPrice && {
      offers: {
        "@type": "Offer",
        priceCurrency: "AED",
        price: service.hero.startingPrice,
      },
    }),
  };

  const breadcrumbsLd = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/#services" },
    { name: service.hero.title, path: `/services/${slugTyped}` },
  ]);

  return (
    <>
      <ServiceDetail service={service} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
    </>
  );
}
