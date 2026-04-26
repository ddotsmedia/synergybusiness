"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, LayoutGrid, Rows3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StageBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import type { AdminApplication } from "@/lib/admin/mock";

const STAGES = [
  { key: "draft", label: "Draft" },
  { key: "documents_pending", label: "Documents pending" },
  { key: "submitted", label: "Submitted" },
  { key: "processing", label: "Processing" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
] as const;

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ApplicationsBoard({
  applications,
}: {
  applications: AdminApplication[];
}) {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return applications;
    return applications.filter(
      (a) =>
        a.serviceLabel.toLowerCase().includes(term) ||
        a.primaryContact.toLowerCase().includes(term) ||
        a.assignedToName.toLowerCase().includes(term),
    );
  }, [applications, q]);

  const columns = useMemo(() => {
    const map = new Map<string, AdminApplication[]>();
    for (const stage of STAGES) map.set(stage.key, []);
    for (const a of filtered) {
      const existing = map.get(a.stage);
      if (existing) existing.push(a);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7e96]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search service, contact, assignee..."
            className="pl-9"
            aria-label="Search applications"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-white p-0.5">
            <button
              type="button"
              onClick={() => setView("kanban")}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1",
                view === "kanban"
                  ? "bg-[#0a2540] text-white"
                  : "text-[#1a2b3c] hover:bg-[#f8f9fc]",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1",
                view === "table"
                  ? "bg-[#0a2540] text-white"
                  : "text-[#1a2b3c] hover:bg-[#f8f9fc]",
              )}
            >
              <Rows3 className="h-3.5 w-3.5" />
              Table
            </button>
          </div>
          <Button
            render={<a href="/api/admin/applications/export" download />}
            variant="outline"
            size="sm"
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <p className="text-xs text-[#6b7e96]">
        Showing <span className="font-semibold text-[#0a2540]">{filtered.length}</span>{" "}
        of {applications.length} applications
      </p>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {STAGES.filter((s) => s.key !== "rejected").map((stage) => {
            const items = columns.get(stage.key) ?? [];
            return (
              <div
                key={stage.key}
                className="rounded-xl bg-[#f8f9fc] border border-border p-3 min-h-[200px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#6b7e96]">
                    {stage.label}
                  </p>
                  <span className="text-xs text-[#6b7e96] tabular-nums">
                    {items.length}
                  </span>
                </div>
                <ul className="space-y-2">
                  {items.length === 0 ? (
                    <li className="text-xs text-[#6b7e96] italic px-1">
                      Empty
                    </li>
                  ) : (
                    items.map((a) => (
                      <li key={a.id}>
                        <Link
                          href={`/admin/applications/${a.id}`}
                          className="block rounded-lg bg-white border border-border p-3 hover:border-[#c9a84c] hover:shadow-sm transition-all"
                        >
                          <p className="text-sm font-medium text-[#0a2540] line-clamp-2">
                            {a.serviceLabel}
                          </p>
                          <p className="text-xs text-[#6b7e96] mt-1">
                            {a.primaryContact}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-[#6b7e96]">
                            <span>{a.assignedToName}</span>
                            <span>ETA {formatDate(a.estimatedCompletion)}</span>
                          </div>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f9fc] border-b border-border text-left text-xs uppercase tracking-wide text-[#6b7e96]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                    Contact
                  </th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">
                    Assigned to
                  </th>
                  <th className="px-5 py-3 font-semibold">Stage</th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">
                    ETA
                  </th>
                  <th className="px-5 py-3 font-semibold hidden lg:table-cell">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-[#f8f9fc] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/applications/${a.id}`}
                        className="font-medium text-[#0a2540] hover:text-[#c9a84c]"
                      >
                        {a.serviceLabel}
                      </Link>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-[#1a2b3c]">
                      {a.primaryContact}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#6b7e96]">
                      {a.assignedToName}
                    </td>
                    <td className="px-5 py-3">
                      <StageBadge stage={a.stage} />
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-xs text-[#6b7e96] whitespace-nowrap">
                      {formatDate(a.estimatedCompletion)}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-xs text-[#6b7e96] whitespace-nowrap">
                      {formatDate(a.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-[#6b7e96]">
              No applications match.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
