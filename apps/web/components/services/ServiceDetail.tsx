"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  Clock,
  Crown,
  FileCheck2,
  Globe2,
  Key,
  MapPin,
  Plane,
  Rocket,
  ShieldCheck,
  Sparkles,
  Stamp,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SERVICES,
  type ServiceDetail as ServiceDetailType,
  type ServiceFeature,
  type ServiceSlug,
} from "@/lib/services-data";

const FEATURE_ICONS: Record<ServiceFeature["icon"], LucideIcon> = {
  shield: ShieldCheck,
  globe: Globe2,
  target: Target,
  stamp: Stamp,
  key: Key,
  rocket: Rocket,
  users: Users,
  clock: Clock,
  wallet: Wallet,
  sparkles: Sparkles,
};

const SERVICE_ICONS: Record<ServiceSlug, LucideIcon> = {
  mainland: Building2,
  "free-zone": MapPin,
  offshore: Globe2,
  "pro-services": FileCheck2,
  visa: Plane,
  "golden-visa": Crown,
};

function formatPrice(amount: number) {
  if (amount === 0) return "Free";
  return `AED ${amount.toLocaleString()}`;
}

export function ServiceDetail({ service }: { service: ServiceDetailType }) {
  const { hero, metricStrip, features, packages, process, faqs, related } =
    service;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-pattern text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs text-white/55 mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-[#e8c96b]">
              Home
            </Link>{" "}
            <span className="mx-1.5">/</span>{" "}
            <Link href="/#services" className="hover:text-[#e8c96b]">
              Services
            </Link>{" "}
            <span className="mx-1.5">/</span>{" "}
            <span className="text-white/85">{hero.eyebrow}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
              {hero.eyebrow}
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              {hero.title}{" "}
              <span className="text-gold-gradient">
                {hero.titleHighlight}
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
              {hero.description}
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-2xl">
              {hero.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-sm text-white/85"
                >
                  <Check className="h-4 w-4 mt-0.5 text-[#e8c96b] flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button
                render={<a href="/#contact" />}
                size="lg"
                className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold h-12 px-7"
              >
                Book a free consultation
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                render={<a href="/cost-calculator" />}
                size="lg"
                variant="outline"
                className="h-12 px-7 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                Estimate my cost
              </Button>
            </div>

            {(hero.startingPrice || hero.timelineDays) && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
                {hero.startingPrice && (
                  <span>
                    From{" "}
                    <span className="text-white font-semibold">
                      AED {hero.startingPrice.toLocaleString()}
                    </span>
                  </span>
                )}
                {hero.timelineDays && (
                  <span>
                    Timeline:{" "}
                    <span className="text-white font-semibold">
                      {hero.timelineDays}
                    </span>
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* METRIC STRIP */}
      <section className="bg-[#0a2540] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {metricStrip.map((m) => (
              <div
                key={m.label}
                className="border border-white/10 rounded-xl py-3 px-2"
              >
                <dt className="text-xs uppercase tracking-wide text-white/55">
                  {m.label}
                </dt>
                <dd className="mt-1 font-display text-xl text-[#e8c96b]">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 sm:py-24 bg-[#f8f9fc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
              What you get
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
              Everything covered, nothing left to chance
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, idx) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="rounded-2xl bg-white border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#0a2540]/5 text-[#0a2540] flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg text-[#0a2540]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#6b7e96] leading-relaxed">
                    {feature.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      {packages && packages.length > 0 && (
        <section className="py-20 sm:py-24 bg-white border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
                Packages
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
                Transparent pricing. No hidden fees.
              </h2>
              <p className="mt-4 text-[#6b7e96] leading-relaxed">
                Pick the package closest to your needs — we&apos;ll fine-tune
                in your discovery call.
              </p>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
              {packages.map((pkg, idx) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className={cn(
                    "relative rounded-2xl p-6 sm:p-7 flex flex-col",
                    pkg.highlight
                      ? "bg-[#0a2540] text-white border-2 border-[#c9a84c] shadow-2xl shadow-[#0a2540]/20 md:scale-[1.03]"
                      : "bg-white border border-border",
                  )}
                >
                  {pkg.highlight && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-[#c9a84c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0a2540]">
                      <Sparkles className="h-3 w-3" /> Most popular
                    </span>
                  )}

                  <div>
                    <h3
                      className={cn(
                        "font-display text-xl",
                        pkg.highlight ? "text-white" : "text-[#0a2540]",
                      )}
                    >
                      {pkg.name}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        pkg.highlight ? "text-white/70" : "text-[#6b7e96]",
                      )}
                    >
                      {pkg.tagline}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div
                      className={cn(
                        "font-display text-3xl",
                        pkg.highlight ? "text-[#e8c96b]" : "text-[#0a2540]",
                      )}
                    >
                      {pkg.priceFromAed === null
                        ? "Custom"
                        : pkg.priceFromAed === 0
                          ? "Free"
                          : `from ${formatPrice(pkg.priceFromAed)}`}
                    </div>
                    {pkg.priceNote && (
                      <div
                        className={cn(
                          "text-xs mt-1",
                          pkg.highlight ? "text-white/60" : "text-[#6b7e96]",
                        )}
                      >
                        {pkg.priceNote}
                      </div>
                    )}
                  </div>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {pkg.features.map((f) => (
                      <li
                        key={f}
                        className={cn(
                          "flex items-start gap-2.5 text-sm",
                          pkg.highlight ? "text-white/85" : "text-[#1a2b3c]",
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 mt-0.5 flex-shrink-0",
                            pkg.highlight
                              ? "text-[#e8c96b]"
                              : "text-[#c9a84c]",
                          )}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    render={<a href="/#contact" />}
                    className={cn(
                      "mt-7 h-11",
                      pkg.highlight
                        ? "bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
                        : "bg-[#0a2540] hover:bg-[#071a2e] text-white",
                    )}
                  >
                    {pkg.cta ?? "Get this package"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section className="py-20 sm:py-24 bg-[#f8f9fc]">
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
              From kick-off to launch — the {hero.eyebrow.toLowerCase()}{" "}
              process
            </h2>
          </motion.div>

          <ol className="mt-12 relative border-l-2 border-[#c9a84c]/30 ml-3 sm:ml-5 space-y-10">
            {process.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="pl-8 sm:pl-10 relative"
              >
                <span className="absolute -left-[17px] top-0 h-8 w-8 rounded-full bg-[#0a2540] text-[#c9a84c] text-sm font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h3 className="font-display text-lg text-[#0a2540]">
                    {step.title}
                  </h3>
                  {step.durationDays && (
                    <span className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
                      {step.durationDays}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[#6b7e96] leading-relaxed max-w-2xl">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
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
              FAQs
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
              Common questions about {hero.eyebrow.toLowerCase()}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10"
          >
            <Accordion className="space-y-3">
              {faqs.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="rounded-xl border border-border bg-[#f8f9fc] px-5 data-[state=open]:bg-white data-[state=open]:shadow-sm transition-all"
                >
                  <AccordionTrigger className="text-left text-[#0a2540] font-medium hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#1a2b3c]/85 leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-20 sm:py-24 bg-[#f8f9fc] border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
                Related services
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
                You might also need
              </h2>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((slug, idx) => {
                const r = SERVICES[slug];
                const Icon = SERVICE_ICONS[slug];
                return (
                  <motion.div
                    key={slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                  >
                    <Link
                      href={`/services/${slug}`}
                      className="group block rounded-2xl bg-white border border-border p-6 hover:-translate-y-1 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="h-11 w-11 rounded-xl bg-[#0a2540]/5 text-[#0a2540] flex items-center justify-center group-hover:bg-[#0a2540] group-hover:text-[#c9a84c] transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-[#6b7e96] group-hover:text-[#c9a84c] transition-colors" />
                      </div>
                      <h3 className="mt-4 font-display text-lg text-[#0a2540]">
                        {r.hero.eyebrow}
                      </h3>
                      <p className="mt-2 text-sm text-[#6b7e96] leading-relaxed line-clamp-2">
                        {r.hero.description}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA STRIP */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] via-[#b6962f] to-[#0a2540]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl">
              Ready to start your {hero.eyebrow.toLowerCase()}?
            </h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">
              Speak to a Synergy consultant — free, no obligation, replies in
              one business hour.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                render={<a href="/#contact" />}
                size="lg"
                className="bg-[#0a2540] hover:bg-[#071a2e] text-white h-12 px-7"
              >
                Talk to a consultant
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
          </motion.div>
        </div>
      </section>
    </>
  );
}
