import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { requireAdmin } from "@/lib/admin-auth";
import {
  listAdminApplications,
  listAdminLeads,
} from "@/lib/admin/data";
import { clerkConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "Admin", template: "%s | Synergy Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = await requireAdmin();

  // Light search payload for the command palette. We don't ship full DB
  // rows to the client; just enough for display + URL navigation.
  const [leads, applications] = await Promise.all([
    listAdminLeads(),
    listAdminApplications(),
  ]);

  const searchData = {
    leads: leads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      status: l.status,
    })),
    applications: applications.map((a) => ({
      id: a.id,
      serviceLabel: a.serviceLabel,
      primaryContact: a.primaryContact,
      stage: a.stage,
    })),
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <AdminTopbar
        actor={{ name: actor.name, role: actor.role }}
        clerkConfigured={clerkConfigured}
        searchData={searchData}
      />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 min-w-0">
          {!clerkConfigured && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-900">
              <strong>Demo mode.</strong> Clerk auth is not configured —
              everyone can see this admin panel. Set{" "}
              <code className="font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
              and{" "}
              <code className="font-mono">CLERK_SECRET_KEY</code>, then mark
              your account as admin in Clerk public metadata
              (<code className="font-mono">{`{ "role": "admin" }`}</code>) to lock
              this down.
            </div>
          )}

          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
