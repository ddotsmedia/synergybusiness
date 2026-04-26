import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ enums */

export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "converted",
  "lost",
]);

export const leadSource = pgEnum("lead_source", [
  "website",
  "whatsapp",
  "referral",
  "walk-in",
]);

export const serviceType = pgEnum("service_type", [
  "mainland",
  "free-zone",
  "offshore",
  "pro-services",
  "visa",
  "golden-visa",
  "other",
]);

export const applicationStage = pgEnum("application_stage", [
  "draft",
  "documents_pending",
  "submitted",
  "processing",
  "approved",
  "rejected",
]);

export const documentType = pgEnum("document_type", [
  "passport",
  "emirates_id",
  "visa",
  "noc",
  "moa",
  "bank_statement",
  "other",
]);

export const invoiceStatus = pgEnum("invoice_status", [
  "draft",
  "due",
  "paid",
  "overdue",
]);

export const userRole = pgEnum("user_role", [
  "admin",
  "consultant",
  "client",
]);

export const activityEntityType = pgEnum("activity_entity_type", [
  "lead",
  "application",
  "document",
  "invoice",
  "user",
  "system",
]);

/* ----------------------------------------------------------------- tables */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clerkUserId: text("clerk_user_id").unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: userRole("role").notNull().default("client"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceInterest: serviceType("service_interest").notNull(),
  message: text("message"),
  source: leadSource("source").notNull().default("website"),
  status: leadStatus("status").notNull().default("new"),
  hubspotContactId: text("hubspot_contact_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  serviceType: serviceType("service_type").notNull(),
  serviceLabel: text("service_label").notNull(),
  freeZoneShort: text("free_zone_short"),
  stage: applicationStage("stage").notNull().default("draft"),
  primaryContact: text("primary_contact").notNull(),
  notes: jsonb("notes").$type<string[]>().notNull().default([]),
  estimatedCompletion: timestamp("estimated_completion", {
    withTimezone: true,
  }),
  assignedToClerkId: text("assigned_to_clerk_id"),
  assignedToName: text("assigned_to_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  actorClerkId: text("actor_clerk_id"),
  actorEmail: text("actor_email"),
  actorName: text("actor_name"),
  action: text("action").notNull(),
  entityType: activityEntityType("entity_type").notNull(),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: uuid("application_id")
    .references(() => applications.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  type: documentType("type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileKey: text("file_key").notNull(),
  sizeKb: integer("size_kb").notNull(),
  verified: boolean("verified").notNull().default(false),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  number: text("number").notNull().unique(),
  applicationId: uuid("application_id").references(() => applications.id, {
    onDelete: "set null",
  }),
  applicationLabel: text("application_label").notNull(),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  amountAed: integer("amount_aed").notNull(),
  status: invoiceStatus("status").notNull().default("draft"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ----------------------------------------------------------------- types */

export type DbUser = typeof users.$inferSelect;
export type DbLead = typeof leads.$inferSelect;
export type NewDbLead = typeof leads.$inferInsert;
export type DbApplication = typeof applications.$inferSelect;
export type DbDocument = typeof documents.$inferSelect;
export type DbInvoice = typeof invoices.$inferSelect;
export type DbActivity = typeof activityLog.$inferSelect;
export type NewDbActivity = typeof activityLog.$inferInsert;
