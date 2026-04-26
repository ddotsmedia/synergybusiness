"use client";

import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight JSON editor: a textarea with live validation. Used for the
 * deeply-nested array fields where a custom UI would balloon the form.
 *
 * The form's hidden input is what gets submitted; the visible textarea
 * stays in sync as long as the JSON parses. Bad JSON disables submit
 * (visually + via the invalid state — actual prevention is the parent's
 * job because a hidden input always submits its last value).
 */
export function JsonField({
  name,
  label,
  initialValue,
  rows = 14,
  help,
}: {
  name: string;
  label: string;
  initialValue: unknown;
  rows?: number;
  help?: string;
}) {
  const [text, setText] = useState(() =>
    JSON.stringify(initialValue ?? null, null, 2),
  );
  const [hidden, setHidden] = useState(text);
  const [error, setError] = useState<string | null>(null);

  function onChange(next: string) {
    setText(next);
    try {
      JSON.parse(next);
      setError(null);
      setHidden(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#0a2540]">
        {label}
      </label>
      {help && <p className="mt-0.5 text-xs text-[#6b7e96]">{help}</p>}
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        spellCheck={false}
        className={cn(
          "mt-1.5 w-full font-mono text-xs rounded-lg border bg-white px-3 py-2 text-[#0a2540] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]",
          error ? "border-red-300" : "border-border",
        )}
      />
      <input type="hidden" name={name} value={hidden} />
      <div
        className={cn(
          "mt-1 text-xs flex items-center gap-1.5",
          error ? "text-red-700" : "text-emerald-700",
        )}
      >
        {error ? (
          <>
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>JSON error: {error}</span>
          </>
        ) : (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Valid JSON</span>
          </>
        )}
      </div>
    </div>
  );
}
