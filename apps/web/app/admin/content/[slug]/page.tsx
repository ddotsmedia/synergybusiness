import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageContentForm } from "@/components/admin/PageContentForm";
import { getPageSchema } from "@/lib/admin/page-schemas";
import { getRawPageContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const schema = getPageSchema(slug);
  return {
    title: schema ? `Edit — ${schema.title}` : "Edit content",
  };
}

export default async function ContentEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const schema = getPageSchema(slug);
  if (!schema) notFound();

  const current = await getRawPageContent(schema.slug);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b7e96] hover:text-[#0a2540]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All pages
        </Link>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Edit content
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            {schema.title}
          </h1>
          <p className="mt-1 text-sm text-[#6b7e96] max-w-2xl">
            {schema.description}
          </p>
        </div>
        <a
          href={schema.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-[#0a2540] hover:border-[#c9a84c]"
        >
          View live page
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      <PageContentForm schema={schema} current={current} />
    </div>
  );
}
