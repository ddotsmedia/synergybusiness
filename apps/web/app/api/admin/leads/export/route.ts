import { getAdminActor } from "@/lib/admin-auth";
import { listAdminLeads } from "@/lib/admin/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const actor = await getAdminActor();
  if (!actor) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const leads = await listAdminLeads();
  const headers = [
    "id",
    "name",
    "email",
    "phone",
    "service_interest",
    "status",
    "source",
    "hubspot_id",
    "created_at",
    "message",
  ];
  const rows = leads.map((l) => [
    l.id,
    l.name,
    l.email,
    l.phone,
    l.serviceInterest,
    l.status,
    l.source,
    l.hubspotContactId ?? "",
    l.createdAt.toISOString(),
    l.message ?? "",
  ]);

  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ].join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="synergy-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
