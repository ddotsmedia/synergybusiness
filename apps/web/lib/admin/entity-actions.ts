"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq, getDb, sql } from "@synergybusiness/db";
import {
  blogPosts as blogPostsTable,
  freeZonesEntity,
  servicesEntity,
} from "@synergybusiness/db/schema";
import { getAdminActor } from "@/lib/admin-auth";
import { logActivity } from "@/lib/admin/activity";

type Result<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function authorise() {
  const actor = await getAdminActor();
  if (!actor) return { ok: false as const, error: "Not authorised" };
  return { ok: true as const, actor };
}

function requireDb(): { db: ReturnType<typeof getDb>; ok: boolean; error?: string } {
  const db = getDb();
  if (!db) {
    return {
      db: null,
      ok: false,
      error:
        "Database not configured — entity edits require DATABASE_URL.",
    };
  }
  return { db, ok: true };
}

/* ------------------------------------------------------------- SERVICES */

export async function saveService(
  slug: string,
  data: unknown,
): Promise<Result> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const { db, ok, error } = requireDb();
  if (!ok || !db) return { ok: false, error: error ?? "DB unavailable" };

  try {
    await db
      .insert(servicesEntity)
      .values({
        slug,
        data: data as Record<string, unknown>,
        updatedByName: auth.actor.name,
      })
      .onConflictDoUpdate({
        target: servicesEntity.slug,
        set: {
          data: data as Record<string, unknown>,
          updatedAt: sql`now()`,
          updatedByName: auth.actor.name,
        },
      });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "DB write failed",
    };
  }

  await logActivity(auth.actor, {
    action: "service.saved",
    entityType: "system",
    entityId: slug,
    metadata: { type: "service" },
  });

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${slug}`);
  revalidatePath(`/services/${slug}`);
  return { ok: true };
}

/* ------------------------------------------------------------- FREE ZONES */

export async function saveFreeZone(
  id: string,
  data: unknown,
): Promise<Result> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const { db, ok, error } = requireDb();
  if (!ok || !db) return { ok: false, error: error ?? "DB unavailable" };

  try {
    await db
      .insert(freeZonesEntity)
      .values({
        id,
        data: data as Record<string, unknown>,
        updatedByName: auth.actor.name,
      })
      .onConflictDoUpdate({
        target: freeZonesEntity.id,
        set: {
          data: data as Record<string, unknown>,
          updatedAt: sql`now()`,
          updatedByName: auth.actor.name,
        },
      });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "DB write failed",
    };
  }

  await logActivity(auth.actor, {
    action: "freezone.saved",
    entityType: "system",
    entityId: id,
    metadata: { type: "free_zone" },
  });

  revalidatePath("/admin/free-zones");
  revalidatePath(`/admin/free-zones/${id}`);
  revalidatePath("/free-zones");
  return { ok: true };
}

/* ------------------------------------------------------------------ BLOG */

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string() }),
  z.object({ type: z.literal("h2"), text: z.string() }),
  z.object({ type: z.literal("h3"), text: z.string() }),
  z.object({ type: z.literal("ul"), items: z.array(z.string()) }),
  z.object({
    type: z.literal("callout"),
    title: z.string(),
    body: z.string(),
  }),
]);

const blogSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  title: z.string().min(2).max(200),
  excerpt: z.string().min(2).max(400),
  category: z.enum(["Setup", "Free Zones", "Visas", "Compliance", "Banking"]),
  publishedAt: z.string().min(4),
  readingMinutes: z.coerce.number().int().min(1).max(60),
  authorName: z.string().min(1).max(80),
  authorRole: z.string().min(1).max(120),
  tags: z.array(z.string().max(40)).max(20),
  body: z.array(blockSchema).max(80),
  status: z.enum(["draft", "published"]).default("draft"),
});

export async function saveBlogPost(
  originalSlug: string | null,
  raw: unknown,
): Promise<Result<{ slug: string }>> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const { db, ok, error } = requireDb();
  if (!ok || !db) return { ok: false, error: error ?? "DB unavailable" };

  const parsed = blogSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      error: `${firstIssue.path.join(".") || "input"}: ${firstIssue.message}`,
    };
  }
  const v = parsed.data;
  const data = {
    slug: v.slug,
    title: v.title,
    excerpt: v.excerpt,
    category: v.category,
    publishedAt: v.publishedAt,
    readingMinutes: v.readingMinutes,
    author: { name: v.authorName, role: v.authorRole },
    body: v.body,
    tags: v.tags,
  };

  try {
    if (originalSlug && originalSlug !== v.slug) {
      // Slug changed — delete old row, insert new one.
      await db
        .delete(blogPostsTable)
        .where(eq(blogPostsTable.slug, originalSlug));
    }
    await db
      .insert(blogPostsTable)
      .values({
        slug: v.slug,
        data,
        status: v.status,
        publishedAt: v.status === "published" ? new Date(v.publishedAt) : null,
        updatedByName: auth.actor.name,
      })
      .onConflictDoUpdate({
        target: blogPostsTable.slug,
        set: {
          data,
          status: v.status,
          publishedAt:
            v.status === "published" ? new Date(v.publishedAt) : null,
          updatedAt: sql`now()`,
          updatedByName: auth.actor.name,
        },
      });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "DB write failed",
    };
  }

  await logActivity(auth.actor, {
    action: "blog.saved",
    entityType: "system",
    entityId: v.slug,
    metadata: { status: v.status, title: v.title },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${v.slug}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${v.slug}`);

  return { ok: true, data: { slug: v.slug } };
}

export async function deleteBlogPost(slug: string): Promise<Result> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const { db, ok, error } = requireDb();
  if (!ok || !db) return { ok: false, error: error ?? "DB unavailable" };

  try {
    await db.delete(blogPostsTable).where(eq(blogPostsTable.slug, slug));
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "DB delete failed",
    };
  }

  await logActivity(auth.actor, {
    action: "blog.deleted",
    entityType: "system",
    entityId: slug,
    metadata: {},
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { ok: true };
}

export async function createBlogPostAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const result = await saveBlogPost(null, parseBlogForm(formData));
  if (!result.ok) {
    redirect(
      `/admin/blog/new?error=${encodeURIComponent(result.error)}`,
    );
  }
  redirect(`/admin/blog/${result.data?.slug ?? slug}`);
}

export async function updateBlogPostAction(
  originalSlug: string,
  formData: FormData,
) {
  const result = await saveBlogPost(originalSlug, parseBlogForm(formData));
  if (!result.ok) {
    redirect(
      `/admin/blog/${originalSlug}?error=${encodeURIComponent(result.error)}`,
    );
  }
  redirect(`/admin/blog/${result.data?.slug ?? originalSlug}`);
}

function parseBlogForm(formData: FormData) {
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Body: stored as a JSON string in a hidden input that the client editor
  // updates. Falls back to a single empty paragraph.
  let body: unknown = [{ type: "p", text: "" }];
  try {
    const raw = String(formData.get("body") ?? "");
    if (raw) body = JSON.parse(raw);
  } catch {
    body = [{ type: "p", text: "" }];
  }

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    category: String(formData.get("category") ?? "Setup"),
    publishedAt: String(formData.get("publishedAt") ?? "").trim(),
    readingMinutes: Number(formData.get("readingMinutes") ?? 5),
    authorName: String(formData.get("authorName") ?? "").trim(),
    authorRole: String(formData.get("authorRole") ?? "").trim(),
    tags,
    body,
    status: String(formData.get("status") ?? "draft"),
  };
}
