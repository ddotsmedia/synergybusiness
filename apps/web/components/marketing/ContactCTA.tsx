"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, Send, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Content } from "@/lib/site-content";

function s(content: Content, key: string, fallback: string): string {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

const SERVICES = [
  { value: "mainland", label: "Mainland Setup" },
  { value: "free-zone", label: "Free Zone Setup" },
  { value: "offshore", label: "Offshore Company" },
  { value: "pro-services", label: "PRO Services" },
  { value: "visa", label: "Visa Services" },
  { value: "golden-visa", label: "Golden Visa" },
  { value: "other", label: "Something else" },
];

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  serviceInterest: z.string().min(1, "Choose a service"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactCTA({ content = {} }: { content?: Content }) {
  const whatsappLink = s(
    content,
    "channels.whatsappLink",
    "https://wa.me/971500000000",
  );
  const phoneDisplay = s(content, "channels.phone", "+971 2 000 0000");
  const phoneTel = phoneDisplay.replace(/\s/g, "");
  const hours = s(content, "channels.hours", "Sun–Thu · 9:00 – 18:00 GST");
  const email = s(content, "channels.email", "hello@synergybusiness.ae");

  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceInterest: "",
      message: "",
    },
  });

  const serviceValue = watch("serviceInterest");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setErrorMsg(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "home_cta" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? "Submission failed",
        );
      }
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong — please try WhatsApp.",
      );
    }
  }

  return (
    <section id="contact" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] via-[#b6962f] to-[#0a2540]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-white"
          >
            <p className="text-sm font-semibold tracking-wide uppercase text-white/85">
              Let&apos;s talk
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Ready to launch your UAE business?
            </h2>
            <p className="mt-5 text-white/85 text-base sm:text-lg leading-relaxed max-w-xl">
              Send us a few details and a Synergy consultant will respond
              within one business hour with a recommendation and an itemised
              quote.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl bg-[#0a2540] hover:bg-[#071a2e] px-5 py-4 text-white transition-all hover:translate-x-1"
              >
                <div className="h-11 w-11 rounded-full bg-[#25d366] flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">WhatsApp us instantly</div>
                  <div className="text-xs text-white/70">
                    Replies in minutes · 7 days a week
                  </div>
                </div>
              </a>
              <a
                href={`tel:${phoneTel}`}
                className="flex items-center gap-4 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 px-5 py-4 text-white transition-all"
              >
                <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{phoneDisplay}</div>
                  <div className="text-xs text-white/70">{hours}</div>
                </div>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur border border-white/20 px-5 py-4 text-white transition-all"
              >
                <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{email}</div>
                  <div className="text-xs text-white/70">
                    We reply within 1 business hour
                  </div>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-white/95 backdrop-blur border border-white/40 shadow-2xl p-6 sm:p-8"
          >
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#0a2540] flex items-center justify-center text-[#c9a84c]">
                  <Send className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl text-[#0a2540]">
                  Thank you — we&apos;ve got it
                </h3>
                <p className="mt-2 text-[#6b7e96]">
                  A Synergy consultant will reach out within one business
                  hour.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-[#0a2540]"
                  >
                    Full name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    className="mt-1.5"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-[#0a2540]"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                      className="mt-1.5"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-[#0a2540]"
                    >
                      Phone (with country code)
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+971 50 000 0000"
                      {...register("phone")}
                      aria-invalid={!!errors.phone}
                      className="mt-1.5"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#0a2540]">
                    What do you need help with?
                  </label>
                  <Select
                    value={serviceValue || ""}
                    onValueChange={(v) =>
                      setValue("serviceInterest", v ?? "", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceInterest && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.serviceInterest.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-[#0a2540]"
                  >
                    Tell us about your project (optional)
                  </label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Activity, target market, timeline…"
                    {...register("message")}
                    className="mt-1.5 resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-600 text-center">
                    {errorMsg}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0a2540] hover:bg-[#071a2e] text-white h-12 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Get my free consultation
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-[#6b7e96] text-center">
                  By submitting, you agree to our terms. We never share your
                  details.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
