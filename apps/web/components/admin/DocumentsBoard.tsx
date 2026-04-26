"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  bulkSetDocumentVerified,
  setDocumentVerified,
} from "@/lib/admin/actions";
import type { PortalDocument } from "@/lib/portal-mock-data";

const TYPE_LABEL: Record<string, string> = {
  passport: "Passport",
  emirates_id: "Emirates ID",
  visa: "Visa",
  noc: "NOC",
  moa: "MOA",
  bank_statement: "Bank statement",
  other: "Other",
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DocumentsBoard({
  documents,
}: {
  documents: PortalDocument[];
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return documents.filter((d) => {
      if (filter === "pending" && d.verified) return false;
      if (filter === "verified" && !d.verified) return false;
      if (!term) return true;
      return (
        d.name.toLowerCase().includes(term) ||
        d.applicationLabel.toLowerCase().includes(term) ||
        d.type.toLowerCase().includes(term)
      );
    });
  }, [documents, q, filter]);

  function toggle(id: string) {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((d) => d.id)));
    }
  }

  function singleVerify(id: string, verified: boolean) {
    startTransition(async () => {
      const res = await setDocumentVerified(id, verified);
      if (!res.ok) alert(`Failed: ${res.error}`);
      else router.refresh();
    });
  }

  function bulkVerify(verified: boolean) {
    if (selected.size === 0) return;
    startTransition(async () => {
      const res = await bulkSetDocumentVerified(
        Array.from(selected),
        verified,
      );
      if (!res.ok) alert(`Failed: ${res.error}`);
      else {
        setSelected(new Set());
        router.refresh();
      }
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
              placeholder="Search file name, application..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              label="All"
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            <FilterChip
              label="Pending"
              active={filter === "pending"}
              onClick={() => setFilter("pending")}
            />
            <FilterChip
              label="Verified"
              active={filter === "verified"}
              onClick={() => setFilter("verified")}
            />
          </div>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="rounded-xl bg-[#0a2540] text-white px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-sm">
            <strong>{selected.size}</strong> document
            {selected.size === 1 ? "" : "s"} selected
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => bulkVerify(true)}
              disabled={pending}
              className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
            >
              {pending ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              )}
              Verify
            </Button>
            <Button
              size="sm"
              onClick={() => bulkVerify(false)}
              disabled={pending}
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <XCircle className="mr-1 h-3.5 w-3.5" />
              Unverify
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-[#6b7e96]">
        Showing <span className="font-semibold text-[#0a2540]">{filtered.length}</span>{" "}
        of {documents.length} documents
      </p>

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fc] border-b border-border text-left text-xs uppercase tracking-wide text-[#6b7e96]">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 &&
                      selected.size === filtered.length
                    }
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-5 py-3 font-semibold">File</th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                  Type
                </th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">
                  Application
                </th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">
                  Uploaded
                </th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((doc) => {
                const isSelected = selected.has(doc.id);
                return (
                  <tr
                    key={doc.id}
                    className={cn(
                      "transition-colors",
                      isSelected ? "bg-[#c9a84c]/5" : "hover:bg-[#f8f9fc]",
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggle(doc.id)}
                        aria-label={`Select ${doc.name}`}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#0a2540]/5 text-[#0a2540] flex items-center justify-center flex-shrink-0">
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#0a2540] truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-[#6b7e96]">
                            {(doc.sizeKb / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-[#6b7e96]">
                      {TYPE_LABEL[doc.type] ?? doc.type}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#6b7e96]">
                      {doc.applicationLabel}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-xs text-[#6b7e96] whitespace-nowrap">
                      {formatDate(doc.uploadedAt)}
                    </td>
                    <td className="px-5 py-3">
                      {doc.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-800 border-amber-200">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => singleVerify(doc.id, !doc.verified)}
                        disabled={pending}
                        className="text-xs font-semibold text-[#0a2540] hover:text-[#c9a84c]"
                      >
                        {doc.verified ? "Unverify" : "Verify"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[#6b7e96]">
            No documents match.
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
        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
        active
          ? "bg-[#0a2540] text-white border-[#0a2540]"
          : "bg-white text-[#1a2b3c] border-border hover:border-[#c9a84c]",
      )}
    >
      {label}
    </button>
  );
}
