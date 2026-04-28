import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteUrl } from "@/lib/site";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Synergy Business",
    description:
      "Business setup consultancy in Abu Dhabi, UAE. Mainland, free zone, offshore, PRO services, visas and Golden Visa.",
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 24, Al Maryah Tower, Al Maryah Island",
      addressLocality: "Abu Dhabi",
      addressCountry: "AE",
    },
    areaServed: [
      "Abu Dhabi",
      "Dubai",
      "Sharjah",
      "Ajman",
      "Umm Al Quwain",
      "Ras Al Khaimah",
      "Fujairah",
      "UAE",
    ],
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
    </div>
  );
}
