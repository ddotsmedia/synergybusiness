import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  StickyNote,
  User,
  UserCog,
} from "lucide-react";
import {
  AiSummarizePanel,
  NoteAdder,
  StageChanger,
} from "@/components/admin/ApplicationDetailActions";
import { StageBadge } from "@/components/admin/StatusBadge";
import { getAdminApplication } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await getAdminApplication(id);
  if (!app) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b7e96] hover:text-[#0a2540]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All applications
        </Link>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Application · {app.id.toUpperCase()}
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            {app.serviceLabel}
          </h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <StageBadge stage={app.stage} />
            {app.leadId && (
              <Link
                href={`/admin/leads/${app.leadId}`}
                className="text-xs text-[#c9a84c] hover:underline"
              >
                Linked lead
              </Link>
            )}
          </div>
        </div>
        <StageChanger app={app} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <section className="rounded-2xl bg-white border border-border p-5">
            <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold mb-3">
              Notes ({app.notes.length})
            </p>
            {app.notes.length === 0 ? (
              <p className="text-sm text-[#6b7e96] italic">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {app.notes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-[#1a2b3c]"
                  >
                    <StickyNote className="h-4 w-4 mt-0.5 text-[#c9a84c] flex-shrink-0" />
                    <span className="leading-relaxed">{note}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <NoteAdder app={app} />

          <AiSummarizePanel app={app} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-white border border-border p-5">
            <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
              Details
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              <Meta
                icon={<User className="h-4 w-4" />}
                label="Primary contact"
                value={app.primaryContact}
              />
              <Meta
                icon={<UserCog className="h-4 w-4" />}
                label="Assigned to"
                value={app.assignedToName}
              />
              <Meta
                icon={<Calendar className="h-4 w-4" />}
                label="Started"
                value={new Date(app.createdAt).toLocaleDateString("en-GB", {
                  dateStyle: "medium",
                })}
              />
              <Meta
                icon={<Calendar className="h-4 w-4" />}
                label="ETA"
                value={new Date(app.estimatedCompletion).toLocaleDateString(
                  "en-GB",
                  { dateStyle: "medium" },
                )}
              />
              <Meta
                icon={<Calendar className="h-4 w-4" />}
                label="Last updated"
                value={new Date(app.updatedAt).toLocaleDateString("en-GB", {
                  dateStyle: "medium",
                })}
              />
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-[#6b7e96]">
        <span className="text-[#c9a84c]">{icon}</span>
        {label}
      </span>
      <span className="text-[#0a2540] font-medium text-right">{value}</span>
    </li>
  );
}
