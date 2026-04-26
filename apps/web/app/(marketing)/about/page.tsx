import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About Synergy Business",
  description:
    "Synergy Business is a licensed Abu Dhabi business setup consultancy. Meet the team that has helped 1,800+ founders incorporate, hire and bank in the UAE.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
