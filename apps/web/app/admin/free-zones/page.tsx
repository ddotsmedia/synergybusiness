import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { dbConfigured } from "@synergybusiness/db";
import { listAdminFreeZones } from "@/lib/admin/entities";

export const metadata = { title: "Free zones" };
export const dynamic = "force-dynamic";

export default async function AdminFreeZonesPage() {
  const zones = await listAdminFreeZones();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Catalogue
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Free zones
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          The 13 zones shown at <code className="font-mono">/free-zones</code>.
        </p>
      </header>

      {!dbConfigured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Database not configured.</strong> Edits require{" "}
          <code className="font-mono">DATABASE_URL</code>.
        </div>
      )}

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f9fc] border-b border-border text-left text-xs uppercase tracking-wide text-[#6b7e96]">
            <tr>
              <th className="px-5 py-3 font-semibold">Zone</th>
              <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                Emirate
              </th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell">
                Category
              </th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell text-right">
                From
              </th>
              <th className="px-5 py-3 font-semibold">Source</th>
              <th className="px-5 py-3 font-semibold sr-only">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {zones.map((z) => (
              <tr
                key={z.id}
                className="hover:bg-[#f8f9fc] transition-colors"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/free-zones/${z.id}`}
                    className="font-medium text-[#0a2540] hover:text-[#c9a84c]"
                  >
                    {z.short}
                  </Link>
                  <p className="text-xs text-[#6b7e96] mt-0.5">{z.name}</p>
                </td>
                <td className="px-5 py-3 hidden sm:table-cell text-[#6b7e96]">
                  {z.emirate}
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-[#6b7e96]">
                  {z.category}
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-right text-[#0a2540] font-medium whitespace-nowrap">
                  AED {z.startingCostAed.toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={
                      z.source === "db"
                        ? "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-zinc-100 text-zinc-700 border-zinc-200"
                    }
                  >
                    {z.source === "db" ? "DB override" : "Default"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3 text-xs">
                    <a
                      href={`/free-zones#${z.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#6b7e96] hover:text-[#c9a84c]"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Link
                      href={`/admin/free-zones/${z.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#0a2540] hover:text-[#c9a84c]"
                    >
                      Edit
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
