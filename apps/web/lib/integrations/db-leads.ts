import "server-only";
import { getDb } from "@synergybusiness/db";
import { leads } from "@synergybusiness/db/schema";

type SaveLeadInput = {
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message?: string;
  source?: string;
  hubspotContactId?: string | null;
};

const SERVICE_VALUES = [
  "mainland",
  "free-zone",
  "offshore",
  "pro-services",
  "visa",
  "golden-visa",
  "other",
] as const;

const SOURCE_VALUES = ["website", "whatsapp", "referral", "walk-in"] as const;

type ServiceEnum = (typeof SERVICE_VALUES)[number];
type SourceEnum = (typeof SOURCE_VALUES)[number];

export type DbLeadResult =
  | { status: "ok"; leadId: string }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

export async function persistLead(input: SaveLeadInput): Promise<DbLeadResult> {
  const db = getDb();
  if (!db) return { status: "skipped", reason: "DATABASE_URL not set" };

  const serviceInterest: ServiceEnum = (
    SERVICE_VALUES as readonly string[]
  ).includes(input.serviceInterest)
    ? (input.serviceInterest as ServiceEnum)
    : "other";

  const source: SourceEnum = (SOURCE_VALUES as readonly string[]).includes(
    input.source ?? "",
  )
    ? (input.source as SourceEnum)
    : "website";

  try {
    const [row] = await db
      .insert(leads)
      .values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        serviceInterest,
        message: input.message ?? null,
        source,
        hubspotContactId: input.hubspotContactId ?? null,
      })
      .returning({ id: leads.id });

    return { status: "ok", leadId: row.id };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "DB insert failed",
    };
  }
}
