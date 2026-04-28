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
    <section id="services" className="py-24 sm:py-32 bg-[#fbf8f0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="block h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]"
            />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a84c] font-semibold">
              {eyebrow}
            </span>
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0a2540] tracking-[-0.01em] leading-[1.15]">
            {title}
          </h2>
          <p className="mt-5 text-[#6b7e96] leading-[1.7]">
            {description}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0a2540]/8 border border-[#0a2540]/8 rounded-[1.5rem] overflow-hidden">
          {SERVICES.map((service, idx) => (
            <motion.a
              key={service.title}
              href={service.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="group relative bg-white p-7 sm:p-8 transition-colors duration-300 hover:bg-[#0a2540] hover:text-white"
            >
              {/* numbered prefix */}
              <div className="flex items-start justify-between mb-8">
                <span
                  className="font-display text-sm tracking-[0.2em] text-[#c9a84c] group-hover:text-[#e8c96b] transition-colors"
                  aria-hidden
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight className="h-5 w-5 text-[#94a8c0] group-hover:text-[#c9a84c] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div className="h-11 w-11 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center group-hover:bg-[#c9a84c] group-hover:text-[#0a2540] transition-colors duration-300">
                <service.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-6 font-display text-xl sm:text-[1.4rem] text-[#0a2540] group-hover:text-white tracking-[-0.01em] leading-tight">
                {service.title}
              </h3>
              <p className="mt-3 text-sm text-[#6b7e96] group-hover:text-white/70 leading-relaxed">
                {service.description}
              </p>

              {/* gold rule between description and highlights */}
              <span
                aria-hidden
                className="block h-px w-12 bg-[#c9a84c]/40 group-hover:bg-[#c9a84c] my-5 transition-colors"
              />

              <ul className="flex flex-wrap gap-1.5">
                {service.highlights.map((h) => (
                  <li
                    key={h}
                    className="text-[11px] px-2 py-0.5 rounded text-[#1a2b3c] group-hover:text-white/85 bg-transparent border border-[#0a2540]/10 group-hover:border-white/20 transition-colors"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              {service.startingFromAed && (
                <p className="mt-6 text-sm text-[#6b7e96] group-hover:text-white/70">
                  From{" "}
                  <span className="font-display text-[#0a2540] group-hover:text-[#e8c96b] transition-colors">
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
