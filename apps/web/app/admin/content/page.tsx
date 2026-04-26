import Link from "next/link";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { dbConfigured } from "@synergybusiness/db";
import { PAGE_SCHEMAS } from "@/lib/admin/page-schemas";

export const metadata = { title: "Content" };
export const dynamic = "force-dynamic";

export default function ContentIndexPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Content
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Edit page content
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96] max-w-2xl">
          Override the default headlines, descriptions, CTAs and contact
          details that appear on the public site. Empty fields fall back to
          the built-in defaults so the site stays consistent if you remove
          an override.
        </p>
      </header>

      {!dbConfigured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Database not configured.</strong> You can browse the page
          schemas, but saving requires <code className="font-mono">DATABASE_URL</code>{" "}
          to be set in <code className="font-mono">apps/web/.env.local</code>{" "}
          and a Postgres instance running.
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PAGE_SCHEMAS.map((p) => {
          const fieldCount = p.sections.reduce(
            (s, sec) => s + sec.fields.length,
            0,
          );
          return (
            <li
              key={p.slug}
              className="rounded-2xl bg-white border border-border p-6 hover:border-[#c9a84c] hover:shadow-lg transition-all flex flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#0a2540]/5 text-[#0a2540] flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-[10px] uppercase tracking-wider rounded-full border border-border bg-[#f8f9fc] text-[#6b7e96] px-2 py-0.5 font-semibold">
                  {p.sections.length} sections · {fieldCount} fields
                </span>
              </div>
              <h2 className="mt-4 font-display text-xl text-[#0a2540]">
                {p.title}
              </h2>
              <p className="mt-1 text-sm text-[#6b7e96] line-clamp-2 flex-1">
                {p.description}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href={`/admin/content/${p.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a2540] hover:bg-[#071a2e] px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  Edit content
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={p.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-[#1a2b3c] hover:border-[#c9a84c] hover:text-[#0a2540] transition-colors"
                >
                  View live
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
