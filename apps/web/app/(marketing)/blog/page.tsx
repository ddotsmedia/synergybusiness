import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { listPublicPosts } from "@/lib/blog-source";
import { absoluteUrl } from "@/lib/site";
import { getPageContent } from "@/lib/site-content";
import { breadcrumbLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Synergy Insights — UAE business setup guides",
  description:
    "Practical, founder-friendly guides on UAE company formation, free zones, visas, banking and compliance — written by working consultants.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 300; // ISR — refresh from Sanity every 5 min in prod

export default async function BlogPage() {
  const [posts, content] = await Promise.all([
    listPublicPosts(),
    getPageContent("blog"),
  ]);

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
      <BlogIndex posts={posts} content={content} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ]),
          ),
        }}
      />
    </>
  );
}
