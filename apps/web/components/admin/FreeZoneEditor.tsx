"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save } from "lucide-react";
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
import { saveFreeZone } from "@/lib/admin/entity-actions";
import type { AdminFreeZoneRow } from "@/lib/admin/entities";

const CATEGORIES = [
  "Finance & Holding",
  "Industrial & Logistics",
  "Media & Tech",
  "Sustainability",
  "General SME",
  "Aviation",
] as const;

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ras Al Khaimah",
  "Umm Al Quwain",
  "Fujairah",
  "Ajman",
] as const;

const BANK_RATINGS = ["Excellent", "Strong", "Good", "Variable"] as const;

export function FreeZoneEditor({ zone }: { zone: AdminFreeZoneRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Local state for select fields (uncontrolled inputs don't survive refresh).
  const [emirate, setEmirate] = useState<string>(zone.emirate);
  const [category, setCategory] = useState<string>(zone.category);
  const [bank, setBank] = useState<string>(zone.bankFriendliness);
  const [officeRequired, setOfficeRequired] = useState(zone.officeRequired);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);

    const industries = String(fd.get("industries") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const highlights = String(fd.get("highlights") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
      id: zone.id,
      short: String(fd.get("short") ?? "").trim(),
      name: String(fd.get("name") ?? "").trim(),
      emirate,
      category,
      pitch: String(fd.get("pitch") ?? "").trim(),
      industries,
      highlights,
      startingCostAed: Number(fd.get("startingCostAed") ?? 0),
      visaQuotaFromOffice: String(fd.get("visaQuota") ?? "").trim(),
      officeRequired,
      foreignOwnership: Number(fd.get("foreignOwnership") ?? 100),
      bankFriendliness: bank,
      setupTime: String(fd.get("setupTime") ?? "").trim(),
    };

    startTransition(async () => {
      const res = await saveFreeZone(zone.id, data);
      if (!res.ok) setErrorMsg(res.error);
      else {
        setSavedAt(new Date());
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Section title="Identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            name="short"
            label="Short name"
            defaultValue={zone.short}
            required
          />
          <Field
            name="name"
            label="Full name"
            defaultValue={zone.name}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            label="Emirate"
            value={emirate}
            onChange={setEmirate}
            options={EMIRATES}
          />
          <SelectField
            label="Category"
            value={category}
            onChange={setCategory}
            options={CATEGORIES}
          />
        </div>
      </Section>

      <Section title="Pitch & details">
        <Field
          name="pitch"
          label="Pitch (one paragraph)"
          defaultValue={zone.pitch}
          textarea
          rows={3}
        />
        <Field
          name="industries"
          label="Industries"
          defaultValue={zone.industries.join("\n")}
          textarea
          rows={5}
          help="One per line."
        />
        <Field
          name="highlights"
          label="Highlights"
          defaultValue={zone.highlights.join("\n")}
          textarea
          rows={5}
          help="One per line."
        />
      </Section>

      <Section title="Costs & quota">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            name="startingCostAed"
            label="Starting cost (AED)"
            type="number"
            defaultValue={zone.startingCostAed.toString()}
          />
          <Field
            name="setupTime"
            label="Setup time"
            defaultValue={zone.setupTime}
          />
        </div>
        <Field
          name="visaQuota"
          label="Visa quota from office"
          defaultValue={zone.visaQuotaFromOffice}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field
            name="foreignOwnership"
            label="Foreign ownership (%)"
            type="number"
            defaultValue={zone.foreignOwnership.toString()}
          />
          <SelectField
            label="Banking acceptance"
            value={bank}
            onChange={setBank}
            options={BANK_RATINGS}
          />
          <div>
            <label className="block text-sm font-medium text-[#0a2540]">
              Office required?
            </label>
            <label className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={officeRequired}
                onChange={(e) => setOfficeRequired(e.target.checked)}
              />
              <span className="text-sm text-[#1a2b3c]">
                Yes, dedicated office required
              </span>
            </label>
          </div>
        </div>
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
          ) : null}
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
              Save zone
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white border border-border p-6">
      <header className="border-b border-border pb-4 mb-5">
        <h2 className="font-display text-xl text-[#0a2540]">{title}</h2>
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
  required = false,
  help,
}: {
  name: string;
  label: string;
  defaultValue: string;
  textarea?: boolean;
  rows?: number;
  type?: string;
  required?: boolean;
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
          required={required}
          className="mt-1.5 resize-y"
        />
      ) : (
        <Input
          id={`f-${name}`}
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          className="mt-1.5"
        />
      )}
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0a2540]">
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(v) => v && onChange(v as T)}
      >
        <SelectTrigger className="mt-1.5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
