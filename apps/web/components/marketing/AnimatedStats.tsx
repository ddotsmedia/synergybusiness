"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

type Stat = {
  value: number;
  /** Suffix shown after the animated number, e.g. "+", "yr", "%". */
  suffix?: string;
  /** Prefix shown before the number, e.g. "<" for "<1 hr". */
  prefix?: string;
  /** Decimal places, default 0. */
  decimals?: number;
  label: string;
  caption: string;
};

const STATS: Stat[] = [
  {
    value: 1800,
    suffix: "+",
    label: "companies launched",
    caption: "Mainland, free zone, and offshore — across all 7 emirates.",
  },
  {
    value: 11,
    suffix: " yrs",
    label: "in business",
    caption: "Founded in Abu Dhabi in 2014 and still founder-led.",
  },
  {
    value: 30,
    suffix: "+",
    label: "free zones we work in",
    caption: "ADGM, KIZAD, twofour54, RAKEZ, DMCC, JAFZA and more.",
  },
  {
    value: 1,
    prefix: "<",
    suffix: " hr",
    label: "first response",
    caption: "Average reply time on weekdays. WhatsApp is faster still.",
  },
];

export function AnimatedStats() {
  return (
    <section
      aria-label="Synergy in numbers"
      className="relative bg-[#0a2540] text-white overflow-hidden"
    >
      {/* ambient gold blooms */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[40rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-[#c9a84c]/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="block h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]"
            />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a84c] font-semibold">
              By the numbers
            </span>
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-[2.75rem] tracking-[-0.01em] leading-[1.1]">
            A decade of UAE business setup,{" "}
            <span className="text-gold-gradient">in numbers</span>.
          </h2>
        </div>

        <dl className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 lg:gap-x-10">
          {STATS.map((stat, idx) => (
            <StatItem key={stat.label} stat={stat} delay={idx * 0.08} />
          ))}
        </dl>
      </div>
    </section>
  );
}

function StatItem({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState("0");

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: 1.4,
    bounce: 0,
  });

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => motionValue.set(stat.value), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [inView, motionValue, stat.value, delay]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      const decimals = stat.decimals ?? 0;
      setDisplay(
        latest.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }),
      );
    });
  }, [spring, stat.decimals]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      {/* gold rule above number */}
      <span aria-hidden className="block h-px w-12 bg-[#c9a84c] mb-5" />
      <dt className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-none tracking-[-0.02em] tabular-nums">
        {stat.prefix}
        {display}
        {stat.suffix}
      </dt>
      <dd className="mt-3 max-w-xs">
        <p className="text-sm font-semibold text-[#e8c96b] uppercase tracking-[0.1em]">
          {stat.label}
        </p>
        <p className="mt-1.5 text-sm text-white/65 leading-relaxed">
          {stat.caption}
        </p>
      </dd>
    </motion.div>
  );
}
