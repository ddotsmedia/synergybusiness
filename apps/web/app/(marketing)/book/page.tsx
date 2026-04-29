import { buildMetadata } from "@/lib/seo";
import { BookAppointmentPage } from "@/components/marketing/BookAppointmentPage";
import { getPageContent } from "@/lib/site-content";
import { breadcrumbLd } from "@/lib/jsonld";
import { siteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Book an Appointment",
  description:
    "Schedule a free 30-minute consultation with a Synergy Business setup specialist across all 7 UAE emirates — Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah — or by video call.",
  path: "/book",
});

export const revalidate = 60;

const consultationLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Free Business Setup Consultation",
  description:
    "30-minute consultation with a Synergy Business setup specialist. We map out the right licence, free zone, visa quota, and approximate cost for your UAE business.",
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
  url: `${siteUrl}/book`,
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "AED",
    availability: "https://schema.org/InStock",
  },
};

const breadcrumbsLd = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "Book an Appointment", path: "/book" },
]);

export default async function Page() {
  const content = await getPageContent("book");
  return (
    <>
      <BookAppointmentPage content={content} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(consultationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
    </>
  );
}
