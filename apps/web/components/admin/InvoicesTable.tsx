"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceStatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import { updateInvoiceStatus } from "@/lib/admin/actions";
import type { PortalInvoice } from "@/lib/portal-mock-data";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function InvoicesTable({
  invoices,
}: {
  invoices: PortalInvoice[];
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return invoices.filter((i) => {
      if (filter && i.status !== filter) return false;
      if (!term) return true;
      return (
        i.number.toLowerCase().includes(term) ||
        i.applicationLabel.toLowerCase().includes(term)
      );
    });
  }, [invoices, q, filter]);

  function markPaid(id: string) {
    startTransition(async () => {
      const res = await updateInvoiceStatus(id, "paid");
      if (!res.ok) alert(`Failed: ${res.error}`);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7e96]" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search number or application..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip
              label="All"
              active={filter === null}
              onClick={() => setFilter(null)}
            />
            {(["due", "paid", "overdue", "draft"] as const).map((s) => (
              <Chip
                key={s}
                label={s}
                active={filter === s}
                onClick={() => setFilter(filter === s ? null : s)}
              />
            ))}
          </div>
        </div>
        <Button
          render={<Link href="/admin/invoices/new" />}
          size="sm"
          className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          New invoice
        </Button>
      </div>

      <p className="text-xs text-[#6b7e96]">
        Showing <span className="font-semibold text-[#0a2540]">{filtered.length}</span>{" "}
        of {invoices.length} invoices
      </p>

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fc] border-b border-border text-left text-xs uppercase tracking-wide text-[#6b7e96]">
              <tr>
                <th className="px-5 py-3 font-semibold">Number</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">
                  Application
                </th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                  Issued
                </th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                  Due
                </th>
                <th className="px-5 py-3 font-semibold text-right">
                  Amount
                </th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#f8f9fc] transition-colors">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="font-medium text-[#0a2540] hover:text-[#c9a84c]"
                    >
                      {inv.number}
                    </Link>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-[#6b7e96]">
                    {inv.applicationLabel}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-xs text-[#6b7e96] whitespace-nowrap">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-xs text-[#6b7e96] whitespace-nowrap">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-[#0a2540] whitespace-nowrap">
                    AED {inv.amountAed.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-3">
                    {inv.status !== "paid" && (
                      <button
                        type="button"
                        onClick={() => markPaid(inv.id)}
                        disabled={pending}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        {pending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[#6b7e96]">
            No invoices match.
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border capitalize",
        active
          ? "bg-[#0a2540] text-white border-[#0a2540]"
          : "bg-white text-[#1a2b3c] border-border hover:border-[#c9a84c]",
      )}
    >
      {label}
    </button>
  );
}
