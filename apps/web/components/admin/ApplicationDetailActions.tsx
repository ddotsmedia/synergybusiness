"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  addApplicationNote,
  updateApplicationStage,
} from "@/lib/admin/actions";
import type { AdminApplication } from "@/lib/admin/mock";

const STAGES = [
  "draft",
  "documents_pending",
  "submitted",
  "processing",
  "approved",
  "rejected",
] as const;

export function StageChanger({ app }: { app: AdminApplication }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function setStage(s: string) {
    if (s === app.stage) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      const res = await updateApplicationStage(app.id, s);
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
        Stage: {app.stage.replace("_", " ")}
        <ChevronDown className="ml-1 h-3.5 w-3.5" />
      </Button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-lg border border-border bg-white shadow-lg z-20">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={cn(
                "w-full text-left flex items-center gap-2 px-3 py-2 text-sm capitalize hover:bg-[#f8f9fc]",
                s === app.stage && "text-[#c9a84c] font-semibold",
              )}
            >
              {s === app.stage ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="w-3.5" />
              )}
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NoteAdder({ app }: { app: AdminApplication }) {
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    if (!text.trim()) return;
    startTransition(async () => {
      const res = await addApplicationNote(app.id, text.trim());
      if (!res.ok) {
        alert(`Failed: ${res.error}`);
        return;
      }
      setText("");
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl bg-white border border-border p-5">
      <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
        Add note
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Visible to teammates only. Be specific — what was done, what's next, who's blocking?"
        className="mt-3 resize-none"
      />
      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={!text.trim() || pending}
          className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
        >
          {pending ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="mr-1 h-3.5 w-3.5" />
          )}
          Add note
        </Button>
      </div>
    </div>
  );
}

export function AiSummarizePanel({ app }: { app: AdminApplication }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [source, setSource] = useState<"claude" | "fallback" | null>(null);

  async function generate() {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch("/api/admin/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationLabel: app.serviceLabel,
          stage: app.stage,
          notes: app.notes,
          ageDays: Math.round(
            (Date.now() - new Date(app.createdAt).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        }),
      });
      const data = (await res.json()) as {
        summary: string;
        source: "claude" | "fallback";
      };
      setSummary(data.summary);
      setSource(data.source);
    } catch {
      setSummary("Summary unavailable right now.");
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-[#0a2540] text-white p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#c9a84c]" />
          <p className="text-xs uppercase tracking-wider font-semibold text-[#c9a84c]">
            AI handover summary
          </p>
        </div>
        {source && (
          <span className="text-[10px] uppercase tracking-wider text-white/55">
            {source === "claude" ? "claude" : "rules-based"}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-white/65">
        Generates a 2-3 sentence brief for whoever picks up this application.
      </p>
      <div className="mt-3 flex gap-2">
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
              Summarising...
            </>
          ) : (
            <>
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {summary ? "Regenerate" : "Generate summary"}
            </>
          )}
        </Button>
      </div>
      {summary && (
        <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 text-sm leading-relaxed text-white/85">
          {summary}
        </div>
      )}
    </div>
  );
}
