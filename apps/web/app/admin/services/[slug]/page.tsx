import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { getAdminService } from "@/lib/admin/entities";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = await getAdminService(slug);
  return { title: s ? `Edit — ${s.hero.eyebrow}` : "Edit service" };
}

export default async function ServiceEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getAdminService(slug);
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b7e96] hover:text-[#0a2540]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All services
        </Link>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Edit service · {service.slug}
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            {service.hero.eyebrow}
          </h1>
          <p className="mt-1 text-sm text-[#6b7e96] max-w-2xl line-clamp-2">
            {service.seo.description}
          </p>
        </div>
        <a
          href={`/services/${service.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-[#0a2540] hover:border-[#c9a84c]"
        >
          View live
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      <ServiceEditor service={service} />
    </div>
  );
}
