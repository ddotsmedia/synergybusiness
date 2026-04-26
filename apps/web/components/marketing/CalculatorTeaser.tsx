"use client";

import { motion } from "framer-motion";
import { Calculator, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CalculatorTeaser() {
  return (
    <section
      id="calculator"
      className="py-20 sm:py-28 bg-[#071a2e] text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-[#c9a84c]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3 py-1 text-xs font-medium text-[#e8c96b]">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered cost estimate
          </span>

          <h2 className="mt-6 font-display text-3xl sm:text-5xl tracking-tight">
            Know your setup cost in{" "}
            <span className="text-gold-gradient">60 seconds</span>.
          </h2>

          <p className="mt-5 text-white/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Answer a few questions about your activity, ownership and visa
            needs. Our AI estimator breaks down government fees, Synergy
            service fees and ongoing costs — no email required.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { value: "60s", label: "Estimate time" },
              { value: "30+", label: "Free zones compared" },
              { value: "AED", label: "Itemised in detail" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
              >
                <div className="font-display text-2xl text-[#c9a84c]">
                  {s.value}
                </div>
                <div className="text-xs text-white/65">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              render={<a href="/cost-calculator" />}
              size="lg"
              className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold h-12 px-7"
            >
              <Calculator className="mr-1 h-4 w-4" />
              Open Cost Calculator
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
