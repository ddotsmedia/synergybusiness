import { CheckCircle2, XCircle } from "lucide-react";
import { dbConfigured } from "@synergybusiness/db";
import { clerkConfigured } from "@/lib/auth";
import { sanityConfigured } from "@/lib/integrations/sanity";
import { r2Configured } from "@/lib/integrations/r2";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

const integrations = [
  {
    key: "anthropic",
    name: "Anthropic Claude API",
    purpose: "Chat widget, calculator AI explanation, admin draft + summarize",
    envVars: ["ANTHROPIC_API_KEY"],
    isSet: () => Boolean(process.env.ANTHROPIC_API_KEY),
  },
  {
    key: "clerk",
    name: "Clerk authentication",
    purpose: "Sign-in / role gate for /portal and /admin",
    envVars: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
    isSet: () => clerkConfigured,
  },
  {
    key: "database",
    name: "PostgreSQL (Drizzle)",
    purpose: "Leads, applications, documents, invoices, activity log",
    envVars: ["DATABASE_URL"],
    isSet: () => dbConfigured,
  },
  {
    key: "hubspot",
    name: "HubSpot CRM",
    purpose: "Sync new leads to your CRM contact list",
    envVars: ["HUBSPOT_API_KEY"],
    isSet: () => Boolean(process.env.HUBSPOT_API_KEY),
  },
  {
    key: "resend",
    name: "Resend email",
    purpose: "Lead confirmation + internal notification emails",
    envVars: ["RESEND_API_KEY", "EMAIL_FROM", "LEAD_NOTIFICATION_EMAIL"],
    isSet: () => Boolean(process.env.RESEND_API_KEY),
  },
  {
    key: "sanity",
    name: "Sanity blog CMS",
    purpose: "Content for /blog (falls back to in-repo seed posts)",
    envVars: ["NEXT_PUBLIC_SANITY_PROJECT_ID", "SANITY_API_TOKEN"],
    isSet: () => sanityConfigured,
  },
  {
    key: "r2",
    name: "Cloudflare R2",
    purpose: "Document uploads in client portal",
    envVars: [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_NAME",
    ],
    isSet: () => r2Configured,
  },
];

export default function SettingsPage() {
  const summary = integrations.map((i) => ({ ...i, ok: i.isSet() }));
  const liveCount = summary.filter((s) => s.ok).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Settings
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Integrations
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          {liveCount} of {summary.length} integrations are wired up. Set the
          missing env vars in <code className="font-mono">apps/web/.env.local</code>{" "}
          (or your hosting dashboard) and reload the app.
        </p>
      </header>

      <section className="rounded-2xl bg-white border border-border overflow-hidden">
        <ul className="divide-y divide-border">
          {summary.map((it) => (
            <li
              key={it.key}
              className="px-5 py-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {it.ok ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-zinc-300 flex-shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className="font-display text-base text-[#0a2540]">
                    {it.name}
                  </p>
                  <p className="text-xs text-[#6b7e96] mt-0.5">
                    {it.purpose}
                  </p>
                  <p className="mt-2 flex flex-wrap gap-1">
                    {it.envVars.map((v) => (
                      <code
                        key={v}
                        className="text-[10px] font-mono bg-[#f8f9fc] border border-border rounded px-1.5 py-0.5 text-[#0a2540]"
                      >
                        {v}
                      </code>
                    ))}
                  </p>
                </div>
              </div>
              <span
                className={
                  it.ok
                    ? "text-xs uppercase tracking-wider rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 font-semibold whitespace-nowrap"
                    : "text-xs uppercase tracking-wider rounded-full border border-border bg-[#f8f9fc] text-[#6b7e96] px-2.5 py-0.5 font-semibold whitespace-nowrap"
                }
              >
                {it.ok ? "Live" : "Not set"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
