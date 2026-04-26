import "server-only";
import { desc, getDb } from "@synergybusiness/db";
import { activityLog } from "@synergybusiness/db/schema";
import type { AdminActor } from "@/lib/admin-auth";
import { ADMIN_ACTIVITY, type AdminActivity } from "@/lib/admin/mock";

type LogInput = {
  action: string;
  entityType:
    | "lead"
    | "application"
    | "document"
    | "invoice"
    | "user"
    | "system";
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function logActivity(actor: AdminActor, input: LogInput) {
  const db = getDb();
  if (!db) return; // demo mode — no-op
  try {
    await db.insert(activityLog).values({
      actorClerkId: actor.clerkUserId,
      actorEmail: actor.email,
      actorName: actor.name,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? {},
    });
  } catch (err) {
    console.error("[activity] failed to log:", err);
  }
}

export async function listActivity(limit = 50): Promise<AdminActivity[]> {
  const db = getDb();
  if (!db) return ADMIN_ACTIVITY.slice(0, limit);
  try {
    const rows = await db
      .select()
      .from(activityLog)
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
    return rows.map(
      (r): AdminActivity => ({
        id: r.id,
        actorClerkId: r.actorClerkId,
        actorEmail: r.actorEmail,
        actorName: r.actorName,
        action: r.action,
        entityType: r.entityType,
        entityId: r.entityId,
        metadata: (r.metadata ?? {}) as Record<string, unknown>,
        createdAt: r.createdAt,
      }),
    );
  } catch (err) {
    console.error("[activity] read failed, falling back to seed:", err);
    return ADMIN_ACTIVITY.slice(0, limit);
  }
}
