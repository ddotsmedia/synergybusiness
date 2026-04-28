"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Globe2,
  FileCheck2,
  Plane,
  Crown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
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
      "DED / ADDED trade licences with 100% foreign ownership across all 7 emirates — Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah.",
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

const AUTOPLAY_MS = 6000;

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

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const scrollToIndex = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[idx] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, []);

  const next = useCallback(() => {
    const total = SERVICES.length;
    const target = (activeIndex + 1) % total;
    scrollToIndex(target);
  }, [activeIndex, scrollToIndex]);

  const prev = useCallback(() => {
    const total = SERVICES.length;
    const target = (activeIndex - 1 + total) % total;
    scrollToIndex(target);
  }, [activeIndex, scrollToIndex]);

  // Active-card tracking via IntersectionObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = activeIndex;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = cards.indexOf(entry.target as HTMLElement);
          }
        }
        if (bestRatio > 0) setActiveIndex(bestIdx);
      },
      { root: track, threshold: [0.5, 0.75, 1] },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance with progress bar
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      setProgress(pct);
      if (elapsed >= AUTOPLAY_MS) {
        next();
      }
    }, 50);
    return () => window.clearInterval(tick);
  }, [paused, activeIndex, next]);

  // Keyboard arrow navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      // Only trigger when the slider is in view
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#fbf8f0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
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
            <p className="mt-5 text-[#6b7e96] leading-[1.7]">{description}</p>
          </motion.div>

          {/* Slider controls + slide counter */}
          <div className="flex items-end gap-5 self-start lg:self-end">
            <div className="hidden sm:block">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#6b7e96] font-semibold">
                Slide
              </div>
              <div className="mt-1 font-display text-2xl text-[#0a2540] tabular-nums">
                <span className="text-[#c9a84c]">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-[#0a2540]/30 mx-1">/</span>
                <span>{String(SERVICES.length).padStart(2, "0")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CarouselButton onClick={prev} label="Previous service">
                <ChevronLeft className="h-5 w-5" />
              </CarouselButton>
              <CarouselButton onClick={next} label="Next service" primary>
                <ChevronRight className="h-5 w-5" />
              </CarouselButton>
            </div>
          </div>
        </div>

        {/* Slider track with edge fade masks */}
        <div
          className="mt-14 -mx-4 sm:-mx-6 lg:-mx-8 relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          style={{
            // Soft fade-out at horizontal edges so partial cards look intentional
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)",
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 px-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            aria-roledescription="carousel"
            aria-label="Synergy Business services"
          >
            {SERVICES.map((service, idx) => {
              const isActive = idx === activeIndex;
              return (
                <motion.a
                  key={service.title}
                  href={service.href}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${SERVICES.length}: ${service.title}`}
                  className={
                    "group relative shrink-0 snap-start basis-[85%] sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)] " +
                    "bg-white p-7 sm:p-8 rounded-2xl border " +
                    "transition-[transform,box-shadow,border-color,background-color,color] duration-500 ease-out " +
                    "hover:bg-[#0a2540] hover:text-white hover:border-[#0a2540] " +
                    (isActive
                      ? "scale-[1.015] border-[#c9a84c]/50 shadow-[0_18px_50px_-10px_rgba(10,37,64,0.25)]"
                      : "border-[#0a2540]/10 opacity-90 hover:opacity-100")
                  }
                >
                  {/* Top row: number + arrow */}
                  <div className="flex items-start justify-between mb-8">
                    <span
                      className={
                        "font-display text-sm tracking-[0.2em] transition-colors " +
                        (isActive
                          ? "text-[#c9a84c]"
                          : "text-[#c9a84c]/70 group-hover:text-[#e8c96b]")
                      }
                      aria-hidden
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-[#94a8c0] group-hover:text-[#c9a84c] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {/* Icon tile */}
                  <div className="h-11 w-11 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center group-hover:bg-[#c9a84c] group-hover:text-[#0a2540] transition-colors duration-300">
                    <service.icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 font-display text-xl sm:text-[1.4rem] text-[#0a2540] group-hover:text-white tracking-[-0.01em] leading-tight">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#6b7e96] group-hover:text-white/70 leading-relaxed">
                    {service.description}
                  </p>

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

                  {/* Subtle gold glow on active */}
                  {isActive && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-7 sm:inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-70"
                    />
                  )}
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Autoplay progress bar */}
        <div className="mt-10 max-w-md mx-auto">
          <div className="h-px bg-[#0a2540]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8c96b] transition-[width] duration-75 ease-linear"
              style={{ width: `${paused ? 0 : progress}%` }}
            />
          </div>
        </div>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {SERVICES.map((s, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={active}
                className={
                  "rounded-full transition-all duration-300 " +
                  (active
                    ? "h-1.5 w-10 bg-gradient-to-r from-[#c9a84c] to-[#e8c96b]"
                    : "h-1.5 w-1.5 bg-[#0a2540]/15 hover:bg-[#0a2540]/35")
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  children,
  onClick,
  label,
  primary = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={
        "h-12 w-12 rounded-full border flex items-center justify-center transition-all duration-300 " +
        "shadow-sm hover:shadow-md hover:-translate-y-0.5 " +
        (primary
          ? "bg-[#0a2540] text-white border-[#0a2540] hover:bg-[#c9a84c] hover:text-[#0a2540] hover:border-[#c9a84c]"
          : "bg-white text-[#0a2540] border-[#0a2540]/15 hover:bg-[#0a2540] hover:text-white hover:border-[#0a2540]")
      }
    >
      {children}
    </button>
  );
}
