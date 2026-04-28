import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { getPageContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact Synergy Business",
  description:
    "Speak to a Synergy Business consultant across all 7 UAE emirates — Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah. WhatsApp, phone, email or in-person — we reply within one business hour.",
  alternates: { canonical: "/contact" },
};

export const revalidate = 60;

export default async function Page() {
  const content = await getPageContent("contact");
  return <ContactPage content={content} />;
}
