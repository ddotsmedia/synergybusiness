"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Briefcase,
  FileText,
  Inbox,
  LayoutDashboard,
  MapPin,
  Newspaper,
  Pencil,
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
    title: "Content",
    items: [
      { href: "/admin/content", label: "Page text", icon: Pencil },
      { href: "/admin/services", label: "Services", icon: Briefcase },
      { href: "/admin/free-zones", label: "Free zones", icon: MapPin },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
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
      className="hidden lg:flex flex-col w-60 shrink-0 border-r border-[#c9a84c]/20 bg-[#0a2540] px-3 py-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto text-white"
    >
      <Link
        href="/admin"
        className="flex items-center gap-2 px-2 mb-5"
      >
        <span className="font-display text-xl text-white">Synergy</span>
        <span className="text-[10px] uppercase tracking-wider font-bold rounded bg-[#c9a84c] text-[#0a2540] px-1.5 py-0.5">
          Admin
        </span>
      </Link>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-2 text-[11px] uppercase tracking-wider font-semibold text-[#c9a84c] mb-2">
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
                          ? "bg-[#c9a84c] text-[#0a2540] font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4",
                          active ? "text-[#0a2540]" : "text-[#c9a84c]",
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-bold rounded-full px-1.5 py-0.5",
                            active
                              ? "bg-[#0a2540] text-[#c9a84c]"
                              : "bg-[#c9a84c]/20 text-[#c9a84c]",
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

      <div className="mt-auto pt-6 text-xs text-white/55 px-2 border-t border-[#c9a84c]/15">
        <Link href="/" className="hover:text-[#c9a84c] block pt-3">
          Back to public site
        </Link>
      </div>
    </nav>
  );
}
