"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FREE_ZONES } from "@/lib/free-zones-data";

const HOME_ZONE_IDS = [
  "adgm",
  "kizad",
  "twofour54",
  "masdar",
  "adafz",
  "rakez",
] as const;

export function FreeZones() {
  const featured = HOME_ZONE_IDS.map(
    (id) => FREE_ZONES.find((z) => z.id === id)!,
  ).filter(Boolean);

  return (
    <section
      id="free-zones"
      className="py-20 sm:py-28 bg-[#0a2540] text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-32 right-1/3 h-80 w-80 rounded-full bg-[#c9a84c]/15 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-80 w-80 rounded-full bg-[#c9a84c]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
              UAE Free Zones
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white">
              We work with every major Abu Dhabi & UAE free zone
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Each zone is tuned to a specific industry. Tell us what you&apos;re
              building — we&apos;ll match you to the zone with the best cost,
              credibility and visa quota for the job.
            </p>
          </div>
          <Link
            href="/free-zones"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8c96b] hover:text-[#c9a84c] whitespace-nowrap"
          >
            Compare all {FREE_ZONES.length} zones
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {featured.map((z, i) => (
            <motion.div
              key={z.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/free-zones#${z.id}`}
                className="block rounded-xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:border-[#c9a84c]/40 hover:bg-white/[0.07] transition-all h-full"
              >
                <div className="font-display text-2xl text-[#c9a84c]">
                  {z.short}
                </div>
                <div className="mt-1 text-sm font-medium text-white">
                  {z.name}
                </div>
                <p className="mt-2 text-xs text-white/65 leading-relaxed">
                  {z.industries.slice(0, 3).join(" · ")}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
