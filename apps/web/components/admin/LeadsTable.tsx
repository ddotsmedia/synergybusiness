"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadStatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import type { AdminLead } from "@/lib/admin/mock";

type SortKey = "createdAt" | "name" | "status";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
] as const;

const SERVICE_LABELS: Record<string, string> = {
  mainland: "Mainland",
  "free-zone": "Free Zone",
  offshore: "Offshore",
  "pro-services": "PRO Services",
  visa: "Visa",
  "golden-visa": "Golden Visa",
  other: "Other",
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function LeadsTable({ leads }: { leads: AdminLead[] }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (!term) return true;
      return (
        l.name.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        l.phone.includes(term) ||
        (l.message ?? "").toLowerCase().includes(term)
      );
    });
  }, [leads, q, statusFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "createdAt")
        cmp = a.createdAt.getTime() - b.createdAt.getTime();
      else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "status")
        cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
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
              placeholder="Search name, email, phone, message..."
              className="pl-9"
              aria-label="Search leads"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              label="All"
              active={statusFilter === null}
              onClick={() => setStatusFilter(null)}
            />
            {STATUS_OPTIONS.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={statusFilter === s}
                onClick={() => setStatusFilter(statusFilter === s ? null : s)}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            render={<a href="/api/admin/leads/export" download />}
            variant="outline"
            size="sm"
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <p className="text-xs text-[#6b7e96]">
        Showing <span className="font-semibold text-[#0a2540]">{sorted.length}</span> of{" "}
        {leads.length} leads
      </p>

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fc] border-b border-border text-left text-xs uppercase tracking-wide text-[#6b7e96]">
              <tr>
                <Th onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir}>
                  Name
                </Th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Contact</th>
                <th className="px-5 py-3 font-semibold hidden lg:table-cell">Service</th>
                <Th onClick={() => toggleSort("status")} active={sortKey === "status"} dir={sortDir}>
                  Status
                </Th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Source</th>
                <Th onClick={() => toggleSort("createdAt")} active={sortKey === "createdAt"} dir={sortDir}>
                  Captured
                </Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((l) => (
                <tr
                  key={l.id}
                  className="hover:bg-[#f8f9fc] transition-colors"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="font-medium text-[#0a2540] hover:text-[#c9a84c]"
                    >
                      {l.name}
                    </Link>
                    {l.message && (
                      <p className="text-xs text-[#6b7e96] mt-0.5 line-clamp-1 max-w-md">
                        {l.message}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <p className="text-[#0a2540]">{l.email}</p>
                    <p className="text-xs text-[#6b7e96]">{l.phone}</p>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-[#1a2b3c]">
                    {SERVICE_LABELS[l.serviceInterest] ?? l.serviceInterest}
                  </td>
                  <td className="px-5 py-3">
                    <LeadStatusBadge status={l.status} />
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-xs text-[#6b7e96] capitalize">
                    {l.source}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#6b7e96] whitespace-nowrap">
                    {formatDate(l.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[#6b7e96]">
            No leads match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
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

function Th({
  children,
  onClick,
  active,
  dir,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: SortDir;
}) {
  return (
    <th className="px-5 py-3 font-semibold">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 hover:text-[#0a2540]",
          active ? "text-[#0a2540]" : "",
        )}
      >
        {children}
        <ArrowUpDown
          className={cn(
            "h-3 w-3",
            active ? "opacity-100" : "opacity-30",
            active && dir === "asc" ? "rotate-180" : "",
          )}
        />
      </button>
    </th>
  );
}
