"use client";

import { motion } from "framer-motion";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Short context that grounds the credibility — what was achieved. */
  outcome: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Synergy got our ADGM tech licence and corporate bank account live in under three weeks. They handled every approval and translation while we kept building.",
    name: "Layla Al Mansouri",
    role: "Founder",
    company: "Halo Analytics",
    outcome: "ADGM licence + Mashreq Neo account · 19 days",
  },
  {
    quote:
      "We moved our holding structure from RAK ICC to ADGM with zero downtime. The PRO team is responsive on WhatsApp at all hours — exactly what an SME needs.",
    name: "Ravi Sundaram",
    role: "Managing Director",
    company: "Crestline FZE",
    outcome: "Restructured to ADGM SPV · 6 weeks",
  },
  {
    quote:
      "I qualified for the Golden Visa under the investor track. Synergy did the eligibility assessment, NOCs, medical scheduling and Emirates ID end-to-end.",
    name: "Mariam Khoury",
    role: "Co-Founder",
    company: "Levant Capital",
    outcome: "10-year Golden Visa · approved in 31 days",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="block h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]"
            />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a84c] font-semibold">
              Founders we&apos;ve helped
            </span>
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-[#0a2540] tracking-[-0.01em] leading-[1.15]">
            Words from people who&apos;ve done it.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative bg-[#fbf8f0] border border-[#0a2540]/8 rounded-2xl p-8 lg:p-10 flex flex-col"
            >
              {/* Editorial typographic quote mark */}
              <span
                aria-hidden
                className="font-display text-7xl leading-none text-[#c9a84c]/40 select-none"
              >
                &ldquo;
              </span>

              <blockquote className="-mt-3 font-display text-lg lg:text-[1.25rem] text-[#0a2540] leading-[1.5] tracking-[-0.005em] flex-1">
                {t.quote}
              </blockquote>

              {/* outcome chip */}
              <div className="mt-6 inline-flex self-start items-center gap-2 rounded-full bg-white border border-[#c9a84c]/30 px-3 py-1 text-[11px] font-semibold text-[#0a2540]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
                {t.outcome}
              </div>

              {/* gold divider */}
              <span
                aria-hidden
                className="block h-px w-full bg-[#0a2540]/10 my-6"
              />

              <figcaption className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-10 w-10 rounded-full bg-[#0a2540] text-[#c9a84c] flex items-center justify-center font-display text-sm font-semibold"
                >
                  {t.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <p className="font-display text-sm text-[#0a2540] leading-tight">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#6b7e96] leading-tight mt-0.5">
                    {t.role} · {t.company}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
