import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { SERVICE_SLUGS } from "@/lib/services-data";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, priority: 1.0, changeFrequency: "monthly", lastModified: today },
    { url: `${siteUrl}/about`, priority: 0.7, changeFrequency: "yearly", lastModified: today },
    { url: `${siteUrl}/contact`, priority: 0.8, changeFrequency: "yearly", lastModified: today },
    { url: `${siteUrl}/free-zones`, priority: 0.9, changeFrequency: "monthly", lastModified: today },
    { url: `${siteUrl}/cost-calculator`, priority: 0.9, changeFrequency: "monthly", lastModified: today },
    { url: `${siteUrl}/blog`, priority: 0.8, changeFrequency: "weekly", lastModified: today },
    { url: `${siteUrl}/legal/privacy`, priority: 0.3, changeFrequency: "yearly", lastModified: today },
    { url: `${siteUrl}/legal/terms`, priority: 0.3, changeFrequency: "yearly", lastModified: today },
    { url: `${siteUrl}/legal/cookies`, priority: 0.3, changeFrequency: "yearly", lastModified: today },
  ];

  const services: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    priority: 0.85,
    changeFrequency: "monthly",
    lastModified: today,
  }));

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: new Date(p.publishedAt),
  }));

  return [...staticRoutes, ...services, ...posts];
}
