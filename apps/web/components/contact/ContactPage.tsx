"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Content } from "@/lib/site-content";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICES = [
  { value: "mainland", label: "Mainland Setup" },
  { value: "free-zone", label: "Free Zone Setup" },
  { value: "offshore", label: "Offshore Company" },
  { value: "pro-services", label: "PRO Services" },
  { value: "visa", label: "Visa Services" },
  { value: "golden-visa", label: "Golden Visa" },
  { value: "other", label: "Something else" },
];

const OFFICES = [
  {
    city: "Abu Dhabi (HQ)",
    addressLine1: "Office 24, Al Maryah Tower",
    addressLine2: "Al Maryah Island, Abu Dhabi",
    phone: "+971 2 000 0000",
    hours: "Sun–Thu · 9:00 – 18:00 GST",
  },
  {
    city: "Dubai",
    addressLine1: "Level 14, One JLT",
    addressLine2: "Jumeirah Lake Towers, Dubai",
    phone: "+971 4 000 0000",
    hours: "Sun–Thu · 9:00 – 18:00 GST",
  },
  {
    city: "Ras Al Khaimah",
    addressLine1: "RAKEZ Compass Building",
    addressLine2: "Al Hamra Industrial Zone, RAK",
    phone: "+971 7 000 0000",
    hours: "Sun–Thu · 9:00 – 17:00 GST",
  },
];

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  serviceInterest: z.string().min(1, "Choose a service"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function s(content: Content, key: string, fallback: string): string {
  const v = content[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

export function ContactPage({ content = {} }: { content?: Content }) {
  const heroEyebrow = s(
    content,
    "hero.eyebrow",
    "We reply in under 1 hour, every business day",
  );
  const heroTitleMain = s(content, "hero.titleMain", "Talk to a");
  const heroTitleHighlight = s(content, "hero.titleHighlight", "Synergy");
  const heroTitleAfter = s(content, "hero.titleAfter", "consultant.");
  const heroDescription = s(
    content,
    "hero.description",
    "Fastest response is on WhatsApp. Prefer email or a scheduled call? We'll work with whatever fits your style.",
  );
  const whatsappNumber = s(
    content,
    "channels.whatsappNumber",
    "+971 50 000 0000",
  );
  const whatsappLink = s(
    content,
    "channels.whatsappLink",
    "https://wa.me/971500000000",
  );
  const phone = s(content, "channels.phone", "+971 2 000 0000");
  const email = s(content, "channels.email", "hello@synergybusiness.ae");
  const hours = s(
    content,
    "channels.hours",
    "Sun–Thu · 9:00 – 18:00 GST",
  );
  const hqTitle = s(content, "hq.title", "Office 24, Al Maryah Tower");
  const hqSubtitle = s(
    content,
    "hq.subtitle",
    "Al Maryah Island, Abu Dhabi, UAE",
  );

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
        body: JSON.stringify({ ...values, source: "contact_page" }),
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
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-pattern text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
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

      {/* QUICK CHANNELS */}
      <section className="py-12 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 hover:border-[#c9a84c] hover:shadow-md transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-[#25d366] flex items-center justify-center text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg text-[#0a2540]">
                WhatsApp · {whatsappNumber}
              </div>
              <div className="text-sm text-[#6b7e96]">
                Replies within minutes · 7 days a week
              </div>
            </div>
          </a>

          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 hover:border-[#c9a84c] hover:shadow-md transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-[#0a2540] flex items-center justify-center text-[#c9a84c]">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg text-[#0a2540]">
                {phone}
              </div>
              <div className="text-sm text-[#6b7e96]">{hours}</div>
            </div>
          </a>

          <a
            href={`mailto:${email}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 hover:border-[#c9a84c] hover:shadow-md transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-[#0a2540] flex items-center justify-center text-[#c9a84c]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg text-[#0a2540]">
                {email}
              </div>
              <div className="text-sm text-[#6b7e96]">
                Replies within 1 business hour
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="py-16 sm:py-20 bg-[#f8f9fc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 rounded-2xl bg-white border border-border shadow-sm p-6 sm:p-8"
          >
            <h2 className="font-display text-2xl text-[#0a2540]">
              Send us a brief
            </h2>
            <p className="mt-1 text-sm text-[#6b7e96]">
              The more you share, the sharper our first response will be.
            </p>

            {submitted ? (
              <div className="mt-10 py-10 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#0a2540] flex items-center justify-center text-[#c9a84c]">
                  <Send className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl text-[#0a2540]">
                  Thank you — we&apos;ve got it
                </h3>
                <p className="mt-2 text-[#6b7e96] max-w-sm mx-auto">
                  A Synergy consultant will reach out within one business hour
                  with a recommendation and a quote.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
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
                    Tell us about your project
                  </label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Activity, target market, timeline, ownership structure…"
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
                      Send brief
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#0a2540] to-[#122c4a] relative">
                <iframe
                  title="Synergy Business Abu Dhabi office"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=54.382%2C24.488%2C54.405%2C24.504&layer=mapnik&marker=24.4965,54.3937"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 grayscale-[20%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-[#c9a84c] font-semibold">
                  Headquarters
                </p>
                <p className="mt-1 font-display text-lg text-[#0a2540]">
                  {hqTitle}
                </p>
                <p className="text-sm text-[#6b7e96]">
                  {hqSubtitle}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0a2540] text-white p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#c9a84c]" />
                <p className="text-xs uppercase tracking-wide font-semibold text-[#c9a84c]">
                  Hours
                </p>
              </div>
              <ul className="mt-3 text-sm space-y-1.5">
                <li className="flex justify-between">
                  <span className="text-white/70">Sunday – Thursday</span>
                  <span>9:00 – 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/70">Friday</span>
                  <span>WhatsApp only</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/70">Saturday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
              Our offices
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-[#0a2540]">
              Visit us in three emirates
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {OFFICES.map((office, i) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-[#0a2540]/5 text-[#0a2540] flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[#0a2540]">
                  {office.city}
                </h3>
                <div className="mt-3 flex items-start gap-2 text-sm text-[#6b7e96]">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#c9a84c]" />
                  <span>
                    {office.addressLine1}
                    <br />
                    {office.addressLine2}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-[#1a2b3c]">
                  <Phone className="h-4 w-4 text-[#c9a84c]" />
                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="hover:text-[#c9a84c]"
                  >
                    {office.phone}
                  </a>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-[#6b7e96]">
                  <Clock className="h-4 w-4 text-[#c9a84c]" />
                  <span>{office.hours}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
