"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateInvoiceStatus } from "@/lib/admin/actions";
import type { PortalInvoice } from "@/lib/portal-mock-data";

const STATUSES = ["draft", "due", "paid", "overdue"] as const;

export function InvoiceStatusChanger({ invoice }: { invoice: PortalInvoice }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function setStatus(s: string) {
    if (s === invoice.status) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      const res = await updateInvoiceStatus(invoice.id, s);
      if (!res.ok) alert(`Failed: ${res.error}`);
      else router.refresh();
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className="capitalize"
      >
        {pending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
        Status: {invoice.status}
        <ChevronDown className="ml-1 h-3.5 w-3.5" />
      </Button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-lg border border-border bg-white shadow-lg z-20">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "w-full text-left flex items-center gap-2 px-3 py-2 text-sm capitalize hover:bg-[#f8f9fc]",
                s === invoice.status && "text-[#c9a84c] font-semibold",
              )}
            >
              {s === invoice.status ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="w-3.5" />
              )}
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
