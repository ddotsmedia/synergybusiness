import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getAdminBlogPost } from "@/lib/admin/entities";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getAdminBlogPost(slug);
  return { title: p ? `Edit — ${p.title}` : "Edit post" };
}

export default async function BlogEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const post = await getAdminBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b7e96] hover:text-[#0a2540]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All posts
        </Link>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Edit post · {post.slug}
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            {post.title}
          </h1>
          {post.source === "seed" && (
            <p className="mt-1 text-xs text-amber-800">
              This is the in-repo seed post. Saving creates a DB override
              with the same slug.
            </p>
          )}
        </div>
        <a
          href={`/blog/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-[#0a2540] hover:border-[#c9a84c]"
        >
          View live
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      {sp.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {sp.error}
        </div>
      )}

      <BlogEditor post={post} mode="edit" />
    </div>
  );
}
