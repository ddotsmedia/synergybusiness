"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, HandshakeIcon, ShieldCheck, Target } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Transparent pricing",
    body: "Government, free-zone and Synergy fees itemised before you commit. No surprise renewals.",
  },
  {
    icon: Target,
    title: "Right-fit advice",
    body: "We recommend the structure that matches your business model — even if that means walking away from a sale.",
  },
  {
    icon: HandshakeIcon,
    title: "Long-term partner",
    body: "80% of our work is with returning clients — additional licences, family visas, Golden Visas.",
  },
];

export function AboutUsSection() {
  return (
    <section className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: heading + copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="block h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]"
              />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a84c] font-semibold">
                About us
              </span>
            </div>

            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0a2540] tracking-[-0.01em] leading-[1.15]">
              Abu Dhabi&apos;s{" "}
              <span className="text-[#c9a84c]">trusted</span> business setup
              partner since 2014.
            </h2>

            <p className="mt-6 text-[#1a2b3c] leading-[1.7]">
              Synergy is a licensed Abu Dhabi consultancy — founded in 2014 by
              UAE-licensed PROs and ex-Big-4 consultants. We&apos;ve helped
              over 1,800 founders incorporate, hire, bank and obtain residence
              in the UAE.
            </p>
            <p className="mt-4 text-[#1a2b3c] leading-[1.7]">
              Our north star is simple: protect your time and your capital,
              and tell you the truth — even when it&apos;s inconvenient.
            </p>

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a2540] hover:text-[#c9a84c] group"
              >
                <span className="border-b border-[#0a2540] group-hover:border-[#c9a84c] pb-0.5">
                  Read our full story
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right: pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <ul className="space-y-px bg-[#0a2540]/8 border border-[#0a2540]/8 rounded-2xl overflow-hidden">
              {PILLARS.map((pillar, i) => (
                <motion.li
                  key={pillar.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white px-7 py-7 sm:px-8 sm:py-8 flex items-start gap-5"
                >
                  <span
                    className="flex-shrink-0 h-11 w-11 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center"
                    aria-hidden
                  >
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg sm:text-xl text-[#0a2540] tracking-[-0.005em]">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#6b7e96] leading-relaxed">
                      {pillar.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
