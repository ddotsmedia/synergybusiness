"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Globe2,
  FileCheck2,
  Plane,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import type { Content } from "@/lib/site-content";

function s(content: Content, key: string, fallback: string): string {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

type Service = {
  icon: typeof Building2;
  title: string;
  description: string;
  highlights: string[];
  href: string;
  startingFromAed?: number;
};

const SERVICES: Service[] = [
  {
    icon: Building2,
    title: "Mainland Setup",
    description:
      "DED / ADDED trade licences with 100% foreign ownership across Abu Dhabi, Dubai and the Northern Emirates.",
    highlights: ["100% ownership", "All UAE markets", "Bank account assist"],
    href: "/services/mainland",
    startingFromAed: 12500,
  },
  {
    icon: MapPin,
    title: "Free Zone Formation",
    description:
      "Choose from ADGM, KIZAD, twofour54, Masdar City, RAKEZ and others — we match the right zone to your business.",
    highlights: ["0% tax options", "Visa quotas", "Flexi-desk available"],
    href: "/services/free-zone",
    startingFromAed: 5750,
  },
  {
    icon: Globe2,
    title: "Offshore Companies",
    description:
      "RAK ICC and JAFZA Offshore structures for international holding, asset protection, and global trading.",
    highlights: ["Holding structures", "No physical office", "Quick turnaround"],
    href: "/services/offshore",
    startingFromAed: 9000,
  },
  {
    icon: FileCheck2,
    title: "PRO Services",
    description:
      "Government liaison, document attestation, MOFA, MOHRE and immigration approvals handled end-to-end.",
    highlights: ["Same-day typing", "Attestation", "Renewals & amendments"],
    href: "/services/pro-services",
  },
  {
    icon: Plane,
    title: "UAE Visa Services",
    description:
      "Employment, family, investor and visit visas — including medical, Emirates ID and stamping support.",
    highlights: ["2-year & 3-year", "Family sponsorship", "Status change"],
    href: "/services/visa",
  },
  {
    icon: Crown,
    title: "Golden Visa",
    description:
      "10-year UAE Golden Visa for investors, entrepreneurs, specialised talent and exceptional students.",
    highlights: ["10-year residency", "Eligibility check", "Family included"],
    href: "/services/golden-visa",
  },
];

export function Services({ content = {} }: { content?: Content }) {
  const eyebrow = s(content, "services.eyebrow", "What we do");
  const title = s(
    content,
    "services.title",
    "Every service you need to launch and operate in the UAE",
  );
  const description = s(
    content,
    "services.description",
    "From your first trade licence to your Golden Visa — Synergy Business is your single point of contact across the Emirates.",
  );

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#f8f9fc]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
            {title}
          </h2>
          <p className="mt-4 text-[#6b7e96] leading-relaxed">
            {description}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, idx) => (
            <motion.a
              key={service.title}
              href={service.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="group relative rounded-2xl bg-white border border-border p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0a2540]/5 overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c96b] group-hover:w-full transition-all duration-500" />

              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-[#0a2540]/5 text-[#0a2540] flex items-center justify-center group-hover:bg-[#0a2540] group-hover:text-[#c9a84c] transition-colors">
                  <service.icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#6b7e96] group-hover:text-[#c9a84c] transition-colors" />
              </div>

              <h3 className="mt-5 font-display text-xl text-[#0a2540]">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-[#6b7e96] leading-relaxed">
                {service.description}
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {service.highlights.map((h) => (
                  <li
                    key={h}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#f8f9fc] text-[#1a2b3c] border border-border"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              {service.startingFromAed && (
                <p className="mt-5 text-sm text-[#6b7e96]">
                  Starting from{" "}
                  <span className="font-semibold text-[#0a2540]">
                    AED {service.startingFromAed.toLocaleString()}
                  </span>
                </p>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
