"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JsonField } from "@/components/admin/JsonField";
import { saveService } from "@/lib/admin/entity-actions";
import type { AdminServiceRow } from "@/lib/admin/entities";

export function ServiceEditor({ service }: { service: AdminServiceRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);

    let metricStrip: unknown;
    let features: unknown;
    let packages: unknown;
    let process: unknown;
    let faqs: unknown;
    let related: unknown;
    try {
      metricStrip = JSON.parse(String(fd.get("metricStrip") ?? "[]"));
      features = JSON.parse(String(fd.get("features") ?? "[]"));
      packages = JSON.parse(String(fd.get("packages") ?? "[]"));
      process = JSON.parse(String(fd.get("process") ?? "[]"));
      faqs = JSON.parse(String(fd.get("faqs") ?? "[]"));
      related = JSON.parse(String(fd.get("related") ?? "[]"));
    } catch (err) {
      setErrorMsg(
        "One of the JSON fields is malformed. Fix the highlighted field above.",
      );
      return;
    }

    const bullets = String(fd.get("bullets") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const startingPriceRaw = fd.get("startingPrice");
    const startingPrice =
      typeof startingPriceRaw === "string" && startingPriceRaw.trim()
        ? Number(startingPriceRaw)
        : undefined;

    const data = {
      slug: service.slug,
      hero: {
        eyebrow: String(fd.get("eyebrow") ?? ""),
        title: String(fd.get("heroTitle") ?? ""),
        titleHighlight: String(fd.get("heroTitleHighlight") ?? ""),
        description: String(fd.get("heroDescription") ?? ""),
        bullets,
        startingPrice,
        timelineDays: String(fd.get("timelineDays") ?? ""),
      },
      metricStrip,
      features,
      packages: Array.isArray(packages) ? packages : undefined,
      process,
      faqs,
      related,
      seo: {
        title: String(fd.get("seoTitle") ?? ""),
        description: String(fd.get("seoDescription") ?? ""),
      },
    };

    startTransition(async () => {
      const res = await saveService(service.slug, data);
      if (!res.ok) {
        setErrorMsg(res.error);
      } else {
        setSavedAt(new Date());
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section title="Hero">
        <Field
          name="eyebrow"
          label="Eyebrow"
          defaultValue={service.hero.eyebrow}
        />
        <Field
          name="heroTitle"
          label="Title — main"
          defaultValue={service.hero.title}
          help="The bit before the gold-highlighted word."
        />
        <Field
          name="heroTitleHighlight"
          label="Title — gold-highlighted word"
          defaultValue={service.hero.titleHighlight}
        />
        <Field
          name="heroDescription"
          label="Description"
          defaultValue={service.hero.description}
          textarea
          rows={4}
        />
        <Field
          name="bullets"
          label="Bullets"
          defaultValue={service.hero.bullets.join("\n")}
          textarea
          rows={5}
          help="One per line."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            name="startingPrice"
            label="Starting price (AED, blank = none)"
            type="number"
            defaultValue={service.hero.startingPrice?.toString() ?? ""}
          />
          <Field
            name="timelineDays"
            label="Timeline"
            defaultValue={service.hero.timelineDays}
          />
        </div>
      </Section>

      <Section title="SEO">
        <Field
          name="seoTitle"
          label="Page title"
          defaultValue={service.seo.title}
        />
        <Field
          name="seoDescription"
          label="Meta description"
          defaultValue={service.seo.description}
          textarea
          rows={2}
        />
      </Section>

      <Section title="Structured fields (JSON)" subtitle="Edit as JSON. Keep the existing structure — invalid JSON blocks the save.">
        <JsonField
          name="metricStrip"
          label="Metric strip (4 items)"
          initialValue={service.metricStrip}
          rows={10}
          help="Array of { label, value }"
        />
        <JsonField
          name="features"
          label="Features"
          initialValue={service.features}
          rows={16}
          help='Array of { icon, title, body }. icon: "shield" | "globe" | "target" | "stamp" | "key" | "rocket" | "users" | "clock" | "wallet" | "sparkles".'
        />
        <JsonField
          name="packages"
          label="Packages (optional)"
          initialValue={service.packages ?? []}
          rows={20}
          help="Array of { name, tagline, priceFromAed, priceNote, features[], highlight, cta }. Empty array hides the section."
        />
        <JsonField
          name="process"
          label="Process steps"
          initialValue={service.process}
          rows={14}
          help="Array of { title, body, durationDays }."
        />
        <JsonField
          name="faqs"
          label="FAQs"
          initialValue={service.faqs}
          rows={14}
          help="Array of { q, a }."
        />
        <JsonField
          name="related"
          label="Related services"
          initialValue={service.related}
          rows={4}
          help='Array of slug strings, e.g. ["mainland", "free-zone"].'
        />
      </Section>

      <div className="sticky bottom-4 z-10 rounded-2xl bg-[#0a2540] text-white p-4 shadow-lg flex items-center justify-between gap-4">
        <div className="text-sm text-white/85">
          {errorMsg ? (
            <span className="text-red-300">{errorMsg}</span>
          ) : savedAt ? (
            <span className="inline-flex items-center gap-1.5 text-[#e8c96b]">
              <Check className="h-4 w-4" />
              Saved at {savedAt.toLocaleTimeString()}
            </span>
          ) : (
            <span>
              Saving overrides the in-repo seed for this service slug.
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
        >
          {pending ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-4 w-4" />
              Save service
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white border border-border p-6">
      <header className="border-b border-border pb-4 mb-5">
        <h2 className="font-display text-xl text-[#0a2540]">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[#6b7e96]">{subtitle}</p>
        )}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  name,
  label,
  defaultValue,
  textarea = false,
  rows = 3,
  type = "text",
  help,
}: {
  name: string;
  label: string;
  defaultValue: string;
  textarea?: boolean;
  rows?: number;
  type?: string;
  help?: string;
}) {
  return (
    <div>
      <label
        htmlFor={`f-${name}`}
        className="block text-sm font-medium text-[#0a2540]"
      >
        {label}
      </label>
      {help && <p className="mt-0.5 text-xs text-[#6b7e96]">{help}</p>}
      {textarea ? (
        <Textarea
          id={`f-${name}`}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          className="mt-1.5 resize-y"
        />
      ) : (
        <Input
          id={`f-${name}`}
          name={name}
          type={type}
          defaultValue={defaultValue}
          className="mt-1.5"
        />
      )}
    </div>
  );
}
