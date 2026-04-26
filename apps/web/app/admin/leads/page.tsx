import { LeadsTable } from "@/components/admin/LeadsTable";
import { listAdminLeads } from "@/lib/admin/data";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await listAdminLeads();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          CRM
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">Leads</h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          All inbound enquiries from the website, WhatsApp, referrals and
          walk-ins.
        </p>
      </header>

      <LeadsTable leads={leads} />
    </div>
  );
}
