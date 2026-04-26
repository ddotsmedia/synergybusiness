"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CornerDownLeft,
  Inbox,
  LayoutDashboard,
  Receipt,
  Search,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminApplication, AdminLead } from "@/lib/admin/mock";

type CommandItem = {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  icon: typeof Inbox;
  href: string;
  keywords: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    leads: Pick<AdminLead, "id" | "name" | "email" | "status">[];
    applications: Pick<
      AdminApplication,
      "id" | "serviceLabel" | "primaryContact" | "stage"
    >[];
  };
};

const QUICK_NAV: CommandItem[] = [
  {
    id: "nav-dashboard",
    group: "Navigate",
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    keywords: "home overview kpi",
  },
  {
    id: "nav-leads",
    group: "Navigate",
    title: "Leads",
    icon: Inbox,
    href: "/admin/leads",
    keywords: "prospects pipeline new",
  },
  {
    id: "nav-applications",
    group: "Navigate",
    title: "Applications",
    icon: Users,
    href: "/admin/applications",
    keywords: "kanban work in progress",
  },
  {
    id: "nav-invoices",
    group: "Navigate",
    title: "Invoices",
    icon: Receipt,
    href: "/admin/invoices",
    keywords: "billing payments revenue",
  },
];

export function CommandPalette({ open, onOpenChange, data }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    const leads: CommandItem[] = data.leads.map((l) => ({
      id: `lead-${l.id}`,
      group: "Leads",
      title: l.name,
      subtitle: `${l.email} · ${l.status}`,
      icon: Inbox,
      href: `/admin/leads/${l.id}`,
      keywords: `${l.name} ${l.email} ${l.status} lead`.toLowerCase(),
    }));
    const apps: CommandItem[] = data.applications.map((a) => ({
      id: `app-${a.id}`,
      group: "Applications",
      title: a.serviceLabel,
      subtitle: `${a.primaryContact} · ${a.stage.replace("_", " ")}`,
      icon: Users,
      href: `/admin/applications/${a.id}`,
      keywords: `${a.serviceLabel} ${a.primaryContact} ${a.stage} application`.toLowerCase(),
    }));
    return [...QUICK_NAV, ...leads, ...apps];
  }, [data]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(term) ||
        i.subtitle?.toLowerCase().includes(term) ||
        i.keywords.includes(term),
    );
  }, [items, q]);

  function go(item: CommandItem) {
    onOpenChange(false);
    router.push(item.href);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[active];
      if (target) go(target);
    }
  }

  // Group items for display
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered.slice(0, 25)) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-[#0a2540]/40 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-[12vh] left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-2xl rounded-2xl bg-white shadow-2xl border border-border overflow-hidden"
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-[#6b7e96]" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKey}
                placeholder="Search leads, applications, navigate..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-[#6b7e96]"
              />
              <button
                onClick={() => onOpenChange(false)}
                className="text-[#6b7e96] hover:text-[#0a2540]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {grouped.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-[#6b7e96]">
                  No matches.
                </div>
              ) : (
                grouped.map(([group, groupItems]) => (
                  <div key={group} className="py-1.5">
                    <div className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-wider font-semibold text-[#6b7e96]">
                      {group}
                    </div>
                    {groupItems.map((item) => {
                      const isActive = filtered[active]?.id === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onMouseEnter={() => {
                            const idx = filtered.findIndex(
                              (i) => i.id === item.id,
                            );
                            if (idx >= 0) setActive(idx);
                          }}
                          onClick={() => go(item)}
                          className={cn(
                            "w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm",
                            isActive ? "bg-[#0a2540] text-white" : "hover:bg-[#f8f9fc]",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 flex-shrink-0",
                              isActive
                                ? "text-[#c9a84c]"
                                : "text-[#6b7e96]",
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "truncate",
                                isActive ? "text-white" : "text-[#0a2540]",
                              )}
                            >
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p
                                className={cn(
                                  "truncate text-xs",
                                  isActive
                                    ? "text-white/70"
                                    : "text-[#6b7e96]",
                                )}
                              >
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          {isActive ? (
                            <CornerDownLeft className="h-3.5 w-3.5 text-[#c9a84c]" />
                          ) : (
                            <ArrowRight className="h-3.5 w-3.5 text-[#6b7e96]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border bg-[#f8f9fc] px-4 py-2 flex items-center justify-between text-xs text-[#6b7e96]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono">
                    ↑↓
                  </kbd>
                  navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono">
                    ↵
                  </kbd>
                  select
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-border bg-white px-1.5 py-0.5 font-mono">
                    esc
                  </kbd>
                  close
                </span>
              </div>
              <span>{filtered.length} results</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
