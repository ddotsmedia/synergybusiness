"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/admin/CommandPalette";
import type { AdminLead } from "@/lib/admin/mock";
import type { AdminApplication } from "@/lib/admin/mock";

type Props = {
  actor: { name: string | null; role: string };
  clerkConfigured: boolean;
  searchData: {
    leads: Pick<AdminLead, "id" | "name" | "email" | "status">[];
    applications: Pick<
      AdminApplication,
      "id" | "serviceLabel" | "primaryContact" | "stage"
    >[];
  };
};

export function AdminTopbar({ actor, clerkConfigured, searchData }: Props) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
      if (ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-6">
          <div className="lg:hidden font-display text-xl text-[#0a2540]">
            Synergy Admin
          </div>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 max-w-md flex-1 mx-6 px-3 py-1.5 rounded-lg border border-border bg-[#f8f9fc] text-sm text-[#6b7e96] hover:border-[#c9a84c] transition-colors"
            aria-label="Open command palette"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">
              Search leads, applications, actions…
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#6b7e96]">
              {isMac ? "⌘" : "Ctrl"}+K
            </kbd>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-[#6b7e96]">Signed in as</span>
              <span className="text-[#0a2540] font-semibold">
                {actor.name ?? "Admin"}
              </span>
              <span className="text-[10px] uppercase tracking-wider rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 text-[#0a2540] px-2 py-0.5 font-semibold">
                {actor.role}
              </span>
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaletteOpen(true)}
              className="md:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {clerkConfigured ? (
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: { avatarBox: "h-9 w-9" },
                  }}
                />
              </Show>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900">
                Demo mode
              </span>
            )}
          </div>
        </div>
      </header>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        data={searchData}
      />
    </>
  );
}
