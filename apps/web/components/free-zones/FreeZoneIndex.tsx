"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  FREE_ZONE_CATEGORIES,
  FREE_ZONE_EMIRATES,
  type FreeZone,
} from "@/lib/free-zones-data";

const BANK_BADGE: Record<FreeZone["bankFriendliness"], string> = {
  Excellent: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  Strong: "bg-sky-500/10 text-sky-700 border-sky-200",
  Good: "bg-amber-500/10 text-amber-700 border-amber-200",
  Variable: "bg-zinc-500/10 text-zinc-700 border-zinc-300",
};

export function FreeZoneIndex({ zones }: { zones: FreeZone[] }) {
  const [query, setQuery] = useState("");
  const [emirate, setEmirate] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return zones.filter((z) => {
      if (emirate && z.emirate !== emirate) return false;
      if (category && z.category !== category) return false;
      if (!q) return true;
      const haystack = [
        z.short,
        z.name,
        z.pitch,
        ...z.industries,
        ...z.highlights,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, emirate, category]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-pattern text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-16 sm:pt-24 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
              UAE Free Zones · {zones.length} options compared
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Pick the right{" "}
              <span className="text-gold-gradient">UAE free zone</span> for
              your business.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
              Each zone is tuned to a specific industry, cost profile and visa
              quota. Search by name, filter by emirate, or browse by category
              — then book a free 30-minute matching call with Synergy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-16 z-20 bg-white/85 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7e96]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, industry or city…"
                className="pl-9"
                aria-label="Search free zones"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip
                label="All emirates"
                active={emirate === null}
                onClick={() => setEmirate(null)}
              />
              {FREE_ZONE_EMIRATES.map((e) => (
                <FilterChip
                  key={e}
                  label={e}
                  active={emirate === e}
                  onClick={() => setEmirate(emirate === e ? null : e)}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <FilterChip
              label="All categories"
              active={category === null}
              onClick={() => setCategory(null)}
            />
            {FREE_ZONE_CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                label={c}
                active={category === c}
                onClick={() => setCategory(category === c ? null : c)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-12 sm:py-16 bg-[#f8f9fc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[#6b7e96] mb-6">
            Showing{" "}
            <span className="text-[#0a2540] font-semibold">
              {filtered.length}
            </span>{" "}
            of {zones.length} free zones
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
              <p className="text-[#6b7e96]">
                No free zones match your filters. Try clearing one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.map((z, i) => (
                <motion.article
                  key={z.id}
                  id={z.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
                  className="rounded-2xl bg-white border border-border p-6 sm:p-7 shadow-sm hover:shadow-lg transition-shadow scroll-mt-44"
                >
                  <header className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#c9a84c] font-semibold">
                        {z.category}
                      </p>
                      <h2 className="mt-1 font-display text-2xl text-[#0a2540]">
                        {z.short}
                      </h2>
                      <p className="text-sm text-[#6b7e96] mt-0.5">
                        {z.name}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        BANK_BADGE[z.bankFriendliness],
                      )}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {z.bankFriendliness} banks
                    </span>
                  </header>

                  <p className="mt-4 text-sm text-[#1a2b3c] leading-relaxed">
                    {z.pitch}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-2.5 text-xs">
                    <Stat
                      icon={<MapPin className="h-3.5 w-3.5" />}
                      label="Emirate"
                      value={z.emirate}
                    />
                    <Stat
                      icon={<Clock className="h-3.5 w-3.5" />}
                      label="Setup time"
                      value={z.setupTime}
                    />
                    <Stat
                      icon={<Building2 className="h-3.5 w-3.5" />}
                      label="From"
                      value={`AED ${z.startingCostAed.toLocaleString()}`}
                    />
                    <Stat
                      icon={<Users className="h-3.5 w-3.5" />}
                      label="Visa quota"
                      value={z.visaQuotaFromOffice}
                    />
                  </dl>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7e96]">
                      Best for
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {z.industries.map((ind) => (
                        <span
                          key={ind}
                          className="text-xs px-2 py-0.5 rounded-full bg-[#f8f9fc] text-[#1a2b3c] border border-border"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2">
                    {z.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 text-sm text-[#1a2b3c]"
                      >
                        <Check className="h-4 w-4 mt-0.5 text-[#c9a84c] flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                    <Button
                      render={
                        <a
                          href={`/#contact`}
                          aria-label={`Get a quote for ${z.short}`}
                        />
                      }
                      className="bg-[#0a2540] hover:bg-[#071a2e] text-white flex-1"
                    >
                      Get a quote for {z.short}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] via-[#b6962f] to-[#0a2540]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-display text-3xl sm:text-4xl">
            Not sure which zone fits?
          </h2>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            Book a free 30-minute matching call. We&apos;ll shortlist 2–3
            zones with side-by-side cost, visa quota and banking acceptance.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              render={<a href="/#contact" />}
              size="lg"
              className="bg-[#0a2540] hover:bg-[#071a2e] text-white h-12 px-7"
            >
              Book a matching call
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              render={
                <a
                  href="https://wa.me/971500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              size="lg"
              variant="outline"
              className="h-12 px-7 border-white/40 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              WhatsApp us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
        active
          ? "bg-[#0a2540] text-white border-[#0a2540]"
          : "bg-white text-[#1a2b3c] border-border hover:border-[#c9a84c] hover:text-[#0a2540]",
      )}
    >
      {label}
    </button>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-[#f8f9fc] border border-border px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-[#6b7e96] flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-[#0a2540] font-semibold leading-tight">
        {value}
      </div>
    </div>
  );
}
