import type { Metadata } from "next";
import {
  CalculatorIntro,
  CalculatorWizard,
} from "@/components/calculator/CalculatorWizard";

export const metadata: Metadata = {
  title: "UAE Business Setup Cost Calculator",
  description:
    "Estimate your UAE business setup cost in 60 seconds — government fees, Synergy service fees and ongoing costs, itemised across 13 free zones.",
  alternates: { canonical: "/cost-calculator" },
};

export default function Page() {
  return (
    <>
      <CalculatorIntro />
      <CalculatorWizard />
    </>
  );
}
