"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Content } from "@/lib/site-content";

function s(content: Content, key: string, fallback: string): string {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: "DED & ADGM Authorised",
    sub: "Licensed consultancy",
  },
  {
    icon: Clock,
    title: "5-Day Setup",
    sub: "Average free zone turnaround",
  },
  {
    icon: Users,
    title: "1,800+ Companies",
    sub: "Established since 2014",
  },
  {
    icon: Award,
    title: "AED 0 Hidden Fees",
    sub: "Transparent pricing always",
  },
];

export function Hero({ content = {} }: { content?: Content }) {
  const eyebrow = s(content, "hero.eyebrow", "Abu Dhabi · Dubai · Sharjah · RAK");
  const titleMain = s(content, "hero.titleMain", "Set up your UAE business with");
  const titleHighlight = s(content, "hero.titleHighlight", "Synergy");
  const titleSubtitle = s(content, "hero.titleSubtitle", "Fast, simple, and trusted.");
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
    <section className="relative overflow-hidden bg-navy-pattern text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
            {eyebrow}
          </span>

          <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            {titleMain}{" "}
            <span className="text-gold-gradient">{titleHighlight}</span>.
            <br />
            <span className="text-white/85">{titleSubtitle}</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
            {description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              render={<a href={cta1Href} />}
              size="lg"
              className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold h-12 px-7"
            >
              {cta1Label}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              render={<a href={cta2Href} />}
              size="lg"
              variant="outline"
              className="h-12 px-7 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              {cta2Label}
            </Button>
          </div>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {TRUST_BADGES.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4 sm:px-5 sm:py-5"
            >
              <b.icon className="h-5 w-5 text-[#e8c96b]" />
              <dt className="mt-3 font-display text-base sm:text-lg text-white">
                {b.title}
              </dt>
              <dd className="mt-1 text-xs sm:text-sm text-white/65">
                {b.sub}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
