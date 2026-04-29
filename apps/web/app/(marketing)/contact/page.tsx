import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { getPageContent } from "@/lib/site-content";
import { localBusinessLd, breadcrumbLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Contact Synergy Business",
  description:
    "Speak to a Synergy Business consultant across all 7 UAE emirates — Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah. WhatsApp, phone, email or in-person — we reply within one business hour.",
  alternates: { canonical: "/contact" },
};

export const revalidate = 60;

const breadcrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
]);

export default async function Page() {
  const content = await getPageContent("contact");
  return (
    <>
      <ContactPage content={content} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
    </>
  );
}
