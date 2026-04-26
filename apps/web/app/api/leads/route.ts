import { z } from "zod";
import { persistLead } from "@/lib/integrations/db-leads";
import { pushLeadToHubSpot } from "@/lib/integrations/hubspot";
import {
  sendInternalLeadNotification,
  sendLeadConfirmation,
} from "@/lib/integrations/resend";

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(180),
  phone: z.string().min(7).max(40),
  serviceInterest: z.string().min(1).max(40),
  message: z.string().max(2000).optional(),
  source: z.string().max(40).optional(),
  // Honeypot — bots fill, humans don't see it.
  website: z.string().max(0).optional(),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  // Honeypot triggered — pretend success, do nothing.
  if (parsed.data.website) {
    return jsonResponse({ ok: true }, 200);
  }

  const lead = {
    name: parsed.data.name.trim(),
    email: parsed.data.email.trim().toLowerCase(),
    phone: parsed.data.phone.trim(),
    serviceInterest: parsed.data.serviceInterest,
    message: parsed.data.message?.trim() || undefined,
    source: parsed.data.source ?? "website",
  };

  // HubSpot first so we can persist its contact id alongside the lead row.
  const hubspot = await pushLeadToHubSpot(lead);
  const hubspotContactId =
    hubspot.status === "ok" ? hubspot.contactId : null;

  const [db, userEmail, internalEmail] = await Promise.all([
    persistLead({ ...lead, hubspotContactId }),
    sendLeadConfirmation(lead),
    sendInternalLeadNotification(lead),
  ]);

  // Always log so the lead is recoverable from server logs even if every
  // integration is offline.
  console.log("[lead]", {
    lead,
    integrations: { hubspot, db, userEmail, internalEmail },
  });

  return jsonResponse(
    {
      ok: true,
      integrations: {
        db: db.status,
        hubspot: hubspot.status,
        userEmail: userEmail.status,
        internalEmail: internalEmail.status,
      },
    },
    200,
  );
}
