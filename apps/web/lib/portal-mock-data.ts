import type {
  Application,
  Document,
  ServiceType,
} from "@synergybusiness/types";

/**
 * Mock client portal data. Replace with DB queries once the data layer is
 * wired (Postgres + Drizzle / Prisma). Shapes match `@synergybusiness/types`
 * so swap-in is mechanical.
 */

export type PortalApplication = Application & {
  serviceLabel: string;
  freeZoneShort?: string;
  primaryContact: string;
  estimatedCompletion: string;
};

export type PortalDocument = Document & {
  sizeKb: number;
  applicationLabel: string;
};

export type PortalInvoice = {
  id: string;
  number: string;
  applicationId: string;
  applicationLabel: string;
  issueDate: string;
  dueDate: string;
  amountAed: number;
  status: "paid" | "due" | "overdue" | "draft";
  pdfUrl?: string;
};

const isoDaysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

const isoDaysAhead = (n: number) =>
  new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();

export const PORTAL_APPLICATIONS: PortalApplication[] = [
  {
    id: "app_01",
    leadId: "lead_01",
    serviceType: "free-zone" as ServiceType,
    serviceLabel: "Free Zone Setup — ADGM",
    freeZoneShort: "ADGM",
    stage: "documents_pending",
    documents: [],
    notes: [
      "Awaiting MOFA-attested degree certificate from candidate.",
      "Bank application file ready to submit once licence issues.",
    ],
    createdAt: new Date(isoDaysAgo(8)),
    updatedAt: new Date(isoDaysAgo(1)),
    primaryContact: "Layla Al Mansouri",
    estimatedCompletion: isoDaysAhead(9),
  },
  {
    id: "app_02",
    leadId: "lead_02",
    serviceType: "visa" as ServiceType,
    serviceLabel: "Investor visa — 2 year",
    stage: "processing",
    documents: [],
    notes: [
      "Medical scheduled at Burjeel Day Hospital, Tuesday 9:30am.",
      "Emirates ID biometrics booked Wednesday.",
    ],
    createdAt: new Date(isoDaysAgo(15)),
    updatedAt: new Date(isoDaysAgo(2)),
    primaryContact: "Ravi Sundaram",
    estimatedCompletion: isoDaysAhead(4),
  },
  {
    id: "app_03",
    leadId: "lead_03",
    serviceType: "golden-visa" as ServiceType,
    serviceLabel: "Golden Visa — Investor track",
    stage: "approved",
    documents: [],
    notes: ["Golden Visa stamped. Family file submitted in parallel."],
    createdAt: new Date(isoDaysAgo(35)),
    updatedAt: new Date(isoDaysAgo(2)),
    primaryContact: "Mariam Khoury",
    estimatedCompletion: isoDaysAgo(2),
  },
];

export const PORTAL_DOCUMENTS: PortalDocument[] = [
  {
    id: "doc_01",
    applicationId: "app_01",
    applicationLabel: "Free Zone Setup — ADGM",
    name: "Passport — bio page.pdf",
    type: "passport",
    fileUrl: "#",
    verified: true,
    uploadedAt: new Date(isoDaysAgo(8)),
    sizeKb: 412,
  },
  {
    id: "doc_02",
    applicationId: "app_01",
    applicationLabel: "Free Zone Setup — ADGM",
    name: "Proof of address — Emirates Bank.pdf",
    type: "bank_statement",
    fileUrl: "#",
    verified: true,
    uploadedAt: new Date(isoDaysAgo(7)),
    sizeKb: 856,
  },
  {
    id: "doc_03",
    applicationId: "app_01",
    applicationLabel: "Free Zone Setup — ADGM",
    name: "MBA degree certificate.pdf",
    type: "other",
    fileUrl: "#",
    verified: false,
    uploadedAt: new Date(isoDaysAgo(2)),
    sizeKb: 1340,
  },
  {
    id: "doc_04",
    applicationId: "app_02",
    applicationLabel: "Investor visa — 2 year",
    name: "Photo (white background).jpg",
    type: "other",
    fileUrl: "#",
    verified: true,
    uploadedAt: new Date(isoDaysAgo(14)),
    sizeKb: 240,
  },
  {
    id: "doc_05",
    applicationId: "app_03",
    applicationLabel: "Golden Visa — Investor track",
    name: "Title deed — Aldar property.pdf",
    type: "other",
    fileUrl: "#",
    verified: true,
    uploadedAt: new Date(isoDaysAgo(33)),
    sizeKb: 2104,
  },
];

export const PORTAL_INVOICES: PortalInvoice[] = [
  {
    id: "inv_01",
    number: "INV-2026-0114",
    applicationId: "app_03",
    applicationLabel: "Golden Visa — Investor track",
    issueDate: isoDaysAgo(35),
    dueDate: isoDaysAgo(20),
    amountAed: 18500,
    status: "paid",
    pdfUrl: "#",
  },
  {
    id: "inv_02",
    number: "INV-2026-0211",
    applicationId: "app_02",
    applicationLabel: "Investor visa — 2 year",
    issueDate: isoDaysAgo(15),
    dueDate: isoDaysAgo(1),
    amountAed: 4200,
    status: "paid",
    pdfUrl: "#",
  },
  {
    id: "inv_03",
    number: "INV-2026-0301",
    applicationId: "app_01",
    applicationLabel: "Free Zone Setup — ADGM",
    issueDate: isoDaysAgo(8),
    dueDate: isoDaysAhead(2),
    amountAed: 12500,
    status: "due",
    pdfUrl: "#",
  },
];

export type PortalSummary = {
  activeApplications: number;
  completedApplications: number;
  pendingDocuments: number;
  outstandingAed: number;
};

export function getPortalSummary(): PortalSummary {
  const active = PORTAL_APPLICATIONS.filter(
    (a) => a.stage !== "approved" && a.stage !== "rejected",
  );
  const completed = PORTAL_APPLICATIONS.filter(
    (a) => a.stage === "approved",
  );
  const pendingDocs = PORTAL_DOCUMENTS.filter((d) => !d.verified);
  const outstanding = PORTAL_INVOICES.filter(
    (i) => i.status === "due" || i.status === "overdue",
  ).reduce((sum, i) => sum + i.amountAed, 0);

  return {
    activeApplications: active.length,
    completedApplications: completed.length,
    pendingDocuments: pendingDocs.length,
    outstandingAed: outstanding,
  };
}

export function stageLabel(stage: Application["stage"]): string {
  switch (stage) {
    case "draft":
      return "Draft";
    case "documents_pending":
      return "Documents pending";
    case "submitted":
      return "Submitted";
    case "processing":
      return "Processing";
    case "approved":
      return "Completed";
    case "rejected":
      return "Rejected";
  }
}

export function stageBadgeClass(stage: Application["stage"]): string {
  switch (stage) {
    case "draft":
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
    case "documents_pending":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "submitted":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "processing":
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case "approved":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-800 border-red-200";
  }
}
