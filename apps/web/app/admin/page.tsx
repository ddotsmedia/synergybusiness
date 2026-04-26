import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileWarning,
  Inbox,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { HBar, Sparkline } from "@/components/admin/Charts";
import { listActivity } from "@/lib/admin/activity";
import { getAdminDashboard } from "@/lib/admin/data";

export default async function AdminDashboardPage() {
  const [dash, activity] = await Promise.all([
    getAdminDashboard(),
    listActivity(8),
  ]);

  const sources = Object.entries(dash.bySource).sort(
    ([, a], [, b]) => b - a,
  );
  const sourceMax = Math.max(1, ...sources.map(([, v]) => v));
  const sourceTotal = sources.reduce((s, [, v]) => s + v, 0);

  const STAGE_LABELS: Record<string, string> = {
    draft: "Draft",
    documents_pending: "Documents pending",
    submitted: "Submitted",
    processing: "Processing",
    approved: "Approved",
    rejected: "Rejected",
  };
  const stages = [
    "draft",
    "documents_pending",
    "submitted",
    "processing",
    "approved",
  ];
  const stageTotal = stages.reduce(
    (s, k) => s + (dash.byStage[k] ?? 0),
    0,
  );
  const stageMax = Math.max(1, ...stages.map((k) => dash.byStage[k] ?? 0));

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            Operations overview
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-[#0a2540] hover:border-[#c9a84c]"
          >
            View leads
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a2540] px-3 py-1.5 text-sm text-white hover:bg-[#071a2e]"
          >
            View applications
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Top KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={<Inbox className="h-4 w-4" />}
          label="New leads (today)"
          value={dash.counts.newLeadsToday.toString()}
          sub={`${dash.counts.newLeads7d} in last 7d`}
          accent
        />
        <KpiCard
          icon={<Briefcase className="h-4 w-4" />}
          label="Active applications"
          value={dash.counts.activeApps.toString()}
          sub={`${dash.counts.completedApps} completed`}
        />
        <KpiCard
          icon={<FileWarning className="h-4 w-4" />}
          label="Pending documents"
          value={dash.counts.pendingDocs.toString()}
          sub="Awaiting verification"
          warn={dash.counts.pendingDocs > 3}
        />
        <KpiCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Conversion rate"
          value={`${dash.counts.convertedRate}%`}
          sub={`${dash.counts.totalLeads} total leads`}
        />
      </div>

      {/* Revenue strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
                14-day leads
              </p>
              <p className="font-display text-2xl text-[#0a2540] mt-1">
                {dash.sparkline.reduce((s, v) => s + v, 0)} leads
              </p>
            </div>
            <Sparkline values={dash.sparkline} />
          </div>
        </div>
        <div className="rounded-2xl bg-[#0a2540] text-white p-6">
          <div className="flex items-center gap-2 text-[#c9a84c]">
            <Receipt className="h-4 w-4" />
            <p className="text-xs uppercase tracking-wider font-semibold">
              Cash position
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60">Outstanding</p>
              <p className="font-display text-xl text-white mt-0.5">
                AED {dash.revenue.outstandingAed.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60">Paid (30d)</p>
              <p className="font-display text-xl text-[#e8c96b] mt-0.5">
                AED {dash.revenue.paidMtd.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white border border-border p-6">
          <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
            Leads by source
          </p>
          <div className="mt-4 space-y-3.5">
            {sources.length === 0 ? (
              <p className="text-sm text-[#6b7e96]">No leads recorded.</p>
            ) : (
              sources.map(([src, val]) => (
                <HBar
                  key={src}
                  label={src}
                  value={val}
                  max={sourceMax}
                  total={sourceTotal}
                  color="#c9a84c"
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border p-6">
          <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
            Applications by stage
          </p>
          <div className="mt-4 space-y-3.5">
            {stages.map((stage) => (
              <HBar
                key={stage}
                label={STAGE_LABELS[stage]}
                value={dash.byStage[stage] ?? 0}
                max={stageMax}
                total={stageTotal}
                color="#0a2540"
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
              Recent activity
            </p>
            <Link
              href="/admin/activity"
              className="text-xs text-[#c9a84c] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex-1 -mx-3">
            <ActivityFeed items={activity} />
          </div>
        </div>
      </div>

      {/* Quick stat callout */}
      <div className="rounded-2xl border-l-4 border-[#c9a84c] bg-white p-5 flex items-center gap-4">
        <TrendingUp className="h-5 w-5 text-[#c9a84c]" />
        <p className="text-sm text-[#1a2b3c]">
          You have{" "}
          <strong>{dash.counts.newLeadsToday} new leads today</strong> and{" "}
          <strong>{dash.counts.pendingDocs} documents</strong> awaiting your
          verification. Tip: <kbd className="font-mono text-xs px-1 py-0.5 rounded bg-[#f8f9fc] border border-border">Ctrl+K</kbd> to jump anywhere.
        </p>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent = false,
  warn = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  warn?: boolean;
}) {
  const tone = warn
    ? "border-amber-200 bg-amber-50"
    : accent
      ? "border-[#c9a84c]/40 bg-[#c9a84c]/5"
      : "border-border bg-white";
  return (
    <div className={`rounded-2xl border p-5 ${tone}`}>
      <div className="flex items-center gap-2 text-[#6b7e96]">
        {icon}
        <p className="text-xs uppercase tracking-wider font-semibold">{label}</p>
      </div>
      <p className="mt-3 font-display text-3xl text-[#0a2540]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[#6b7e96]">{sub}</p>}
    </div>
  );
}
