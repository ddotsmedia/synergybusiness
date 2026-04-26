"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  ClipboardList,
  Stamp,
  Rocket,
} from "lucide-react";

const STEPS = [
  {
    icon: MessageCircle,
    title: "Free Consultation",
    body:
      "Tell us your business activity, target market and budget. We recommend the right structure — mainland, free zone or offshore.",
  },
  {
    icon: ClipboardList,
    title: "Documents & Approvals",
    body:
      "We collect your KYC, draft the MOA and submit name reservation, initial approval and licensing applications.",
  },
  {
    icon: Stamp,
    title: "Licence Issued",
    body:
      "Trade licence, establishment card and computer card are issued. We open your corporate bank account.",
  },
  {
    icon: Rocket,
    title: "Visas & Launch",
    body:
      "Investor visa, employee visas, Emirates IDs and tax registration completed — you're operational.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="process"
      className="py-20 sm:py-28 bg-white border-y border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
            Four simple steps from idea to launch
          </h2>
        </motion.div>

        <div className="relative mt-14">
          <div className="hidden md:block absolute top-7 left-[6%] right-[6%] h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

          <ol className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex flex-col items-start"
              >
                <div className="relative h-14 w-14 rounded-full bg-[#0a2540] text-[#c9a84c] flex items-center justify-center shadow-lg shadow-[#0a2540]/10">
                  <step.icon className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#c9a84c] text-[#0a2540] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl text-[#0a2540]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#6b7e96] leading-relaxed">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
