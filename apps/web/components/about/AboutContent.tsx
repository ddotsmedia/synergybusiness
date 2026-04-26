"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building2,
  HandshakeIcon,
  Heart,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { Content } from "@/lib/site-content";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "1,800+", label: "Companies launched since 2014" },
  { value: "30+", label: "UAE free zones we operate in" },
  { value: "4.9★", label: "Average client rating" },
  { value: "<1hr", label: "Average first-response time" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Transparent pricing",
    body:
      "Government fees, our service fees and ongoing costs — all itemised upfront. No surprise renewals, ever.",
  },
  {
    icon: Target,
    title: "Right-fit advice",
    body:
      "We don't push the most expensive package. We recommend the structure that matches your real-world business model — even if that means walking away from a sale.",
  },
  {
    icon: HandshakeIcon,
    title: "Founder-friendly",
    body:
      "Most of our clients are first-time UAE entrepreneurs. We translate jargon, escalate gracefully and protect your time.",
  },
  {
    icon: Heart,
    title: "Long-term relationship",
    body:
      "80% of our work is with returning clients — additional licences, family visas, Golden Visas. We're built for the next 10 years, not the first invoice.",
  },
];

const TIMELINE = [
  {
    year: "2014",
    title: "Founded in Abu Dhabi",
    body: "Started as a 3-person PRO services team supporting Mainland LLC formations on Hamdan Street.",
  },
  {
    year: "2018",
    title: "Free zone partnerships",
    body: "Became registered agents with ADGM, KIZAD, twofour54 and Masdar City.",
  },
  {
    year: "2021",
    title: "100% foreign ownership",
    body: "Helped 400+ existing clients restructure to 100% foreign ownership under the new Commercial Companies Law.",
  },
  {
    year: "2023",
    title: "Golden Visa specialist",
    body: "Built a dedicated Golden Visa team after successfully nominating clients across all 7 eligibility tracks.",
  },
  {
    year: "2025",
    title: "AI-powered intake",
    body: "Launched our AI assistant and cost calculator — same expert team, faster onboarding.",
  },
];

function s(content: Content, key: string, fallback: string): string {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

export function AboutContent({ content = {} }: { content?: Content }) {
  const heroEyebrow = s(content, "hero.eyebrow", "About Synergy Business");
  const heroTitleMain = s(content, "hero.titleMain", "Abu Dhabi's");
  const heroTitleHighlight = s(content, "hero.titleHighlight", "trusted");
  const heroTitleAfter = s(
    content,
    "hero.titleAfter",
    "business setup partner since 2014.",
  );
  const heroDescription = s(
    content,
    "hero.description",
    "We're a licensed Abu Dhabi consultancy that has helped over 1,800 founders incorporate, hire, bank and obtain residence in the UAE. Our north star is simple: protect your time and your capital — and tell you the truth, even when it's inconvenient.",
  );

  const missionEyebrow = s(content, "mission.eyebrow", "Our mission");
  const missionHeadline = s(
    content,
    "mission.headline",
    "Make UAE business setup feel obvious — not overwhelming.",
  );
  const missionP1 = s(
    content,
    "mission.paragraph1",
    "The UAE rewards founders who move fast — but the regulatory landscape rewards patience and precision. Our job is to take the second part off your plate so you can focus on the first.",
  );
  const missionP2 = s(
    content,
    "mission.paragraph2",
    "Synergy was founded in 2014 by a team of UAE-licensed PROs and ex-Big-4 consultants who were tired of seeing first-time founders steered into the wrong free zone, the wrong visa class, or the wrong bank — usually because their advisor optimised for commission rather than fit.",
  );
  const missionP3 = s(
    content,
    "mission.paragraph3",
    "A decade later, we're still founder-led, still Abu-Dhabi-based, and still measured by one metric: would our clients refer us? About 80% of our revenue comes from existing clients and their referrals — that's the answer we trust most.",
  );

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-pattern text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
              {heroEyebrow}
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              {heroTitleMain}{" "}
              <span className="text-gold-gradient">{heroTitleHighlight}</span>{" "}
              {heroTitleAfter}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
              {heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#0a2540] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="border border-white/10 rounded-xl py-4 px-2"
              >
                <dt className="font-display text-2xl sm:text-3xl text-[#e8c96b]">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-white/60">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
              {missionEyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
              {missionHeadline}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-5 text-[#1a2b3c] text-base leading-relaxed"
          >
            <p>{missionP1}</p>
            <p>{missionP2}</p>
            <p>{missionP3}</p>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 sm:py-24 bg-[#f8f9fc] border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
              How we work
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
              Four things you can count on us for
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl bg-white border border-border p-7 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-[#0a2540]/5 text-[#0a2540] flex items-center justify-center">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl text-[#0a2540]">
                  {v.title}
                </h3>
                <p className="mt-2 text-[#6b7e96] leading-relaxed">
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
              Our journey
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
              A decade of UAE business setup
            </h2>
          </motion.div>

          <ol className="mt-12 relative border-l-2 border-[#c9a84c]/30 ml-3 space-y-10">
            {TIMELINE.map((t, i) => (
              <motion.li
                key={t.year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="pl-8 relative"
              >
                <span className="absolute -left-[14px] top-0 h-7 w-7 rounded-full bg-[#0a2540] text-[#c9a84c] text-xs font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
                <div className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
                  {t.year}
                </div>
                <h3 className="mt-1 font-display text-xl text-[#0a2540]">
                  {t.title}
                </h3>
                <p className="mt-2 text-[#6b7e96] leading-relaxed">
                  {t.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* LICENCE */}
      <section className="py-16 bg-[#f8f9fc] border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-white border border-border p-7 sm:p-9 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-start"
          >
            <div className="h-14 w-14 rounded-xl bg-[#0a2540] text-[#c9a84c] flex items-center justify-center">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-xl text-[#0a2540]">
                Licensed and accountable
              </h3>
              <p className="mt-2 text-sm text-[#6b7e96] leading-relaxed">
                Synergy Business Consultancy LLC is licensed by the Abu Dhabi
                Department of Economic Development (ADDED) and registered as
                an authorised agent with ADGM, ADAFZ, KIZAD, twofour54, Masdar
                City, RAKEZ, JAFZA and DMCC. We are bound by UAE Federal
                AML/CFT regulations and operate a documented client KYC
                process for every engagement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] via-[#b6962f] to-[#0a2540]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-display text-3xl sm:text-4xl">
            Let&apos;s build the next decade together.
          </h2>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            Tell us about your business — we&apos;ll come back within an hour
            with a structured recommendation and an itemised quote.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              render={<a href="/contact" />}
              size="lg"
              className="bg-[#0a2540] hover:bg-[#071a2e] text-white h-12 px-7"
            >
              Get in touch
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              render={<Link href="/free-zones" />}
              size="lg"
              variant="outline"
              className="h-12 px-7 border-white/40 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              Compare free zones
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
