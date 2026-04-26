import type { Metadata } from "next";
import { FreeZoneIndex } from "@/components/free-zones/FreeZoneIndex";
import { FREE_ZONES } from "@/lib/free-zones-data";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "UAE Free Zones — ADGM, KIZAD, twofour54, RAKEZ & more",
  description:
    "Compare every major UAE free zone — Abu Dhabi, Dubai, Sharjah, RAK and beyond. Cost, visa quota, foreign ownership and banking acceptance side-by-side.",
  alternates: { canonical: "/free-zones" },
};

export default function FreeZonesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: FREE_ZONES.map((z, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: z.name,
      url: absoluteUrl(`/free-zones#${z.id}`),
    })),
  };

  return (
    <>
      <FreeZoneIndex />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}
