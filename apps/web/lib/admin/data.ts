/**
 * Admin-side data adapter. Like portal-data, but with richer demo content
 * and admin-only fields (assignee, hubspot id, etc.).
 */
import "server-only";
import { desc, eq, getDb } from "@synergybusiness/db";
import {
  applications as applicationsTable,
  documents as documentsTable,
  invoices as invoicesTable,
  leads as leadsTable,
} from "@synergybusiness/db/schema";
import {
  ADMIN_APPLICATIONS,
  ADMIN_DOCUMENTS,
  ADMIN_INVOICES,
  ADMIN_LEADS,
  type AdminApplication,
  type AdminLead,
} from "@/lib/admin/mock";
import type {
  PortalDocument,
  PortalInvoice,
} from "@/lib/portal-mock-data";

async function safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error("[admin-data] DB error, using seed:", err);
    return fallback;
  }
}

export async function listAdminLeads(): Promise<AdminLead[]> {
  const db = getDb();
  if (!db) return ADMIN_LEADS;
  return safe(async () => {
    const rows = await db
      .select()
      .from(leadsTable)
      .orderBy(desc(leadsTable.createdAt))
      .limit(500);
    return rows.map(
      (r): AdminLead => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        serviceInterest: r.serviceInterest,
        message: r.message,
        source: r.source,
        status: r.status,
        hubspotContactId: r.hubspotContactId,
        createdAt: r.createdAt,
      }),
    );
  }, ADMIN_LEADS);
}

export async function getAdminLead(id: string): Promise<AdminLead | null> {
  const all = await listAdminLeads();
  return all.find((l) => l.id === id) ?? null;
}

export async function listAdminApplications(): Promise<AdminApplication[]> {
  const db = getDb();
  if (!db) return ADMIN_APPLICATIONS;
  return safe(async () => {
    const rows = await db
      .select()
      .from(applicationsTable)
      .orderBy(desc(applicationsTable.createdAt))
      .limit(500);
    return rows.map(
      (r): AdminApplication => ({
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
        assignedToName: r.assignedToName ?? "—",
      }),
    );
  }, ADMIN_APPLICATIONS);
}

export async function getAdminApplication(
  id: string,
): Promise<AdminApplication | null> {
  const all = await listAdminApplications();
  return all.find((a) => a.id === id) ?? null;
}

export async function listAdminDocuments(): Promise<PortalDocument[]> {
  const db = getDb();
  if (!db) return ADMIN_DOCUMENTS;
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
      .limit(500);
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
  }, ADMIN_DOCUMENTS);
}

export async function listAdminInvoices(): Promise<PortalInvoice[]> {
  const db = getDb();
  if (!db) return ADMIN_INVOICES;
  return safe(async () => {
    const rows = await db
      .select()
      .from(invoicesTable)
      .orderBy(desc(invoicesTable.issueDate))
      .limit(500);
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
  }, ADMIN_INVOICES);
}

export async function getAdminInvoice(
  id: string,
): Promise<PortalInvoice | null> {
  const all = await listAdminInvoices();
  return all.find((i) => i.id === id) ?? null;
}

/**
 * Aggregate KPIs for the dashboard. Pulls everything in parallel and folds
 * into a single object.
 */
export async function getAdminDashboard() {
  const [leads, apps, docs, invs] = await Promise.all([
    listAdminLeads(),
    listAdminApplications(),
    listAdminDocuments(),
    listAdminInvoices(),
  ]);

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const within = (date: Date, days: number) =>
    now - date.getTime() < days * dayMs;

  const newLeadsToday = leads.filter((l) => within(l.createdAt, 1)).length;
  const newLeads7d = leads.filter((l) => within(l.createdAt, 7)).length;
  const convertedRate =
    leads.length === 0
      ? 0
      : Math.round(
          (leads.filter((l) => l.status === "converted").length /
            leads.length) *
            100,
        );

  const activeApps = apps.filter(
    (a) => a.stage !== "approved" && a.stage !== "rejected",
  );
  const completedApps = apps.filter((a) => a.stage === "approved");

  const pendingDocs = docs.filter((d) => !d.verified);

  const outstandingAed = invs
    .filter((i) => i.status === "due" || i.status === "overdue")
    .reduce((s, i) => s + i.amountAed, 0);
  const paidMtd = invs
    .filter(
      (i) =>
        i.status === "paid" &&
        within(new Date(i.issueDate), 31),
    )
    .reduce((s, i) => s + i.amountAed, 0);

  // 14-day leads sparkline
  const sparkline: number[] = Array.from({ length: 14 }, (_, idx) => {
    const dayStart = now - (idx + 1) * dayMs;
    const dayEnd = now - idx * dayMs;
    return leads.filter(
      (l) =>
        l.createdAt.getTime() >= dayStart && l.createdAt.getTime() < dayEnd,
    ).length;
  }).reverse();

  // leads by source
  const bySource: Record<string, number> = {};
  for (const l of leads) bySource[l.source] = (bySource[l.source] ?? 0) + 1;

  // applications by stage (kanban totals)
  const byStage: Record<string, number> = {};
  for (const a of apps) byStage[a.stage] = (byStage[a.stage] ?? 0) + 1;

  return {
    counts: {
      totalLeads: leads.length,
      newLeadsToday,
      newLeads7d,
      activeApps: activeApps.length,
      completedApps: completedApps.length,
      pendingDocs: pendingDocs.length,
      convertedRate,
    },
    revenue: {
      outstandingAed,
      paidMtd,
    },
    sparkline,
    bySource,
    byStage,
  };
}
