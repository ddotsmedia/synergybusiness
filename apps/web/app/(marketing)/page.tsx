import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FreeZones } from "@/components/marketing/FreeZones";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CalculatorTeaser } from "@/components/marketing/CalculatorTeaser";
import { FAQ } from "@/components/marketing/FAQ";
import { ContactCTA } from "@/components/marketing/ContactCTA";
import { FAQS } from "@/lib/faqs";
import { getPageContent } from "@/lib/site-content";

// Pull DB-backed content overrides at request time so admin edits land
// on the live page within seconds of saving.
export const revalidate = 60;

export default async function Home() {
  const content = await getPageContent("home");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <>
      <Hero content={content} />
      <Services content={content} />
      <HowItWorks />
      <FreeZones />
      <Testimonials />
      <CalculatorTeaser />
      <FAQ />
      <ContactCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
