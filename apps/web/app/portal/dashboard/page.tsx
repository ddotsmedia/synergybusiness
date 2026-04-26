import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  FileWarning,
  Receipt,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { stageBadgeClass, stageLabel } from "@/lib/portal-mock-data";
import {
  getPortalSummary,
  listApplications,
  listInvoices,
} from "@/lib/portal-data";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  const [summary, applications, invoices] = await Promise.all([
    getPortalSummary(),
    listApplications(),
    listInvoices(),
  ]);

  const activeApps = applications
    .filter((a) => a.stage !== "approved" && a.stage !== "rejected")
    .slice(0, 3);
  const recentInvoices = [...invoices]
    .sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Dashboard
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Snapshot of your active applications, pending documents and
          outstanding invoices.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Active applications"
          value={summary.activeApplications.toString()}
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Completed"
          value={summary.completedApplications.toString()}
        />
        <SummaryCard
          icon={<FileWarning className="h-5 w-5" />}
          label="Pending docs"
          value={summary.pendingDocuments.toString()}
          accent={summary.pendingDocuments > 0}
        />
        <SummaryCard
          icon={<Receipt className="h-5 w-5" />}
          label="Outstanding"
          value={
            summary.outstandingAed > 0
              ? `AED ${summary.outstandingAed.toLocaleString()}`
              : "AED 0"
          }
          accent={summary.outstandingAed > 0}
        />
      </div>

      <section className="rounded-2xl bg-white border border-border p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-xl text-[#0a2540]">
              Active applications
            </h2>
            <p className="text-sm text-[#6b7e96]">
              The work currently in flight with Synergy
            </p>
          </div>
          <Link
            href="/portal/applications"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a2540] hover:text-[#c9a84c]"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-6 divide-y divide-border">
          {activeApps.map((app) => (
            <li
              key={app.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-medium text-[#0a2540]">
                  {app.serviceLabel}
                </p>
                <p className="text-xs text-[#6b7e96] mt-0.5">
                  Started {formatDate(app.createdAt)} · Lead{" "}
                  {app.primaryContact}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stageBadgeClass(app.stage)}`}
                >
                  {stageLabel(app.stage)}
                </span>
                <span className="text-xs text-[#6b7e96] hidden sm:inline">
                  ETA {formatDate(app.estimatedCompletion)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-2xl bg-white border border-border p-6">
          <h2 className="font-display text-xl text-[#0a2540]">
            Recent invoices
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {recentInvoices.map((inv) => (
              <li
                key={inv.id}
                className="py-3 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-[#0a2540]">{inv.number}</p>
                  <p className="text-xs text-[#6b7e96] mt-0.5">
                    {inv.applicationLabel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#0a2540]">
                    AED {inv.amountAed.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      inv.status === "paid"
                        ? "text-emerald-700"
                        : inv.status === "overdue"
                          ? "text-red-700"
                          : "text-amber-700"
                    }`}
                  >
                    {inv.status === "paid"
                      ? `Paid · ${formatDate(inv.dueDate)}`
                      : `Due ${formatDate(inv.dueDate)}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <Link
              href="/portal/invoices"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a2540] hover:text-[#c9a84c]"
            >
              All invoices
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="rounded-2xl bg-[#0a2540] text-white p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#c9a84c]/15 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/15 px-2.5 py-1 text-xs font-semibold text-[#e8c96b]">
              <Sparkles className="h-3.5 w-3.5" />
              Tip from your consultant
            </div>
            <h2 className="mt-4 font-display text-xl">
              Plan your bank application now
            </h2>
            <p className="mt-2 text-sm text-white/75 leading-relaxed">
              Your ADGM licence is days away. Banks like Mashreq Neo and Wio
              accept full applications before licence issuance — pre-staging
              now can save you 2–3 weeks of post-licence wait time.
            </p>
            <Button
              render={<a href="https://wa.me/971500000000" />}
              className="mt-5 bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
            >
              WhatsApp my consultant
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${accent ? "bg-[#c9a84c]/10 border-[#c9a84c]/30" : "bg-white border-border"}`}
    >
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center ${accent ? "bg-[#c9a84c] text-[#0a2540]" : "bg-[#0a2540]/5 text-[#0a2540]"}`}
      >
        {icon}
      </div>
      <div className="mt-3 text-xs uppercase tracking-wide text-[#6b7e96]">
        {label}
      </div>
      <div className="mt-0.5 font-display text-xl text-[#0a2540]">
        {value}
      </div>
    </div>
  );
}
