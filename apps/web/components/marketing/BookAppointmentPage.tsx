"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Send,
  Video,
} from "lucide-react";
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
import { whatsappLink, phoneNumbers } from "@/lib/site";

const SERVICES = [
  { value: "mainland", label: "Mainland Setup" },
  { value: "free-zone", label: "Free Zone Setup" },
  { value: "offshore", label: "Offshore Company" },
  { value: "pro-services", label: "PRO Services" },
  { value: "visa", label: "Visa Services" },
  { value: "golden-visa", label: "Golden Visa" },
  { value: "other", label: "Something else" },
];

const LOCATIONS = [
  { value: "abu-dhabi", label: "Abu Dhabi (HQ)", icon: MapPin },
  { value: "dubai", label: "Dubai", icon: MapPin },
  { value: "rak", label: "Ras Al Khaimah", icon: MapPin },
  { value: "video", label: "Video Call (Zoom / Teams)", icon: Video },
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  serviceInterest: z.string().min(1, "Choose a service"),
  preferredDate: z.string().min(1, "Pick a preferred date"),
  preferredTime: z.string().min(1, "Pick a preferred time"),
  location: z.string().min(1, "Choose a meeting location"),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function formatDateLong(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BookAppointmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dateLimits = useMemo(() => {
    const today = new Date();
    const max = new Date();
    max.setDate(today.getDate() + 60);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { min: fmt(today), max: fmt(max) };
  }, []);

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
      preferredDate: "",
      preferredTime: "",
      location: "abu-dhabi",
      notes: "",
    },
  });

  const serviceValue = watch("serviceInterest");
  const locationValue = watch("location");
  const timeValue = watch("preferredTime");
  const dateValue = watch("preferredDate");

  async function onSubmit(values: FormValues) {
    setErrorMsg(null);

    const locationLabel =
      LOCATIONS.find((l) => l.value === values.location)?.label ??
      values.location;

    const message = [
      `Preferred date: ${formatDateLong(values.preferredDate)}`,
      `Preferred time: ${values.preferredTime} GST`,
      `Meeting location: ${locationLabel}`,
      values.notes ? `\nNotes:\n${values.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          serviceInterest: values.serviceInterest,
          message,
          source: "appointment_booking",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? "Submission failed",
        );
      }
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 8000);
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
              Free 30-minute consultation · No obligation
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Book an{" "}
              <span className="text-gold-gradient">Appointment</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
              Sit down with a Synergy Business setup specialist. We&apos;ll map
              out the right licence, free zone, visa quota, and approximate
              cost for your business — and answer every question you bring.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#c9a84c]" />
                Confirmation within 1 business hour
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#c9a84c]" />
                In-person, phone, or video
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#c9a84c]" />
                English &amp; Arabic specialists
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="py-16 sm:py-20 bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-sm"
            >
              <h2 className="font-display text-2xl text-[#0a2540]">
                Choose a date &amp; time
              </h2>
              <p className="mt-1 text-sm text-[#6b7e96]">
                We&apos;ll confirm the exact slot by WhatsApp or email within
                one business hour.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2b3c] mb-1.5">
                    Preferred date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7e96] pointer-events-none" />
                    <Input
                      type="date"
                      min={dateLimits.min}
                      max={dateLimits.max}
                      {...register("preferredDate")}
                      className="pl-9"
                    />
                  </div>
                  {errors.preferredDate && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.preferredDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1a2b3c] mb-1.5">
                    Preferred time (GST)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TIME_SLOTS.map((t) => {
                      const active = timeValue === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() =>
                            setValue("preferredTime", t, {
                              shouldValidate: true,
                            })
                          }
                          className={
                            "h-9 rounded-md text-xs font-medium border transition-colors " +
                            (active
                              ? "bg-[#0a2540] border-[#0a2540] text-white"
                              : "bg-white border-border text-[#1a2b3c] hover:border-[#c9a84c]")
                          }
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  {errors.preferredTime && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.preferredTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-[#1a2b3c] mb-1.5">
                  Where would you like to meet?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LOCATIONS.map((l) => {
                    const Icon = l.icon;
                    const active = locationValue === l.value;
                    return (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() =>
                          setValue("location", l.value, {
                            shouldValidate: true,
                          })
                        }
                        className={
                          "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors " +
                          (active
                            ? "border-[#c9a84c] bg-[#fff8e8]"
                            : "border-border bg-white hover:border-[#c9a84c]/60")
                        }
                      >
                        <Icon
                          className={
                            "h-4 w-4 " +
                            (active ? "text-[#b6962f]" : "text-[#6b7e96]")
                          }
                        />
                        <span className="text-xs font-medium text-[#1a2b3c] leading-tight">
                          {l.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.location && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="font-display text-lg text-[#0a2540]">
                  Your details
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a2b3c] mb-1.5">
                      Full name
                    </label>
                    <Input
                      placeholder="Mohammed Al Falasi"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2b3c] mb-1.5">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2b3c] mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <Input
                      placeholder="+971 50 000 0000"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2b3c] mb-1.5">
                      Service of interest
                    </label>
                    <Select
                      value={serviceValue || ""}
                      onValueChange={(v) =>
                        setValue("serviceInterest", v ?? "", {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger>
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
                      <p className="text-xs text-red-600 mt-1">
                        {errors.serviceInterest.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#1a2b3c] mb-1.5">
                    Anything we should know in advance? (optional)
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Nationality, business activity, number of visas, target free zone, timeline…"
                    {...register("notes")}
                  />
                </div>
              </div>

              {dateValue && timeValue && (
                <div className="mt-6 rounded-xl bg-[#f5f7fb] border border-border p-4 text-sm text-[#1a2b3c]">
                  <div className="font-medium text-[#0a2540]">
                    Requested slot
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[#6b7e96]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateLong(dateValue)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {timeValue} GST
                    </span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <p className="mt-4 text-sm text-red-600">{errorMsg}</p>
              )}

              {submitted ? (
                <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-900 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600 shrink-0" />
                  <div>
                    <div className="font-medium">Appointment requested</div>
                    <div className="text-green-800/80">
                      A consultant will confirm your slot by WhatsApp or email
                      within one business hour.
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold h-11"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Request this appointment
                    </>
                  )}
                </Button>
              )}

              <p className="mt-3 text-xs text-[#6b7e96]">
                By submitting, you agree to be contacted about your enquiry.
                We never share your details with third parties.
              </p>
            </motion.form>

            {/* SIDEBAR */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="rounded-3xl border border-border bg-white p-6">
                <h3 className="font-display text-lg text-[#0a2540]">
                  Prefer to talk now?
                </h3>
                <p className="mt-1 text-sm text-[#6b7e96]">
                  Skip the form — message us on WhatsApp for an instant reply.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full rounded-md bg-[#25d366] hover:bg-[#1faa52] text-white text-sm font-medium h-10 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${phoneNumbers.abuDhabi.replace(/\s/g, "")}`}
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full rounded-md border border-[#0a2540] text-[#0a2540] text-sm font-medium h-10 hover:bg-[#0a2540] hover:text-white transition-colors"
                >
                  Call {phoneNumbers.abuDhabi}
                </a>
              </div>

              <div className="rounded-3xl border border-border bg-white p-6">
                <h3 className="font-display text-lg text-[#0a2540]">
                  What to expect
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-[#1a2b3c]">
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/15 text-[#b6962f] text-[11px] font-bold">
                      1
                    </span>
                    A 30-minute call to understand your business activity,
                    nationality, and goals.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/15 text-[#b6962f] text-[11px] font-bold">
                      2
                    </span>
                    A short-list of the right licence, free zone, and visa
                    structure for you.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/15 text-[#b6962f] text-[11px] font-bold">
                      3
                    </span>
                    A written cost estimate and a step-by-step plan — emailed
                    the same day.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl bg-[#0a2540] text-white p-6">
                <h3 className="font-display text-lg">Office hours</h3>
                <p className="mt-2 text-sm text-white/70">
                  Sunday – Thursday
                  <br />
                  09:00 – 18:00 GST
                </p>
                <p className="mt-2 text-xs text-white/50">
                  Friday &amp; Saturday: WhatsApp only.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </>
  );
}
