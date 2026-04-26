import { cn } from "@/lib/utils";

const LEAD_TONES: Record<string, string> = {
  new: "bg-sky-50 text-sky-800 border-sky-200",
  contacted: "bg-indigo-50 text-indigo-800 border-indigo-200",
  qualified: "bg-amber-50 text-amber-800 border-amber-200",
  converted: "bg-emerald-50 text-emerald-800 border-emerald-200",
  lost: "bg-zinc-100 text-zinc-700 border-zinc-300",
};

const STAGE_TONES: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
  documents_pending: "bg-amber-50 text-amber-800 border-amber-200",
  submitted: "bg-sky-50 text-sky-800 border-sky-200",
  processing: "bg-indigo-50 text-indigo-800 border-indigo-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-800 border-red-200",
};

const INVOICE_TONES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
  due: "bg-amber-50 text-amber-800 border-amber-200",
  overdue: "bg-red-50 text-red-800 border-red-200",
  draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export function LeadStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
        LEAD_TONES[status] ?? LEAD_TONES.new,
      )}
    >
      {status}
    </span>
  );
}

export function StageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        STAGE_TONES[stage] ?? STAGE_TONES.draft,
      )}
    >
      {stage.replace("_", " ")}
    </span>
  );
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
        INVOICE_TONES[status] ?? INVOICE_TONES.draft,
      )}
    >
      {status}
    </span>
  );
}
