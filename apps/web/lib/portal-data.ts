/**
 * Server-only adapter that returns portal data from Postgres when
 * `DATABASE_URL` is set and reachable, otherwise falls back to seed data.
 * Page components import from here — they never see the boundary.
 */
import "server-only";
import { desc, eq, getDb } from "@synergybusiness/db";
import {
  applications as applicationsTable,
  documents as documentsTable,
  invoices as invoicesTable,
} from "@synergybusiness/db/schema";
import {
  PORTAL_APPLICATIONS,
  PORTAL_DOCUMENTS,
  PORTAL_INVOICES,
  type PortalApplication,
  type PortalDocument,
  type PortalInvoice,
} from "@/lib/portal-mock-data";

const TYPE_LABEL: Record<string, string> = {
  passport: "Passport",
  emirates_id: "Emirates ID",
  visa: "Visa",
  noc: "NOC",
  moa: "MOA",
  bank_statement: "Bank statement",
  other: "Other",
};

/**
 * Wrap a DB query in a try/catch that falls back to seed data on any error.
 * This means a misconfigured or temporarily unreachable database never
 * surfaces as a 500 to the user — they just see demo data with the amber
 * "Demo mode" banner that the portal layout already renders.
 */
async function safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error("[portal-data] DB query failed, using seed:", err);
    return fallback;
  }
}

export async function listApplications(): Promise<PortalApplication[]> {
  const db = getDb();
  if (!db) return PORTAL_APPLICATIONS;

  return safe(async () => {
    const rows = await db
      .select()
      .from(applicationsTable)
      .orderBy(desc(applicationsTable.createdAt))
      .limit(50);

    return rows.map(
      (r): PortalApplication => ({
        id: r.id,
        leadId: r.leadId ?? "",
        serviceType: r.serviceType,
        stage: r.stage,
        documents: [],
        notes: r.notes ?? [],
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        serviceLabel: r.serviceLabel,
        freeZoneShort: r.freeZoneShort ?? undefined,
        primaryContact: r.primaryContact,
        estimatedCompletion:
          r.estimatedCompletion?.toISOString() ?? new Date().toISOString(),
      }),
    );
  }, PORTAL_APPLICATIONS);
}

export async function listDocuments(): Promise<PortalDocument[]> {
  const db = getDb();
  if (!db) return PORTAL_DOCUMENTS;

  return safe(async () => {
    const rows = await db
      .select({
        id: documentsTable.id,
        applicationId: documentsTable.applicationId,
        name: documentsTable.name,
        type: documentsTable.type,
        fileUrl: documentsTable.fileUrl,
        sizeKb: documentsTable.sizeKb,
        verified: documentsTable.verified,
        uploadedAt: documentsTable.uploadedAt,
        applicationLabel: applicationsTable.serviceLabel,
      })
      .from(documentsTable)
      .leftJoin(
        applicationsTable,
        eq(applicationsTable.id, documentsTable.applicationId),
      )
      .orderBy(desc(documentsTable.uploadedAt))
      .limit(200);

    return rows.map(
      (r): PortalDocument => ({
        id: r.id,
        applicationId: r.applicationId,
        name: r.name,
        type: r.type,
        fileUrl: r.fileUrl,
        verified: r.verified,
        uploadedAt: r.uploadedAt,
        sizeKb: r.sizeKb,
        applicationLabel: r.applicationLabel ?? "—",
      }),
    );
  }, PORTAL_DOCUMENTS);
}

export async function listInvoices(): Promise<PortalInvoice[]> {
  const db = getDb();
  if (!db) return PORTAL_INVOICES;

  return safe(async () => {
    const rows = await db
      .select()
      .from(invoicesTable)
      .orderBy(desc(invoicesTable.issueDate))
      .limit(100);

    return rows.map(
      (r): PortalInvoice => ({
        id: r.id,
        number: r.number,
        applicationId: r.applicationId ?? "",
        applicationLabel: r.applicationLabel,
        issueDate:
          typeof r.issueDate === "string"
            ? r.issueDate
            : new Date(r.issueDate).toISOString(),
        dueDate:
          typeof r.dueDate === "string"
            ? r.dueDate
            : new Date(r.dueDate).toISOString(),
        amountAed: r.amountAed,
        status: r.status,
        pdfUrl: r.pdfUrl ?? undefined,
      }),
    );
  }, PORTAL_INVOICES);
}

export async function getPortalSummary() {
  const [apps, docs, invs] = await Promise.all([
    listApplications(),
    listDocuments(),
    listInvoices(),
  ]);
  const active = apps.filter(
    (a) => a.stage !== "approved" && a.stage !== "rejected",
  );
  const completed = apps.filter((a) => a.stage === "approved");
  const pendingDocs = docs.filter((d) => !d.verified);
  const outstanding = invs
    .filter((i) => i.status === "due" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amountAed, 0);

  return {
    activeApplications: active.length,
    completedApplications: completed.length,
    pendingDocuments: pendingDocs.length,
    outstandingAed: outstanding,
  };
}

export { TYPE_LABEL };
