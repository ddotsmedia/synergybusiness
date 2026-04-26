import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { clerkConfigured } from "@/lib/auth";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <PortalTopbar />

      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {!clerkConfigured && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Demo mode.</strong> Clerk authentication is not configured
            yet. Set <code className="font-mono text-xs">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
            and <code className="font-mono text-xs">CLERK_SECRET_KEY</code> in{" "}
            <code className="font-mono text-xs">.env.local</code> to require
            sign-in for portal routes.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <PortalSidebar />
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
