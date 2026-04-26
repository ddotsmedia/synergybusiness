"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  {
    href: "/portal/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/portal/applications",
    label: "Applications",
    icon: Briefcase,
  },
  {
    href: "/portal/documents",
    label: "Documents",
    icon: FileText,
  },
  {
    href: "/portal/invoices",
    label: "Invoices",
    icon: Receipt,
  },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Portal navigation"
      className="space-y-1"
    >
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
