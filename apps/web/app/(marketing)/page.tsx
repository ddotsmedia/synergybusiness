import { Hero } from "@/components/marketing/Hero";
import { AuthorityStrip } from "@/components/marketing/AuthorityStrip";
import { Services } from "@/components/marketing/Services";
import { AnimatedStats } from "@/components/marketing/AnimatedStats";
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
  // Home page content + contact content. The home contact strip reuses
  // the same fields edited on /admin/content/contact so admins only
  // maintain phone/email in one place.
  const [content, contactContent] = await Promise.all([
    getPageContent("home"),
    getPageContent("contact"),
  ]);

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
      <AuthorityStrip />
      <Services content={content} />
      <AnimatedStats />
      <HowItWorks />
      <FreeZones />
      <Testimonials />
      <CalculatorTeaser />
      <FAQ />
      <ContactCTA content={contactContent} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
