"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, getDb } from "@synergybusiness/db";
import {
  applications as applicationsTable,
  documents as documentsTable,
  invoices as invoicesTable,
  leads as leadsTable,
} from "@synergybusiness/db/schema";
import { getAdminActor } from "@/lib/admin-auth";
import { logActivity } from "@/lib/admin/activity";

type Result<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function authorise(): Promise<
  | { ok: true; actor: Awaited<ReturnType<typeof getAdminActor>> & object }
  | { ok: false; error: string }
> {
  const actor = await getAdminActor();
  if (!actor) return { ok: false, error: "Not authorised" };
  return { ok: true, actor };
}

/* ------------------------------------------------------------- LEADS */

const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
] as const;

export async function updateLeadStatus(
  leadId: string,
  status: string,
): Promise<Result> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  if (!(leadStatuses as readonly string[]).includes(status)) {
    return { ok: false, error: `Invalid status: ${status}` };
  }
  const newStatus = status as (typeof leadStatuses)[number];

  const db = getDb();
  let previousStatus: string | null = null;
  if (db) {
    try {
      const [existing] = await db
        .select({ status: leadsTable.status })
        .from(leadsTable)
        .where(eq(leadsTable.id, leadId))
        .limit(1);
      previousStatus = existing?.status ?? null;
      await db
        .update(leadsTable)
        .set({ status: newStatus })
        .where(eq(leadsTable.id, leadId));
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "DB update failed",
      };
    }
  }

  await logActivity(auth.actor, {
    action: "lead.status_change",
    entityType: "lead",
    entityId: leadId,
    metadata: { from: previousStatus, to: newStatus },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

/* ------------------------------------------------------------- APPLICATIONS */

const appStages = [
  "draft",
  "documents_pending",
  "submitted",
  "processing",
  "approved",
  "rejected",
] as const;

export async function updateApplicationStage(
  applicationId: string,
  stage: string,
): Promise<Result> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  if (!(appStages as readonly string[]).includes(stage)) {
    return { ok: false, error: `Invalid stage: ${stage}` };
  }
  const newStage = stage as (typeof appStages)[number];

  const db = getDb();
  let previousStage: string | null = null;
  if (db) {
    try {
      const [existing] = await db
        .select({ stage: applicationsTable.stage })
        .from(applicationsTable)
        .where(eq(applicationsTable.id, applicationId))
        .limit(1);
      previousStage = existing?.stage ?? null;
      await db
        .update(applicationsTable)
        .set({ stage: newStage, updatedAt: new Date() })
        .where(eq(applicationsTable.id, applicationId));
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "DB update failed",
      };
    }
  }

  await logActivity(auth.actor, {
    action: "application.stage_change",
    entityType: "application",
    entityId: applicationId,
    metadata: { from: previousStage, to: newStage },
  });

  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${applicationId}`);
  return { ok: true };
}

const noteSchema = z.object({
  applicationId: z.string().min(1).max(80),
  note: z.string().min(1).max(2000),
});

export async function addApplicationNote(
  applicationId: string,
  note: string,
): Promise<Result> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const parsed = noteSchema.safeParse({ applicationId, note });
  if (!parsed.success) {
    return { ok: false, error: "Invalid note" };
  }

  const db = getDb();
  if (db) {
    try {
      const [existing] = await db
        .select({ notes: applicationsTable.notes })
        .from(applicationsTable)
        .where(eq(applicationsTable.id, applicationId))
        .limit(1);
      const next = [...(existing?.notes ?? []), parsed.data.note];
      await db
        .update(applicationsTable)
        .set({ notes: next, updatedAt: new Date() })
        .where(eq(applicationsTable.id, applicationId));
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "DB update failed",
      };
    }
  }

  await logActivity(auth.actor, {
    action: "application.note_added",
    entityType: "application",
    entityId: applicationId,
    metadata: { length: parsed.data.note.length },
  });

  revalidatePath(`/admin/applications/${applicationId}`);
  return { ok: true };
}

/* ------------------------------------------------------------- DOCUMENTS */

export async function setDocumentVerified(
  documentId: string,
  verified: boolean,
): Promise<Result> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const db = getDb();
  if (db) {
    try {
      await db
        .update(documentsTable)
        .set({ verified })
        .where(eq(documentsTable.id, documentId));
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "DB update failed",
      };
    }
  }

  await logActivity(auth.actor, {
    action: verified ? "document.verified" : "document.unverified",
    entityType: "document",
    entityId: documentId,
    metadata: {},
  });

  revalidatePath("/admin/documents");
  return { ok: true };
}

export async function bulkSetDocumentVerified(
  documentIds: string[],
  verified: boolean,
): Promise<Result<{ updated: number }>> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  if (documentIds.length === 0)
    return { ok: true, data: { updated: 0 } };

  const db = getDb();
  if (db) {
    try {
      for (const id of documentIds) {
        await db
          .update(documentsTable)
          .set({ verified })
          .where(eq(documentsTable.id, id));
      }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "DB update failed",
      };
    }
  }

  await logActivity(auth.actor, {
    action: verified ? "document.bulk_verified" : "document.bulk_unverified",
    entityType: "document",
    entityId: null,
    metadata: { count: documentIds.length },
  });

  revalidatePath("/admin/documents");
  return { ok: true, data: { updated: documentIds.length } };
}

/* ------------------------------------------------------------- INVOICES */

const invoiceStatuses = ["draft", "due", "paid", "overdue"] as const;

export async function updateInvoiceStatus(
  invoiceId: string,
  status: string,
): Promise<Result> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  if (!(invoiceStatuses as readonly string[]).includes(status)) {
    return { ok: false, error: `Invalid status: ${status}` };
  }
  const newStatus = status as (typeof invoiceStatuses)[number];

  const db = getDb();
  let previousStatus: string | null = null;
  if (db) {
    try {
      const [existing] = await db
        .select({
          status: invoicesTable.status,
          number: invoicesTable.number,
          amountAed: invoicesTable.amountAed,
        })
        .from(invoicesTable)
        .where(eq(invoicesTable.id, invoiceId))
        .limit(1);
      previousStatus = existing?.status ?? null;
      await db
        .update(invoicesTable)
        .set({ status: newStatus })
        .where(eq(invoicesTable.id, invoiceId));
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "DB update failed",
      };
    }
  }

  await logActivity(auth.actor, {
    action:
      newStatus === "paid"
        ? "invoice.marked_paid"
        : "invoice.status_change",
    entityType: "invoice",
    entityId: invoiceId,
    metadata: { from: previousStatus, to: newStatus },
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { ok: true };
}

const newInvoiceSchema = z.object({
  number: z.string().min(3).max(40),
  applicationId: z.string().max(80).optional(),
  applicationLabel: z.string().min(1).max(200),
  issueDate: z.string(),
  dueDate: z.string(),
  amountAed: z.coerce.number().int().positive().max(10_000_000),
});

export async function createInvoice(
  formData: FormData,
): Promise<Result<{ id: string }>> {
  const auth = await authorise();
  if (!auth.ok) return auth;

  const parsed = newInvoiceSchema.safeParse({
    number: formData.get("number"),
    applicationId: formData.get("applicationId") || undefined,
    applicationLabel: formData.get("applicationLabel"),
    issueDate: formData.get("issueDate"),
    dueDate: formData.get("dueDate"),
    amountAed: formData.get("amountAed"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Invalid invoice data" };
  }

  const db = getDb();
  if (!db) {
    return {
      ok: false,
      error:
        "Database not configured — invoices can only be created when DATABASE_URL is set.",
    };
  }

  try {
    const [row] = await db
      .insert(invoicesTable)
      .values({
        number: parsed.data.number,
        applicationId: parsed.data.applicationId ?? null,
        applicationLabel: parsed.data.applicationLabel,
        issueDate: parsed.data.issueDate,
        dueDate: parsed.data.dueDate,
        amountAed: parsed.data.amountAed,
        status: "due",
      })
      .returning({ id: invoicesTable.id });

    await logActivity(auth.actor, {
      action: "invoice.created",
      entityType: "invoice",
      entityId: row.id,
      metadata: {
        number: parsed.data.number,
        amountAed: parsed.data.amountAed,
      },
    });

    revalidatePath("/admin/invoices");
    return { ok: true, data: { id: row.id } };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "DB insert failed",
    };
  }
}
