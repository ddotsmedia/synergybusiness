import Link from "next/link";
import { ArrowRight, ExternalLink, Plus } from "lucide-react";
import { dbConfigured } from "@synergybusiness/db";
import { Button } from "@/components/ui/button";
import { listAdminBlogPosts } from "@/lib/admin/entities";

export const metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminBlogPage() {
  const posts = await listAdminBlogPosts();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Content
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            Blog
          </h1>
          <p className="mt-1 text-sm text-[#6b7e96]">
            Posts at <code className="font-mono">/blog/[slug]</code>. Drafts
            are hidden from the public site.
          </p>
        </div>
        <Button
          render={<Link href="/admin/blog/new" />}
          size="sm"
          className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          New post
        </Button>
      </header>

      {!dbConfigured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Database not configured.</strong> Edits and new posts
          require <code className="font-mono">DATABASE_URL</code>. The list
          below shows the in-repo seed posts.
        </div>
      )}

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f9fc] border-b border-border text-left text-xs uppercase tracking-wide text-[#6b7e96]">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell">
                Category
              </th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell">
                Author
              </th>
              <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                Published
              </th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold sr-only">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((p) => (
              <tr
                key={p.slug}
                className="hover:bg-[#f8f9fc] transition-colors"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/blog/${p.slug}`}
                    className="font-medium text-[#0a2540] hover:text-[#c9a84c]"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-[#6b7e96] mt-0.5 line-clamp-1">
                    {p.excerpt}
                  </p>
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-[#6b7e96]">
                  {p.category}
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-[#6b7e96]">
                  {p.author.name}
                </td>
                <td className="px-5 py-3 hidden sm:table-cell text-xs text-[#6b7e96] whitespace-nowrap">
                  {formatDate(p.publishedAt)}
                </td>
                <td className="px-5 py-3">
                  {p.status === "published" ? (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-200">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-zinc-100 text-zinc-700 border-zinc-200">
                      Draft
                    </span>
                  )}
                  {p.source === "seed" && (
                    <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border-amber-200">
                      Seed
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3 text-xs">
                    <a
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#6b7e96] hover:text-[#c9a84c]"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Link
                      href={`/admin/blog/${p.slug}`}
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
