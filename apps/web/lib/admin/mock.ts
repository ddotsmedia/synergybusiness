/**
 * Extended demo data for the admin panel. Used when DATABASE_URL is unset
 * so the panel renders meaningfully even before the DB is wired.
 */

import {
  PORTAL_APPLICATIONS,
  PORTAL_DOCUMENTS,
  PORTAL_INVOICES,
  type PortalApplication,
  type PortalDocument,
  type PortalInvoice,
} from "@/lib/portal-mock-data";

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest:
    | "mainland"
    | "free-zone"
    | "offshore"
    | "pro-services"
    | "visa"
    | "golden-visa"
    | "other";
  message: string | null;
  source: "website" | "whatsapp" | "referral" | "walk-in";
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  hubspotContactId: string | null;
  createdAt: Date;
};

export type AdminActivity = {
  id: string;
  actorClerkId: string | null;
  actorEmail: string | null;
  actorName: string | null;
  action: string;
  entityType: "lead" | "application" | "document" | "invoice" | "user" | "system";
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
};

const isoDaysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const isoHoursAgo = (n: number) =>
  new Date(Date.now() - n * 60 * 60 * 1000);

export const ADMIN_LEADS: AdminLead[] = [
  {
    id: "lead_01",
    name: "Layla Al Mansouri",
    email: "layla@haloanalytics.io",
    phone: "+971 50 222 1111",
    serviceInterest: "free-zone",
    message: "Looking at ADGM for a fintech startup, AED 500K seed raised.",
    source: "website",
    status: "converted",
    hubspotContactId: "12345001",
    createdAt: isoDaysAgo(40),
  },
  {
    id: "lead_02",
    name: "Ravi Sundaram",
    email: "ravi@crestlinefze.com",
    phone: "+971 56 333 2222",
    serviceInterest: "offshore",
    message: "Need to migrate RAK ICC structure to ADGM. Family office.",
    source: "referral",
    status: "qualified",
    hubspotContactId: "12345002",
    createdAt: isoDaysAgo(18),
  },
  {
    id: "lead_03",
    name: "Mariam Khoury",
    email: "m.khoury@levantcap.ae",
    phone: "+971 52 444 5555",
    serviceInterest: "golden-visa",
    message: "Property investor, AED 2.5M Aldar property — eligibility check.",
    source: "website",
    status: "converted",
    hubspotContactId: "12345003",
    createdAt: isoDaysAgo(36),
  },
  {
    id: "lead_04",
    name: "Aiden Park",
    email: "aiden@parkventures.kr",
    phone: "+82 10 9999 7777",
    serviceInterest: "mainland",
    message:
      "F&B chain, 3 outlets in Korea, want to enter UAE market with 1 location in Yas Mall.",
    source: "website",
    status: "contacted",
    hubspotContactId: "12345004",
    createdAt: isoDaysAgo(6),
  },
  {
    id: "lead_05",
    name: "Sara Ben Salah",
    email: "sara.b@cofounder.tn",
    phone: "+216 22 111 333",
    serviceInterest: "free-zone",
    message: "AI agency, 4 founders, looking at twofour54 vs Masdar.",
    source: "website",
    status: "new",
    hubspotContactId: null,
    createdAt: isoHoursAgo(8),
  },
  {
    id: "lead_06",
    name: "Hamad Al Ali",
    email: "hamad@alalitrading.ae",
    phone: "+971 50 777 8888",
    serviceInterest: "pro-services",
    message: "Need help with MOFA attestation for 5 directors' degrees.",
    source: "walk-in",
    status: "qualified",
    hubspotContactId: "12345006",
    createdAt: isoDaysAgo(3),
  },
  {
    id: "lead_07",
    name: "Priya Nair",
    email: "priya@medarabia.com",
    phone: "+971 55 666 4444",
    serviceInterest: "visa",
    message: "Sponsoring 8 nurses from Kerala on employment visas.",
    source: "referral",
    status: "contacted",
    hubspotContactId: "12345007",
    createdAt: isoDaysAgo(10),
  },
  {
    id: "lead_08",
    name: "Yusuf Bayraktar",
    email: "yusuf@bytechain.io",
    phone: "+971 50 121 3434",
    serviceInterest: "free-zone",
    message: "Crypto wallet startup. ADGM or DMCC?",
    source: "whatsapp",
    status: "new",
    hubspotContactId: null,
    createdAt: isoHoursAgo(2),
  },
  {
    id: "lead_09",
    name: "Elena Rossi",
    email: "elena.r@miladesign.it",
    phone: "+39 02 1234 5678",
    serviceInterest: "free-zone",
    message: "Boutique architecture firm relocating from Milan.",
    source: "website",
    status: "lost",
    hubspotContactId: "12345009",
    createdAt: isoDaysAgo(28),
  },
  {
    id: "lead_10",
    name: "James Okafor",
    email: "j.okafor@blueocean.ng",
    phone: "+234 803 456 7890",
    serviceInterest: "offshore",
    message: "International trading via JAFZA Offshore.",
    source: "website",
    status: "qualified",
    hubspotContactId: "12345010",
    createdAt: isoDaysAgo(12),
  },
];

// Extend portal applications with admin-only fields (assigned consultant).
export type AdminApplication = PortalApplication & {
  assignedToName: string;
};

const ASSIGNEES = [
  "Layla Al Mansouri",
  "Ravi Sundaram",
  "Mariam Khoury",
];

export const ADMIN_APPLICATIONS: AdminApplication[] = [
  ...PORTAL_APPLICATIONS.map((a, i) => ({
    ...a,
    assignedToName: ASSIGNEES[i % ASSIGNEES.length],
  })),
  {
    id: "app_04",
    leadId: "lead_06",
    serviceType: "pro-services",
    serviceLabel: "PRO Services — MOFA attestation × 5",
    stage: "submitted",
    documents: [],
    notes: ["Originals received Tuesday. Submitted to MOFA Wednesday."],
    createdAt: isoDaysAgo(4),
    updatedAt: isoDaysAgo(1),
    primaryContact: "Hamad Al Ali",
    estimatedCompletion: isoDaysAgo(-3).toISOString(),
    assignedToName: "Layla Al Mansouri",
  } as AdminApplication,
  {
    id: "app_05",
    leadId: "lead_07",
    serviceType: "visa",
    serviceLabel: "Employment visas × 8",
    stage: "documents_pending",
    documents: [],
    notes: ["Awaiting attested degree certificates from Kerala."],
    createdAt: isoDaysAgo(9),
    updatedAt: isoDaysAgo(2),
    primaryContact: "Priya Nair",
    estimatedCompletion: isoDaysAgo(-22).toISOString(),
    assignedToName: "Mariam Khoury",
  } as AdminApplication,
  {
    id: "app_06",
    leadId: "lead_10",
    serviceType: "offshore",
    serviceLabel: "Offshore — JAFZA Offshore",
    stage: "draft",
    documents: [],
    notes: ["Drafting structure chart for client review."],
    createdAt: isoDaysAgo(2),
    updatedAt: isoDaysAgo(2),
    primaryContact: "James Okafor",
    estimatedCompletion: isoDaysAgo(-12).toISOString(),
    assignedToName: "Ravi Sundaram",
  } as AdminApplication,
];

export const ADMIN_DOCUMENTS: PortalDocument[] = PORTAL_DOCUMENTS;
export const ADMIN_INVOICES: PortalInvoice[] = [
  ...PORTAL_INVOICES,
  {
    id: "inv_04",
    number: "INV-2026-0404",
    applicationId: "app_05",
    applicationLabel: "Employment visas × 8",
    issueDate: isoDaysAgo(5).toISOString(),
    dueDate: isoDaysAgo(-9).toISOString(),
    amountAed: 32000,
    status: "due",
    pdfUrl: "#",
  },
  {
    id: "inv_05",
    number: "INV-2026-0312",
    applicationId: "app_04",
    applicationLabel: "PRO Services — MOFA attestation × 5",
    issueDate: isoDaysAgo(20).toISOString(),
    dueDate: isoDaysAgo(6).toISOString(),
    amountAed: 4500,
    status: "overdue",
    pdfUrl: "#",
  },
];

export const ADMIN_ACTIVITY: AdminActivity[] = [
  {
    id: "act_01",
    actorClerkId: "user_admin01",
    actorEmail: "ops@synergybusiness.ae",
    actorName: "Layla Al Mansouri",
    action: "lead.status_change",
    entityType: "lead",
    entityId: "lead_06",
    metadata: { from: "new", to: "qualified" },
    createdAt: isoHoursAgo(3),
  },
  {
    id: "act_02",
    actorClerkId: "user_admin02",
    actorEmail: "ops@synergybusiness.ae",
    actorName: "Ravi Sundaram",
    action: "application.stage_change",
    entityType: "application",
    entityId: "app_01",
    metadata: { from: "submitted", to: "documents_pending" },
    createdAt: isoHoursAgo(6),
  },
  {
    id: "act_03",
    actorClerkId: "user_admin01",
    actorEmail: "ops@synergybusiness.ae",
    actorName: "Layla Al Mansouri",
    action: "document.verified",
    entityType: "document",
    entityId: "doc_02",
    metadata: { name: "Proof of address — Emirates Bank.pdf" },
    createdAt: isoHoursAgo(20),
  },
  {
    id: "act_04",
    actorClerkId: "user_admin03",
    actorEmail: "ops@synergybusiness.ae",
    actorName: "Mariam Khoury",
    action: "invoice.marked_paid",
    entityType: "invoice",
    entityId: "inv_01",
    metadata: { amountAed: 18500, number: "INV-2026-0114" },
    createdAt: isoDaysAgo(2),
  },
  {
    id: "act_05",
    actorClerkId: null,
    actorEmail: null,
    actorName: "System",
    action: "lead.created",
    entityType: "lead",
    entityId: "lead_08",
    metadata: { source: "whatsapp" },
    createdAt: isoHoursAgo(2),
  },
];
