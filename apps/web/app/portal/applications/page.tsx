import { Calendar, User } from "lucide-react";
import {
  stageBadgeClass,
  stageLabel,
} from "@/lib/portal-mock-data";
import { listApplications } from "@/lib/portal-data";

export const metadata = {
  title: "Applications",
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

export default async function ApplicationsPage() {
  const PORTAL_APPLICATIONS = await listApplications();
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Applications
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          All applications
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Every Synergy engagement on your account, with current stage and
          ETA.
        </p>
      </header>

      <ul className="space-y-4">
        {PORTAL_APPLICATIONS.map((app) => (
          <li
            key={app.id}
            className="rounded-2xl bg-white border border-border p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-display text-xl text-[#0a2540]">
                  {app.serviceLabel}
                </h2>
                <p className="text-xs text-[#6b7e96] mt-1">
                  Reference {app.id.toUpperCase()}
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${stageBadgeClass(app.stage)}`}
              >
                {stageLabel(app.stage)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-[#6b7e96]">
                <Calendar className="h-4 w-4 text-[#c9a84c]" />
                Started {formatDate(app.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-[#6b7e96]">
                <Calendar className="h-4 w-4 text-[#c9a84c]" />
                ETA {formatDate(app.estimatedCompletion)}
              </div>
              <div className="flex items-center gap-2 text-[#6b7e96]">
                <User className="h-4 w-4 text-[#c9a84c]" />
                Lead: {app.primaryContact}
              </div>
            </div>

            {app.notes.length > 0 && (
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs uppercase tracking-wide text-[#6b7e96] font-semibold">
                  Latest notes
                </p>
                <ul className="mt-2.5 space-y-1.5 text-sm text-[#1a2b3c]">
                  {app.notes.map((n, i) => (
                    <li key={i} className="leading-relaxed">
                      • {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
