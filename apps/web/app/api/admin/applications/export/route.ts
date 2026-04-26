import { getAdminActor } from "@/lib/admin-auth";
import { listAdminApplications } from "@/lib/admin/data";

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

  const apps = await listAdminApplications();
  const headers = [
    "id",
    "service_label",
    "service_type",
    "stage",
    "primary_contact",
    "assigned_to",
    "lead_id",
    "estimated_completion",
    "created_at",
    "updated_at",
    "notes_count",
  ];
  const rows = apps.map((a) => [
    a.id,
    a.serviceLabel,
    a.serviceType,
    a.stage,
    a.primaryContact,
    a.assignedToName,
    a.leadId,
    a.estimatedCompletion,
    a.createdAt.toISOString(),
    a.updatedAt.toISOString(),
    a.notes.length,
  ]);

  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ].join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="synergy-applications-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
