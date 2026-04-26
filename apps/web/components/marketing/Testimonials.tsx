"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Synergy got our ADGM tech licence and corporate bank account live in under three weeks. They handled every approval and translation while we kept building.",
    name: "Layla Al Mansouri",
    role: "Founder, Halo Analytics",
    rating: 5,
  },
  {
    quote:
      "We moved our holding structure from RAK ICC to ADGM with zero downtime. The PRO team is responsive on WhatsApp at all hours — exactly what an SME needs.",
    name: "Ravi Sundaram",
    role: "Managing Director, Crestline FZE",
    rating: 5,
  },
  {
    quote:
      "I qualified for the Golden Visa under the investor track. Synergy did the eligibility assessment, NOCs, medical scheduling and Emirates ID end-to-end.",
    name: "Mariam Khoury",
    role: "Co-Founder, Levant Capital",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-[#f8f9fc]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
            Trusted by founders
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
            Stories from people we&apos;ve helped launch
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <Quote className="h-7 w-7 text-[#c9a84c]/60" />
              <div
                className="mt-3 flex gap-0.5"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-[#c9a84c] text-[#c9a84c]"
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-[#1a2b3c]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border">
                <div className="font-display text-base text-[#0a2540]">
                  {t.name}
                </div>
                <div className="text-xs text-[#6b7e96]">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
