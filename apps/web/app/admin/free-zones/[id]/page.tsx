import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FreeZoneEditor } from "@/components/admin/FreeZoneEditor";
import { getAdminFreeZone } from "@/lib/admin/entities";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const z = await getAdminFreeZone(id);
  return { title: z ? `Edit — ${z.short}` : "Edit zone" };
}

export default async function FreeZoneEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const zone = await getAdminFreeZone(id);
  if (!zone) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/free-zones"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b7e96] hover:text-[#0a2540]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All free zones
        </Link>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Edit zone · {zone.id}
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            {zone.short} <span className="text-[#6b7e96] text-xl">— {zone.name}</span>
          </h1>
        </div>
        <a
          href={`/free-zones#${zone.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-[#0a2540] hover:border-[#c9a84c]"
        >
          View live
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      <FreeZoneEditor zone={zone} />
    </div>
  );
}
