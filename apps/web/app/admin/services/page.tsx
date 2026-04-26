import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { dbConfigured } from "@synergybusiness/db";
import { listAdminServices } from "@/lib/admin/entities";

export const metadata = { title: "Services" };
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await listAdminServices();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Catalogue
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Services
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          The six service detail pages at <code className="font-mono">/services/[slug]</code>.
          Saved overrides take precedence over the in-repo defaults.
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
              <th className="px-5 py-3 font-semibold">Service</th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell">
                Eyebrow
              </th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell text-right">
                Starting price
              </th>
              <th className="px-5 py-3 font-semibold">Source</th>
              <th className="px-5 py-3 font-semibold sr-only">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((s) => (
              <tr
                key={s.slug}
                className="hover:bg-[#f8f9fc] transition-colors"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/services/${s.slug}`}
                    className="font-medium text-[#0a2540] hover:text-[#c9a84c]"
                  >
                    {s.hero.eyebrow}
                  </Link>
                  <p className="text-xs text-[#6b7e96] mt-0.5 truncate max-w-md">
                    {s.seo.description}
                  </p>
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-[#6b7e96]">
                  {s.hero.eyebrow}
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-right text-[#0a2540] font-medium whitespace-nowrap">
                  {s.hero.startingPrice
                    ? `AED ${s.hero.startingPrice.toLocaleString()}`
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={
                      s.source === "db"
                        ? "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-zinc-100 text-zinc-700 border-zinc-200"
                    }
                  >
                    {s.source === "db" ? "DB override" : "Default"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3 text-xs">
                    <a
                      href={`/services/${s.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#6b7e96] hover:text-[#c9a84c]"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Link
                      href={`/admin/services/${s.slug}`}
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
