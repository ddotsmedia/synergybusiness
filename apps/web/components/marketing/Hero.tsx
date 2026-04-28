"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Content } from "@/lib/site-content";

function s(content: Content, key: string, fallback: string): string {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

export function Hero({ content = {} }: { content?: Content }) {
  const eyebrow = s(
    content,
    "hero.eyebrow",
    "Abu Dhabi · Dubai · Sharjah · RAK",
  );
  const titleMain = s(
    content,
    "hero.titleMain",
    "Set up your UAE business with",
  );
  const titleHighlight = s(content, "hero.titleHighlight", "Synergy");
  const titleSubtitle = s(
    content,
    "hero.titleSubtitle",
    "Fast, simple, and trusted.",
  );
  const description = s(
    content,
    "hero.description",
    "From mainland trade licenses and free-zone formation to PRO services, employment visas, and the UAE Golden Visa — Synergy Business handles every step from Abu Dhabi.",
  );
  const cta1Label = s(content, "hero.cta1Label", "Start your setup");
  const cta1Href = s(content, "hero.cta1Href", "#contact");
  const cta2Label = s(content, "hero.cta2Label", "Estimate my cost");
  const cta2Href = s(content, "hero.cta2Href", "#calculator");

  return (
    <section className="relative overflow-hidden bg-[#0a2540] text-white">
      {/* layered ambient gradients for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/12 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[34rem] w-[34rem] rounded-full bg-[#c9a84c]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,201,107,0.06),transparent_50%)]" />
      </div>

      {/* fine grid overlay for editorial texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* gold rule + eyebrow */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="block h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]"
            />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a84c] font-semibold">
              {eyebrow}
            </span>
          </div>

          <h1 className="mt-7 font-display text-4xl sm:text-5xl lg:text-[4.25rem] leading-[1.02] tracking-[-0.02em]">
            {titleMain}{" "}
            <span className="text-gold-gradient">{titleHighlight}</span>.
            <span className="block mt-2 text-white/85 font-display">
              {titleSubtitle}
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-white/75 max-w-2xl leading-[1.7]">
            {description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button
              render={<a href={cta1Href} />}
              size="lg"
              className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold h-12 px-7 shadow-[0_8px_30px_rgba(201,168,76,0.25)] hover:shadow-[0_12px_40px_rgba(201,168,76,0.35)] transition-shadow"
            >
              {cta1Label}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              render={<a href={cta2Href} />}
              size="lg"
              variant="outline"
              className="h-12 px-7 border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur"
            >
              {cta2Label}
            </Button>
          </div>

          {/* fine credential line */}
          <div className="mt-12 flex items-center gap-4 text-xs text-white/55">
            <span aria-hidden className="block h-px w-8 bg-white/20" />
            <span className="uppercase tracking-[0.18em]">
              Licensed Abu Dhabi consultancy · Est. 2014
            </span>
          </div>
        </motion.div>
      </div>

      {/* soft transition into next section */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-[#fbf8f0]/30 pointer-events-none" />
    </section>
  );
}
