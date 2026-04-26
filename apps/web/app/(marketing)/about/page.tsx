import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";
import { getPageContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About Synergy Business",
  description:
    "Synergy Business is a licensed Abu Dhabi business setup consultancy. Meet the team that has helped 1,800+ founders incorporate, hire and bank in the UAE.",
  alternates: { canonical: "/about" },
};

export const revalidate = 60;

export default async function AboutPage() {
  const content = await getPageContent("about");
  return <AboutContent content={content} />;
}
