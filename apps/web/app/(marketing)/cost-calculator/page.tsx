import type { Metadata } from "next";
import {
  CalculatorIntro,
  CalculatorWizard,
} from "@/components/calculator/CalculatorWizard";
import { getPageContent } from "@/lib/site-content";
import { breadcrumbLd } from "@/lib/jsonld";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "UAE Business Setup Cost Calculator",
  description:
    "Estimate your UAE business setup cost in 60 seconds — government fees, Synergy service fees and ongoing costs, itemised across 13 free zones.",
  alternates: { canonical: "/cost-calculator" },
};

export const revalidate = 60;

const calculatorLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UAE Business Setup Cost Calculator",
  description:
    "Free 5-step estimator that compares 13 UAE free zones and itemises government fees, Synergy service fees and yearly renewal costs in AED.",
  url: `${siteUrl}/cost-calculator`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "AED",
  },
  publisher: {
    "@type": "Organization",
    name: "Synergy Business",
    url: siteUrl,
  },
};

const breadcrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Cost Calculator", path: "/cost-calculator" },
]);

export default async function Page() {
  const content = await getPageContent("cost-calculator");
  return (
    <>
      <CalculatorIntro content={content} />
      <CalculatorWizard />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
    </>
  );
}
