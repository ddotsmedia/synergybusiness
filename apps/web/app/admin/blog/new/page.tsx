import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogEditor } from "@/components/admin/BlogEditor";
import type { BlogPost } from "@/lib/blog-data";

export const metadata = { title: "New blog post" };
export const dynamic = "force-dynamic";

const EMPTY_POST: BlogPost & { status?: "draft" | "published" } = {
  slug: "",
  title: "",
  excerpt: "",
  category: "Setup",
  publishedAt: new Date().toISOString().slice(0, 10),
  readingMinutes: 5,
  author: { name: "Synergy Business", role: "Editorial team" },
  body: [{ type: "p", text: "" }],
  tags: [],
  status: "draft",
};

export default async function NewBlogPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

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

      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          New blog post
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Draft a new article
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Save as draft to keep it hidden from the public site until ready.
        </p>
      </header>

      {sp.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {sp.error}
        </div>
      )}

      <BlogEditor post={EMPTY_POST} mode="create" />
    </div>
  );
}
