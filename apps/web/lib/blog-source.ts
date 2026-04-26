/**
 * Public blog reader. Three-tier fallback:
 *   1. Postgres (admin-managed, status='published')
 *   2. Sanity (external CMS, when configured)
 *   3. In-repo seed (lib/blog-data.ts)
 *
 * Whichever tier returns rows wins — no merging, since admin-managed posts
 * are intended to fully replace seed content.
 */
import "server-only";
import { eq, getDb } from "@synergybusiness/db";
import { blogPosts as blogPostsTable } from "@synergybusiness/db/schema";
import type { BlogPost } from "@/lib/blog-data";
import {
  getPost as sanityGetPost,
  getRelatedPosts as sanityGetRelated,
  listPostSlugs as sanityListSlugs,
  listPosts as sanityListPosts,
} from "@/lib/integrations/sanity";

async function dbPosts(): Promise<BlogPost[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.status, "published"));
    if (rows.length === 0) return null;
    return rows
      .map((r) => r.data as BlogPost)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      );
  } catch (err) {
    console.error("[blog] DB read failed:", err);
    return null;
  }
}

async function dbPost(slug: string): Promise<BlogPost | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const [row] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, slug))
      .limit(1);
    if (!row || row.status !== "published") return null;
    return row.data as BlogPost;
  } catch {
    return null;
  }
}

export async function listPublicPosts(): Promise<BlogPost[]> {
  const fromDb = await dbPosts();
  if (fromDb) return fromDb;
  return sanityListPosts();
}

export async function getPublicPost(slug: string): Promise<BlogPost | null> {
  const fromDb = await dbPost(slug);
  if (fromDb) return fromDb;
  return sanityGetPost(slug);
}

export async function getPublicRelatedPosts(
  slug: string,
  limit = 2,
): Promise<BlogPost[]> {
  // If we have DB-published posts at all, derive related from DB; else sanity.
  const all = await dbPosts();
  if (all) {
    const current = all.find((p) => p.slug === slug);
    if (!current) return [];
    const sameCategory = all.filter(
      (p) => p.slug !== slug && p.category === current.category,
    );
    if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
    const others = all.filter(
      (p) => p.slug !== slug && p.category !== current.category,
    );
    return [...sameCategory, ...others].slice(0, limit);
  }
  return sanityGetRelated(slug, limit);
}

export async function listPublicPostSlugs(): Promise<string[]> {
  const fromDb = await dbPosts();
  if (fromDb) return fromDb.map((p) => p.slug);
  return sanityListSlugs();
}
