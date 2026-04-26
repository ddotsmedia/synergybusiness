import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { listPosts } from "@/lib/integrations/sanity";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Synergy Insights — UAE business setup guides",
  description:
    "Practical, founder-friendly guides on UAE company formation, free zones, visas, banking and compliance — written by working consultants.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 300; // ISR — refresh from Sanity every 5 min in prod

export default async function BlogPage() {
  const posts = await listPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Synergy Insights",
    url: absoluteUrl("/blog"),
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.publishedAt,
      author: { "@type": "Person", name: p.author.name },
      url: absoluteUrl(`/blog/${p.slug}`),
    })),
  };

  return (
    <>
      <BlogIndex posts={posts} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
    </>
  );
}
