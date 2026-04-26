/**
 * Server-only adapters for the editable entities (services, free zones,
 * blog). Each one reads from Postgres if configured, falling back to the
 * in-repo seed so the public site keeps working without a database.
 *
 * DB rows are stored as `{ slug | id, data: jsonb, ... }` with the data
 * blob matching the in-repo type — that way the seed type is the contract
 * shared between read and write paths.
 */
import "server-only";
import { asc, eq, getDb } from "@synergybusiness/db";
import {
  blogPosts as blogPostsTable,
  freeZonesEntity,
  servicesEntity,
} from "@synergybusiness/db/schema";
import {
  BLOG_POSTS,
  type BlogPost,
} from "@/lib/blog-data";
import {
  FREE_ZONES,
  type FreeZone,
} from "@/lib/free-zones-data";
import {
  SERVICES,
  type ServiceDetail,
  type ServiceSlug,
} from "@/lib/services-data";

/* ---------------------------------------------------------------- services */

export type AdminServiceRow = ServiceDetail & {
  source: "db" | "seed";
  position: number;
};

export async function listAdminServices(): Promise<AdminServiceRow[]> {
  const seedRows: AdminServiceRow[] = Object.values(SERVICES).map(
    (s, i) => ({ ...s, source: "seed", position: i }),
  );
  const db = getDb();
  if (!db) return seedRows;

  try {
    const rows = await db
      .select()
      .from(servicesEntity)
      .orderBy(asc(servicesEntity.position));

    if (rows.length === 0) return seedRows;

    const map = new Map<string, AdminServiceRow>(
      seedRows.map((r) => [r.slug, r]),
    );
    for (const r of rows) {
      const data = r.data as ServiceDetail;
      map.set(data.slug, {
        ...data,
        source: "db",
        position: r.position,
      });
    }
    return Array.from(map.values()).sort(
      (a, b) => a.position - b.position,
    );
  } catch (err) {
    console.error("[entities] services list failed, using seed:", err);
    return seedRows;
  }
}

export async function getAdminService(
  slug: string,
): Promise<AdminServiceRow | null> {
  const all = await listAdminServices();
  return all.find((s) => s.slug === slug) ?? null;
}

/** Public API: read service for the marketing page (DB or seed). */
export async function getPublicService(
  slug: string,
): Promise<ServiceDetail | null> {
  const db = getDb();
  if (db) {
    try {
      const [row] = await db
        .select()
        .from(servicesEntity)
        .where(eq(servicesEntity.slug, slug))
        .limit(1);
      if (row) return row.data as ServiceDetail;
    } catch (err) {
      console.error("[entities] getPublicService DB error:", err);
    }
  }
  return (SERVICES as Record<string, ServiceDetail | undefined>)[slug] ?? null;
}

/* -------------------------------------------------------------- free zones */

export type AdminFreeZoneRow = FreeZone & {
  source: "db" | "seed";
  position: number;
};

export async function listAdminFreeZones(): Promise<AdminFreeZoneRow[]> {
  const seedRows: AdminFreeZoneRow[] = FREE_ZONES.map((z, i) => ({
    ...z,
    source: "seed",
    position: i,
  }));
  const db = getDb();
  if (!db) return seedRows;

  try {
    const rows = await db
      .select()
      .from(freeZonesEntity)
      .orderBy(asc(freeZonesEntity.position));

    if (rows.length === 0) return seedRows;

    const map = new Map<string, AdminFreeZoneRow>(
      seedRows.map((r) => [r.id, r]),
    );
    for (const r of rows) {
      const data = r.data as FreeZone;
      map.set(data.id, { ...data, source: "db", position: r.position });
    }
    return Array.from(map.values()).sort(
      (a, b) => a.position - b.position,
    );
  } catch (err) {
    console.error("[entities] zones list failed, using seed:", err);
    return seedRows;
  }
}

export async function getAdminFreeZone(
  id: string,
): Promise<AdminFreeZoneRow | null> {
  const all = await listAdminFreeZones();
  return all.find((z) => z.id === id) ?? null;
}

export async function getPublicFreeZones(): Promise<FreeZone[]> {
  const all = await listAdminFreeZones();
  return all.map(({ source: _s, position: _p, ...zone }) => zone);
}

/* -------------------------------------------------------------------- blog */

export type AdminBlogRow = BlogPost & {
  source: "db" | "seed";
  status: "draft" | "published";
};

export async function listAdminBlogPosts(): Promise<AdminBlogRow[]> {
  const db = getDb();
  if (!db) {
    return BLOG_POSTS.map((p) => ({
      ...p,
      source: "seed",
      status: "published",
    }));
  }
  try {
    const rows = await db.select().from(blogPostsTable);
    if (rows.length === 0) {
      return BLOG_POSTS.map((p) => ({
        ...p,
        source: "seed",
        status: "published",
      }));
    }
    return rows
      .map((r): AdminBlogRow => {
        const data = r.data as BlogPost;
        return {
          ...data,
          source: "db",
          status: (r.status as "draft" | "published") ?? "draft",
        };
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime(),
      );
  } catch (err) {
    console.error("[entities] blog list failed, using seed:", err);
    return BLOG_POSTS.map((p) => ({
      ...p,
      source: "seed",
      status: "published",
    }));
  }
}

export async function getAdminBlogPost(
  slug: string,
): Promise<AdminBlogRow | null> {
  const all = await listAdminBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
