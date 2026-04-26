import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FreeZones } from "@/components/marketing/FreeZones";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CalculatorTeaser } from "@/components/marketing/CalculatorTeaser";
import { FAQ } from "@/components/marketing/FAQ";
import { ContactCTA } from "@/components/marketing/ContactCTA";
import { FAQS } from "@/lib/faqs";

export default function Home() {
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
      <Hero />
      <Services />
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
