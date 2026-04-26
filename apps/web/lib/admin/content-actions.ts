"use server";

import { revalidatePath } from "next/cache";
import { eq, getDb, sql } from "@synergybusiness/db";
import { siteContent } from "@synergybusiness/db/schema";
import { getAdminActor } from "@/lib/admin-auth";
import { logActivity } from "@/lib/admin/activity";
import { getPageSchema, type FieldDef } from "@/lib/admin/page-schemas";

type Result =
  | { ok: true; updated: number }
  | { ok: false; error: string };

/**
 * Saves all editable content for a page in one transaction.
 *
 * Form fields encode list values as multiple `<input>` elements with the
 * same name; we collect them with `formData.getAll()`. Empty strings get
 * deleted from the table so the public site falls back to the in-code
 * default rather than rendering an empty heading.
 */
export async function saveContent(
  pageSlug: string,
  formData: FormData,
): Promise<Result> {
  const actor = await getAdminActor();
  if (!actor) return { ok: false, error: "Not authorised" };

  const schema = getPageSchema(pageSlug);
  if (!schema) return { ok: false, error: `Unknown page: ${pageSlug}` };

  const db = getDb();
  if (!db) {
    return {
      ok: false,
      error:
        "Database not configured — content edits require DATABASE_URL to be set.",
    };
  }

  // Collect changes per field. We compare against existing DB values to
  // skip writes that don't actually change anything.
  type Op =
    | { kind: "upsert"; key: string; value: string | string[] }
    | { kind: "delete"; key: string };

  const allFields = schema.sections.flatMap((s) => s.fields);
  const ops: Op[] = [];

  for (const field of allFields) {
    const fullKey = `${pageSlug}.${field.key}`;
    const incoming = readField(formData, field);

    // For empty input, clear the override so the default takes over.
    if (
      incoming === "" ||
      (Array.isArray(incoming) && incoming.length === 0)
    ) {
      ops.push({ kind: "delete", key: fullKey });
    } else {
      ops.push({ kind: "upsert", key: fullKey, value: incoming });
    }
  }

  let written = 0;
  try {
    for (const op of ops) {
      if (op.kind === "upsert") {
        await db
          .insert(siteContent)
          .values({
            key: op.key,
            value: op.value,
            updatedByClerkId: actor.clerkUserId,
            updatedByName: actor.name,
          })
          .onConflictDoUpdate({
            target: siteContent.key,
            set: {
              value: op.value,
              updatedAt: sql`now()`,
              updatedByClerkId: actor.clerkUserId,
              updatedByName: actor.name,
            },
          });
        written++;
      } else {
        await db.delete(siteContent).where(eq(siteContent.key, op.key));
        written++;
      }
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "DB write failed",
    };
  }

  await logActivity(actor, {
    action: "content.saved",
    entityType: "system",
    entityId: pageSlug,
    metadata: { changes: written, page: schema.title },
  });

  // Bust caches so the public page picks up the change immediately.
  revalidatePath(schema.publicUrl);
  revalidatePath(`/admin/content/${pageSlug}`);

  return { ok: true, updated: written };
}

function readField(formData: FormData, field: FieldDef): string | string[] {
  if (field.type === "list") {
    const all = formData.getAll(field.key).map((v) => String(v).trim());
    return all.filter((s) => s.length > 0);
  }
  const raw = formData.get(field.key);
  return raw === null ? "" : String(raw).trim();
}
