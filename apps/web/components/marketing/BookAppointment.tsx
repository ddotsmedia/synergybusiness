"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PERKS = [
  "30-minute discovery call · free, no obligation",
  "Tailored recommendation: mainland · free zone · offshore",
  "Itemised AED quote sent within one business hour",
];

export function BookAppointment() {
  return (
    <section className="relative overflow-hidden bg-[#0a2540] text-white">
      {/* ambient blooms */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/12 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[34rem] w-[34rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="block h-px w-10 bg-gradient-to-r from-transparent to-[#c9a84c]"
              />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c9a84c] font-semibold">
                Book an appointment
              </span>
            </div>

            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-[2.75rem] tracking-[-0.01em] leading-[1.15]">
              Talk to a Synergy consultant —{" "}
              <span className="text-gold-gradient">free</span>, in 30 minutes.
            </h2>

            <p className="mt-6 text-base sm:text-lg text-white/75 leading-[1.7] max-w-2xl">
              Pick a slot that works for you and we&apos;ll come prepared with
              cost ranges, free-zone shortlists and visa guidance specific to
              your activity. No script, no pressure.
            </p>

            <ul className="mt-8 space-y-3">
              {PERKS.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-3 text-sm text-white/85"
                >
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#c9a84c] flex-shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button
                render={<a href="/#contact" />}
                size="lg"
                className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold h-12 px-7 shadow-[0_8px_30px_rgba(201,168,76,0.25)] hover:shadow-[0_12px_40px_rgba(201,168,76,0.35)] transition-shadow"
              >
                <CalendarCheck className="mr-1.5 h-4 w-4" />
                Book a free call
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
                className="h-12 px-7 border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur"
              >
                <MessageCircle className="mr-1.5 h-4 w-4" />
                WhatsApp instead
              </Button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-[#c9a84c]/25 bg-white/[0.04] backdrop-blur p-7 lg:p-9">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9a84c] font-semibold">
                Typical agenda
              </p>
              <ol className="mt-6 space-y-5">
                <Step
                  index="1"
                  title="Your business in 5 mins"
                  body="Activity, customers, jurisdiction history — what you've already considered."
                />
                <Step
                  index="2"
                  title="Structure recommendation"
                  body="Mainland vs free zone vs offshore — with the trade-offs spelled out."
                />
                <Step
                  index="3"
                  title="Cost & timeline"
                  body="Itemised AED estimate and a realistic 30-day plan you can take to your team."
                />
              </ol>

              <p className="mt-8 pt-6 border-t border-white/10 text-xs text-white/55 leading-relaxed">
                Calls run on Google Meet or WhatsApp Video. We block 45 minutes
                so there&apos;s buffer if your questions go deeper.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <span
        aria-hidden
        className="flex-shrink-0 h-7 w-7 rounded-full border border-[#c9a84c]/40 text-[#c9a84c] flex items-center justify-center font-display text-sm"
      >
        {index}
      </span>
      <div>
        <p className="font-display text-base text-white">{title}</p>
        <p className="mt-1 text-sm text-white/65 leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
