/**
 * Server-only content helpers for editable page text.
 *
 * Pages call `getPageContent("home")` once during render; the result is a
 * dotted-key map (e.g. `"hero.title"`) of strings or string arrays. Each
 * component reads the keys it cares about with `getString()` /
 * `getList()` and falls back to its in-code default when the DB row is
 * missing.
 *
 * Demo mode (no DATABASE_URL) returns an empty map so every component
 * renders its defaults.
 */
import "server-only";
import { getDb, like } from "@synergybusiness/db";
import { siteContent } from "@synergybusiness/db/schema";

export type ContentValue = string | string[] | null;
export type Content = Record<string, ContentValue>;

/**
 * Reads the editable content for one page from Postgres. We rely on
 * `revalidatePath` in the save action to invalidate the page cache, so
 * we deliberately don't add an extra in-process cache here -- the
 * combination caused stale reads after admin edits.
 */
export async function getPageContent(pageKey: string): Promise<Content> {
  const db = getDb();
  if (!db) return {};

  try {
    const rows = await db
      .select({ key: siteContent.key, value: siteContent.value })
      .from(siteContent)
      .where(like(siteContent.key, `${pageKey}.%`));

    const content: Content = {};
    const prefix = `${pageKey}.`;
    for (const r of rows) {
      const subKey = r.key.startsWith(prefix)
        ? r.key.slice(prefix.length)
        : r.key;
      content[subKey] = r.value as ContentValue;
    }
    return content;
  } catch (err) {
    console.error("[site-content] DB error, returning defaults:", err);
    return {};
  }
}

export function getString(
  content: Content,
  key: string,
  fallback: string,
): string {
  const v = content[key];
  if (typeof v === "string" && v.length > 0) return v;
  return fallback;
}

export function getList(
  content: Content,
  key: string,
  fallback: string[],
): string[] {
  const v = content[key];
  if (Array.isArray(v) && v.length > 0) return v;
  return fallback;
}

/**
 * Used by the admin editor so it can populate the form with whatever's in
 * the DB and let unset fields stay empty. Different from `getString`,
 * which always falls back to the default for rendering.
 */
export async function getRawPageContent(pageKey: string): Promise<Content> {
  const db = getDb();
  if (!db) return {};
  try {
    const rows = await db
      .select({ key: siteContent.key, value: siteContent.value })
      .from(siteContent)
      .where(like(siteContent.key, `${pageKey}.%`));
    const out: Content = {};
    const prefix = `${pageKey}.`;
    for (const r of rows) {
      const sub = r.key.startsWith(prefix) ? r.key.slice(prefix.length) : r.key;
      out[sub] = r.value as ContentValue;
    }
    return out;
  } catch {
    return {};
  }
}
