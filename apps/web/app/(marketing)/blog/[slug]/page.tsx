import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  Tag,
  User,
} from "lucide-react";
import { BlogBody } from "@/components/blog/BlogBody";
import { Button } from "@/components/ui/button";
import { type BlogPost } from "@/lib/blog-data";
import {
  getPublicPost as getPost,
  getPublicRelatedPosts as getRelatedPosts,
  listPublicPostSlugs as listPostSlugs,
} from "@/lib/blog-source";
import { absoluteUrl, siteUrl } from "@/lib/site";

type Params = { slug: string };

export const revalidate = 300; // refresh from Sanity every 5 min

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await listPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Allow new Sanity-published posts to render on first request.
export const dynamicParams = true;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function plainTextFromBlocks(post: BlogPost) {
  return post.body
    .map((b) => {
      if (b.type === "p" || b.type === "h2" || b.type === "h3") return b.text;
      if (b.type === "ul") return b.items.join(" ");
      if (b.type === "callout") return `${b.title}. ${b.body}`;
      return "";
    })
    .join("\n\n");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    articleBody: plainTextFromBlocks(post),
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Synergy Business",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${slug}`),
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <article>
        <section className="bg-navy-pattern text-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:pt-20 sm:pb-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-white/65 hover:text-[#e8c96b] mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All articles
            </Link>

            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
              <Tag className="h-3.5 w-3.5" />
              {post.category}
            </div>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl tracking-tight leading-[1.1]">
              {post.title}
            </h1>
            <p className="mt-5 text-white/75 text-base sm:text-lg leading-relaxed">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/65">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#c9a84c]" />
                {post.author.name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#c9a84c]" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#c9a84c]" />
                {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <BlogBody blocks={post.body} />

            <div className="mt-14 pt-10 border-t border-border">
              <p className="text-xs uppercase tracking-wide text-[#c9a84c] font-semibold">
                Tags
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#f8f9fc] text-[#1a2b3c] border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-2xl bg-[#0a2540] text-white p-7 sm:p-9 grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-6">
              <div className="h-14 w-14 rounded-full bg-[#c9a84c] text-[#0a2540] flex items-center justify-center font-display text-xl">
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="font-display text-xl">{post.author.name}</p>
                <p className="text-sm text-white/65">{post.author.role}</p>
                <p className="mt-3 text-sm text-white/75 leading-relaxed">
                  Speak directly with {post.author.name.split(" ")[0]} or
                  another Synergy consultant — free 30-minute call, no
                  obligation.
                </p>
                <div className="mt-4">
                  <Button
                    render={<Link href="/contact" />}
                    className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
                  >
                    Book a call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-[#f8f9fc] border-t border-border py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-sm font-semibold tracking-wide uppercase text-[#c9a84c]">
                Keep reading
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl text-[#0a2540]">
                More from Synergy Insights
              </h2>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block rounded-2xl bg-white border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
                        {p.category}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-[#6b7e96] group-hover:text-[#c9a84c] transition-colors" />
                    </div>
                    <h3 className="mt-3 font-display text-lg text-[#0a2540]">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#6b7e96] leading-relaxed line-clamp-2">
                      {p.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}
