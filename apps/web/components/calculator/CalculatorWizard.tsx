"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Calculator,
  Check,
  Crown,
  DollarSign,
  Globe2,
  Landmark,
  MapPin,
  RefreshCw,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  emptyInput,
  estimate,
  type CalculatorInput,
  type OfficePreference,
  type Priority,
  type ZoneEstimate,
} from "@/lib/calculator";
import {
  FREE_ZONE_CATEGORIES,
  FREE_ZONE_EMIRATES,
  type FreeZoneCategory,
  type FreeZoneEmirate,
} from "@/lib/free-zones-data";

const TOTAL_STEPS = 5;

const CATEGORY_META: Record<FreeZoneCategory, { icon: LucideIcon; sub: string }> = {
  "Finance & Holding": {
    icon: Landmark,
    sub: "Banks, asset managers, fintech, holding cos",
  },
  "Industrial & Logistics": {
    icon: Building2,
    sub: "Manufacturing, warehousing, distribution",
  },
  "Media & Tech": {
    icon: Sparkles,
    sub: "Content, software, agencies, gaming",
  },
  Sustainability: {
    icon: Award,
    sub: "Clean tech, AI, mobility, ESG",
  },
  Aviation: {
    icon: Rocket,
    sub: "Aviation, freight, MRO, e-commerce",
  },
  "General SME": {
    icon: Globe2,
    sub: "Trading, consulting, services — anything else",
  },
};

const PRIORITY_META: Record<
  Priority,
  { icon: LucideIcon; title: string; sub: string }
> = {
  cost: {
    icon: DollarSign,
    title: "Lowest cost",
    sub: "Minimise year-one and renewal spend",
  },
  banking: {
    icon: ShieldCheck,
    title: "Strong banking",
    sub: "Tier-1 bank acceptance is critical",
  },
  prestige: {
    icon: Crown,
    title: "Prestige",
    sub: "Address & reputation matter to investors",
  },
  speed: {
    icon: Zap,
    title: "Speed",
    sub: "Live in days, not weeks",
  },
};

export function CalculatorWizard() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<CalculatorInput>(emptyInput());
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo<ZoneEstimate[]>(
    () => (submitted ? estimate(input) : []),
    [submitted, input],
  );

  function update<K extends keyof CalculatorInput>(
    key: K,
    value: CalculatorInput[K],
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInput(emptyInput());
    setStep(1);
    setSubmitted(false);
  }

  return (
    <section className="bg-[#f8f9fc] py-12 sm:py-16 min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {!submitted ? (
          <div className="rounded-2xl bg-white border border-border shadow-sm p-6 sm:p-10">
            <ProgressBar step={step} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                {step === 1 && (
                  <CategoryStep
                    value={input.activityCategory}
                    onChange={(v) => update("activityCategory", v)}
                  />
                )}
                {step === 2 && (
                  <CountStep
                    title="How many shareholders?"
                    sub="Including yourself"
                    icon={Users}
                    value={input.shareholders}
                    onChange={(v) => update("shareholders", v)}
                    min={1}
                    max={6}
                  />
                )}
                {step === 3 && (
                  <CountStep
                    title="How many visas in year one?"
                    sub="Founders + employees + dependants you'll sponsor"
                    icon={Users}
                    value={input.visasNeeded}
                    onChange={(v) => update("visasNeeded", v)}
                    min={0}
                    max={15}
                  />
                )}
                {step === 4 && (
                  <OfficeStep
                    value={input.officePreference}
                    emirate={input.emiratePreference}
                    onOffice={(v) => update("officePreference", v)}
                    onEmirate={(v) => update("emiratePreference", v)}
                  />
                )}
                {step === 5 && (
                  <PriorityStep
                    value={input.priority}
                    onChange={(v) => update("priority", v)}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                disabled={step === 1}
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="text-[#0a2540]"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <p className="text-xs text-[#6b7e96]">
                Step {step} of {TOTAL_STEPS}
              </p>
              {step < TOTAL_STEPS ? (
                <Button
                  onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                  className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
                >
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setSubmitted(true)}
                  className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
                >
                  See my estimate
                  <Calculator className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Results input={input} results={results} onReset={reset} />
        )}
      </div>
    </section>
  );
}

function ProgressBar({ step }: { step: number }) {
  const pct = (step / TOTAL_STEPS) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[#6b7e96]">
        <span className="uppercase tracking-wider font-semibold text-[#c9a84c]">
          Cost calculator
        </span>
        <span>
          {step} / {TOTAL_STEPS}
        </span>
      </div>
      <div className="h-1 bg-[#eef1f6] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8c96b]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        />
      </div>
    </div>
  );
}

function CategoryStep({
  value,
  onChange,
}: {
  value: FreeZoneCategory;
  onChange: (v: FreeZoneCategory) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl text-[#0a2540]">
        What does your business do?
      </h2>
      <p className="mt-1 text-sm text-[#6b7e96]">
        Pick the closest match — we&apos;ll use it to filter free zones.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FREE_ZONE_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;
          const active = value === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={cn(
                "text-left rounded-xl border p-4 transition-all",
                active
                  ? "bg-[#0a2540] text-white border-[#0a2540]"
                  : "bg-white text-[#1a2b3c] border-border hover:border-[#c9a84c]",
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    "h-5 w-5 mt-0.5 flex-shrink-0",
                    active ? "text-[#c9a84c]" : "text-[#0a2540]",
                  )}
                />
                <div>
                  <p className="font-medium">{cat}</p>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      active ? "text-white/70" : "text-[#6b7e96]",
                    )}
                  >
                    {meta.sub}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CountStep({
  title,
  sub,
  value,
  onChange,
  min,
  max,
  icon: Icon,
}: {
  title: string;
  sub: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  icon: LucideIcon;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl text-[#0a2540]">
        {title}
      </h2>
      <p className="mt-1 text-sm text-[#6b7e96]">{sub}</p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-12 w-12 rounded-full border border-border bg-white text-[#0a2540] text-xl font-semibold hover:border-[#c9a84c] disabled:opacity-50"
          aria-label="Decrease"
        >
          −
        </button>
        <div className="flex flex-col items-center px-6">
          <Icon className="h-5 w-5 text-[#c9a84c]" />
          <div className="mt-1 font-display text-5xl text-[#0a2540] tabular-nums">
            {value}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="h-12 w-12 rounded-full border border-border bg-white text-[#0a2540] text-xl font-semibold hover:border-[#c9a84c] disabled:opacity-50"
          aria-label="Increase"
        >
          +
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-[#6b7e96]">
        {value === min ? `Minimum ${min}` : `Maximum ${max}`} · adjust later if
        needed
      </p>
    </div>
  );
}

function OfficeStep({
  value,
  emirate,
  onOffice,
  onEmirate,
}: {
  value: OfficePreference;
  emirate: FreeZoneEmirate | "any";
  onOffice: (v: OfficePreference) => void;
  onEmirate: (v: FreeZoneEmirate | "any") => void;
}) {
  const offices: { value: OfficePreference; title: string; sub: string }[] = [
    {
      value: "flexi-desk",
      title: "Flexi-desk",
      sub: "Cheapest. Up to ~3 visas. Shared address.",
    },
    {
      value: "co-working",
      title: "Co-working",
      sub: "Shared workspace with desk access. Up to ~6 visas.",
    },
    {
      value: "dedicated",
      title: "Dedicated office",
      sub: "Private Ejari office. Unlimited visa quota.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl text-[#0a2540]">
          Office preference?
        </h2>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Drives both your cost and your visa quota.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {offices.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => onOffice(o.value)}
              className={cn(
                "text-left rounded-xl border p-4 transition-all",
                value === o.value
                  ? "bg-[#0a2540] text-white border-[#0a2540]"
                  : "bg-white text-[#1a2b3c] border-border hover:border-[#c9a84c]",
              )}
            >
              <p className="font-medium">{o.title}</p>
              <p
                className={cn(
                  "text-xs mt-1",
                  value === o.value ? "text-white/70" : "text-[#6b7e96]",
                )}
              >
                {o.sub}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl text-[#0a2540]">
          Preferred emirate?
        </h3>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Pick &ldquo;Any&rdquo; if you&apos;re open — we&apos;ll optimise for
          your other answers.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <PillChoice
            label="Any"
            active={emirate === "any"}
            onClick={() => onEmirate("any")}
          />
          {FREE_ZONE_EMIRATES.map((e) => (
            <PillChoice
              key={e}
              label={e}
              active={emirate === e}
              onClick={() => onEmirate(e)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PriorityStep({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (v: Priority) => void;
}) {
  const options: Priority[] = ["cost", "banking", "prestige", "speed"];
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl text-[#0a2540]">
        What matters most to you?
      </h2>
      <p className="mt-1 text-sm text-[#6b7e96]">
        We&apos;ll bias the recommendation toward your top priority.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((p) => {
          const meta = PRIORITY_META[p];
          const Icon = meta.icon;
          const active = value === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={cn(
                "text-left rounded-xl border p-4 transition-all",
                active
                  ? "bg-[#0a2540] text-white border-[#0a2540]"
                  : "bg-white text-[#1a2b3c] border-border hover:border-[#c9a84c]",
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    "h-5 w-5 mt-0.5",
                    active ? "text-[#c9a84c]" : "text-[#0a2540]",
                  )}
                />
                <div>
                  <p className="font-medium">{meta.title}</p>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      active ? "text-white/70" : "text-[#6b7e96]",
                    )}
                  >
                    {meta.sub}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PillChoice({
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
          : "bg-white text-[#1a2b3c] border-border hover:border-[#c9a84c]",
      )}
    >
      {label}
    </button>
  );
}

function Results({
  input,
  results,
  onReset,
}: {
  input: CalculatorInput;
  results: ZoneEstimate[];
  onReset: () => void;
}) {
  const top = results[0];
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explainSource, setExplainSource] = useState<"claude" | "fallback" | null>(
    null,
  );
  const [explainLoading, setExplainLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setExplainLoading(true);
    setExplanation(null);

    fetch("/api/calculator/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zoneShort: top.zone.short,
        zoneName: top.zone.name,
        zoneCategory: top.zone.category,
        emirate: top.zone.emirate,
        matchScore: top.matchScore,
        reasons: top.reasons,
        user: input,
        yearOneTotalAed: top.yearOne.totalAed,
      }),
    })
      .then((r) => r.json() as Promise<{ explanation: string; source: "claude" | "fallback" }>)
      .then((data) => {
        if (cancelled) return;
        setExplanation(data.explanation);
        setExplainSource(data.source);
      })
      .catch(() => {
        if (cancelled) return;
        setExplanation(null);
      })
      .finally(() => {
        if (!cancelled) setExplainLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [input, top]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <header className="rounded-2xl bg-[#0a2540] text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#c9a84c]/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Your estimate
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">
            Top match:{" "}
            <span className="text-gold-gradient">{top.zone.short}</span>
          </h2>
          <p className="mt-2 text-sm text-white/75 max-w-xl leading-relaxed">
            Based on a {input.activityCategory.toLowerCase()} business with{" "}
            {input.shareholders} shareholder
            {input.shareholders > 1 ? "s" : ""}, {input.visasNeeded} visa
            {input.visasNeeded === 1 ? "" : "s"} and a{" "}
            {input.officePreference.replace("-", " ")} office.
          </p>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Stat
              label="Year-one estimate"
              value={`AED ${top.yearOne.totalAed.toLocaleString()}`}
            />
            <Stat
              label="Year 2 onwards"
              value={`AED ${top.yearTwoOnwards.totalAed.toLocaleString()}/yr`}
            />
            <Stat label="Setup time" value={top.setupTime} />
          </div>

          <div className="mt-5 rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 backdrop-blur p-4">
            <div className="flex items-center gap-2 text-[#e8c96b]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Why this fits you
                {explainSource === "fallback" && (
                  <span className="ml-2 text-[10px] text-white/55 normal-case font-normal">
                    · rules-based
                  </span>
                )}
              </span>
            </div>
            <div className="mt-2 text-sm text-white/85 leading-relaxed min-h-[3.5rem]">
              {explainLoading ? (
                <span className="inline-flex items-center gap-2 text-white/55">
                  <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce" />
                  <span
                    className="h-2 w-2 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: "240ms" }}
                  />
                  Analysing fit…
                </span>
              ) : (
                explanation
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5">
        {results.map((r, idx) => (
          <ResultCard key={r.zone.id} result={r} rank={idx + 1} />
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p>
          <strong>Heads up:</strong> these numbers are approximate and exclude
          UAE VAT (5%), corporate tax registration (if applicable) and
          activity-specific approvals. Your actual quote will be itemised to
          the dirham.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <Button
          variant="ghost"
          onClick={onReset}
          className="text-[#0a2540]"
        >
          <RefreshCw className="mr-1 h-4 w-4" />
          Start over
        </Button>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            render={<a href="/contact" />}
            className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
          >
            Email this estimate to me
            <Send className="ml-1 h-4 w-4" />
          </Button>
          <Button
            render={
              <a
                href="https://wa.me/971500000000"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
          >
            Talk to a consultant
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ResultCard({
  result,
  rank,
}: {
  result: ZoneEstimate;
  rank: number;
}) {
  const { zone, matchScore, reasons, yearOne, yearTwoOnwards } = result;
  const isTop = rank === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: rank * 0.05 }}
      className={cn(
        "rounded-2xl border p-6 sm:p-7",
        isTop
          ? "bg-white border-[#c9a84c] shadow-lg"
          : "bg-white border-border",
      )}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#0a2540] text-[#c9a84c] font-bold">
            {rank}
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
              {zone.category}
            </p>
            <h3 className="font-display text-xl text-[#0a2540]">
              {zone.short} —{" "}
              <span className="text-[#6b7e96] text-base">
                {zone.emirate}
              </span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-[#c9a84c] fill-[#c9a84c]" />
          <span className="font-display text-lg text-[#0a2540]">
            {matchScore}
          </span>
          <span className="text-xs text-[#6b7e96]">/ 100 match</span>
        </div>
      </div>

      {reasons.length > 0 && (
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-[#1a2b3c]">
          {reasons.slice(0, 4).map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-[#c9a84c] flex-shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <CostBlock
          title="Year-one cost"
          total={yearOne.totalAed}
          lines={yearOne.lines}
        />
        <CostBlock
          title="Year 2+ (per year)"
          total={yearTwoOnwards.totalAed}
          lines={yearTwoOnwards.lines}
          subtle
        />
      </div>
    </motion.div>
  );
}

function CostBlock({
  title,
  total,
  lines,
  subtle = false,
}: {
  title: string;
  total: number;
  lines: { label: string; amountAed: number; detail?: string }[];
  subtle?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        subtle ? "bg-[#f8f9fc] border-border" : "bg-[#f8f9fc] border-[#c9a84c]/30",
      )}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-wide font-semibold">
        <span className="text-[#6b7e96]">{title}</span>
        <span className="font-display text-base text-[#0a2540] normal-case tracking-normal">
          AED {total.toLocaleString()}
        </span>
      </div>
      <ul className="mt-3 divide-y divide-border text-sm">
        {lines.map((line, i) => (
          <li key={i} className="py-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-[#0a2540]">{line.label}</p>
              {line.detail && (
                <p className="text-xs text-[#6b7e96] mt-0.5">
                  {line.detail}
                </p>
              )}
            </div>
            <span className="font-medium text-[#0a2540] whitespace-nowrap">
              AED {line.amountAed.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-white/55">
        {label}
      </div>
      <div className="mt-0.5 font-display text-base text-[#e8c96b]">
        {value}
      </div>
    </div>
  );
}

export function CalculatorIntro() {
  return (
    <section className="relative overflow-hidden bg-navy-pattern text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-20 sm:pb-14">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3 py-1 text-xs font-medium text-[#e8c96b]">
            <Wallet className="h-3.5 w-3.5" />
            5-step estimator · ~60 seconds
          </span>

          <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            Itemised{" "}
            <span className="text-gold-gradient">UAE setup cost</span>{" "}
            in 60 seconds.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
            Answer five quick questions. We&apos;ll match you to the top three
            free zones and break down government fees, Synergy service fees
            and yearly renewals — no email required for the result.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/65">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#c9a84c]" />
              13 free zones compared
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-[#c9a84c]" />
              AED itemised
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#c9a84c]" />
              No registration needed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
