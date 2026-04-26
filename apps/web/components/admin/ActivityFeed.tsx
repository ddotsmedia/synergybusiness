import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  FileCheck,
  Inbox,
  Receipt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { AdminActivity } from "@/lib/admin/mock";

const ICON: Record<string, LucideIcon> = {
  "lead.created": Inbox,
  "lead.status_change": Inbox,
  "application.stage_change": Briefcase,
  "application.note_added": Briefcase,
  "document.verified": FileCheck,
  "document.unverified": FileCheck,
  "document.bulk_verified": CheckCircle2,
  "invoice.created": Receipt,
  "invoice.marked_paid": Receipt,
  "invoice.status_change": Receipt,
};

const LABEL: Record<string, string> = {
  "lead.created": "New lead captured",
  "lead.status_change": "Lead status changed",
  "application.stage_change": "Application stage changed",
  "application.note_added": "Note added to application",
  "document.verified": "Document verified",
  "document.unverified": "Document marked unverified",
  "document.bulk_verified": "Documents bulk verified",
  "invoice.created": "Invoice created",
  "invoice.marked_paid": "Invoice marked paid",
  "invoice.status_change": "Invoice status changed",
};

function entityLink(activity: AdminActivity): string | null {
  if (!activity.entityId) return null;
  switch (activity.entityType) {
    case "lead":
      return `/admin/leads/${activity.entityId}`;
    case "application":
      return `/admin/applications/${activity.entityId}`;
    case "invoice":
      return `/admin/invoices/${activity.entityId}`;
    default:
      return null;
  }
}

function timeAgo(date: Date): string {
  const sec = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}

function describe(a: AdminActivity): string {
  if (a.action === "lead.status_change") {
    const from = String(a.metadata?.from ?? "—");
    const to = String(a.metadata?.to ?? "—");
    return `${from} -> ${to}`;
  }
  if (a.action === "application.stage_change") {
    const from = String(a.metadata?.from ?? "—").replace("_", " ");
    const to = String(a.metadata?.to ?? "—").replace("_", " ");
    return `${from} -> ${to}`;
  }
  if (a.action === "invoice.marked_paid") {
    return `AED ${Number(a.metadata?.amountAed ?? 0).toLocaleString()}`;
  }
  if (a.action === "invoice.created") {
    return `AED ${Number(a.metadata?.amountAed ?? 0).toLocaleString()} · ${a.metadata?.number ?? ""}`;
  }
  if (a.action === "lead.created") {
    return `via ${a.metadata?.source ?? "unknown"}`;
  }
  if (a.action === "document.verified" || a.action === "document.unverified") {
    return String(a.metadata?.name ?? "");
  }
  return "";
}

export function ActivityFeed({
  items,
  emptyText = "No activity yet.",
}: {
  items: AdminActivity[];
  emptyText?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-6 text-sm text-[#6b7e96] text-center">
        {emptyText}
      </div>
    );
  }
  return (
    <ol className="divide-y divide-border">
      {items.map((a) => {
        const Icon = ICON[a.action] ?? Sparkles;
        const link = entityLink(a);
        const detail = describe(a);
        const inner = (
          <div className="flex items-start gap-3 py-3">
            <div className="h-8 w-8 rounded-full bg-[#0a2540]/5 flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-[#0a2540]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#0a2540]">
                <span className="font-medium">
                  {a.actorName ?? "System"}
                </span>{" "}
                <span className="text-[#6b7e96]">·</span>{" "}
                <span>{LABEL[a.action] ?? a.action}</span>
              </p>
              {detail && (
                <p className="text-xs text-[#6b7e96] mt-0.5">{detail}</p>
              )}
            </div>
            <span className="text-xs text-[#6b7e96] whitespace-nowrap">
              {timeAgo(a.createdAt)}
            </span>
          </div>
        );

        return (
          <li key={a.id}>
            {link ? (
              <Link
                href={link}
                className="block hover:bg-[#f8f9fc] -mx-3 px-3 transition-colors"
              >
                {inner}
              </Link>
            ) : (
              <div className="-mx-3 px-3">{inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
