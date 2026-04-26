"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Copy, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateLeadStatus } from "@/lib/admin/actions";
import type { AdminLead } from "@/lib/admin/mock";

const STATUSES = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
] as const;

export function LeadStatusChanger({ lead }: { lead: AdminLead }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function setStatus(s: string) {
    if (s === lead.status) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      const res = await updateLeadStatus(lead.id, s);
      if (!res.ok) {
        alert(`Failed to update: ${res.error}`);
      } else {
        router.refresh();
      }
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
        Status: {lead.status}
        <ChevronDown className="ml-1 h-3.5 w-3.5" />
      </Button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-border bg-white shadow-lg z-20">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "w-full text-left flex items-center gap-2 px-3 py-2 text-sm capitalize hover:bg-[#f8f9fc]",
                s === lead.status && "text-[#c9a84c] font-semibold",
              )}
            >
              {s === lead.status ? (
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

export function AiDraftPanel({ lead }: { lead: AdminLead }) {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [source, setSource] = useState<"claude" | "fallback" | null>(null);
  const [prompt, setPrompt] = useState(
    "Draft a friendly follow-up email proposing a 30-minute discovery call.",
  );
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setDraft(null);
    try {
      const res = await fetch("/api/admin/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "lead.followup",
          lead: {
            name: lead.name,
            email: lead.email,
            serviceInterest: lead.serviceInterest,
            message: lead.message,
            source: lead.source,
            status: lead.status,
          },
          prompt,
        }),
      });
      const data = (await res.json()) as {
        draft: string;
        source: "claude" | "fallback";
      };
      setDraft(data.draft);
      setSource(data.source);
    } catch (err) {
      setDraft(
        "Sorry, the AI drafting service is unavailable right now. Try again in a minute.",
      );
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }

  function copyDraft() {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-2xl bg-[#0a2540] text-white p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#c9a84c]" />
          <p className="text-xs uppercase tracking-wider font-semibold text-[#c9a84c]">
            AI follow-up draft
          </p>
        </div>
        {source && (
          <span className="text-[10px] uppercase tracking-wider text-white/55">
            {source === "claude" ? "claude" : "rules-based"}
          </span>
        )}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        className="mt-3 w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#c9a84c]"
        placeholder="What should the email say?"
      />

      <div className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={generate}
          disabled={loading}
          className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              Drafting...
            </>
          ) : (
            <>
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {draft ? "Regenerate" : "Draft email"}
            </>
          )}
        </Button>
        {draft && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyDraft}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <Check className="mr-1 h-3.5 w-3.5" />
            ) : (
              <Copy className="mr-1 h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>

      {draft && (
        <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 text-sm leading-relaxed whitespace-pre-wrap text-white/85">
          {draft}
        </div>
      )}
    </div>
  );
}
