import { ApplicationsBoard } from "@/components/admin/ApplicationsBoard";
import { listAdminApplications } from "@/lib/admin/data";

export const metadata = { title: "Applications" };
export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const applications = await listAdminApplications();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Pipeline
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Applications
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Every active engagement, organised by stage.
        </p>
      </header>

      <ApplicationsBoard applications={applications} />
    </div>
  );
}
