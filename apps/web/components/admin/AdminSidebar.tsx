"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  Inbox,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS: {
  title: string;
  items: { href: string; label: string; icon: typeof Inbox; badge?: string }[];
}[] = [
  {
    title: "Workspace",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/leads", label: "Leads", icon: Inbox },
      { href: "/admin/applications", label: "Applications", icon: Users },
      { href: "/admin/documents", label: "Documents", icon: FileText },
      { href: "/admin/invoices", label: "Invoices", icon: Receipt },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/activity", label: "Activity log", icon: Activity },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname() ?? "/admin";

  return (
    <nav
      aria-label="Admin navigation"
      className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-white px-3 py-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
    >
      <Link
        href="/admin"
        className="flex items-center gap-2 px-2 mb-5"
      >
        <span className="font-display text-xl text-[#0a2540]">Synergy</span>
        <span className="text-[10px] uppercase tracking-wider font-bold rounded bg-[#0a2540] text-[#c9a84c] px-1.5 py-0.5">
          Admin
        </span>
      </Link>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-2 text-[11px] uppercase tracking-wider font-semibold text-[#6b7e96] mb-2">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-[#0a2540] text-white"
                          : "text-[#1a2b3c] hover:bg-[#eef1f6]",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          active ? "text-[#c9a84c]" : "text-[#6b7e96]",
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-bold rounded-full px-1.5 py-0.5",
                            active
                              ? "bg-[#c9a84c] text-[#0a2540]"
                              : "bg-[#0a2540]/10 text-[#0a2540]",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 text-xs text-[#6b7e96] px-2">
        <Link href="/" className="hover:text-[#c9a84c]">
          Back to public site
        </Link>
      </div>
    </nav>
  );
}
