import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  Tag,
  User,
} from "lucide-react";
import {
  AiDraftPanel,
  LeadStatusChanger,
} from "@/components/admin/LeadDetailActions";
import { LeadStatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { getAdminLead } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

const SERVICE_LABELS: Record<string, string> = {
  mainland: "Mainland Setup",
  "free-zone": "Free Zone Setup",
  offshore: "Offshore Company",
  "pro-services": "PRO Services",
  visa: "Visa Services",
  "golden-visa": "Golden Visa",
  other: "Other",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getAdminLead(id);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b7e96] hover:text-[#0a2540]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All leads
        </Link>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Lead
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            {lead.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <LeadStatusBadge status={lead.status} />
            <span className="text-xs text-[#6b7e96] capitalize">
              {SERVICE_LABELS[lead.serviceInterest] ?? lead.serviceInterest}
            </span>
            <span className="text-xs text-[#6b7e96]">·</span>
            <span className="text-xs text-[#6b7e96] capitalize">
              {lead.source}
            </span>
            {lead.hubspotContactId && (
              <a
                href={`https://app.hubspot.com/contacts/_/contact/${lead.hubspotContactId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#c9a84c] hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                HubSpot
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LeadStatusChanger lead={lead} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <section className="rounded-2xl bg-white border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
              Original message
            </p>
            <p className="mt-3 text-[15px] text-[#1a2b3c] leading-relaxed whitespace-pre-wrap">
              {lead.message ?? "No message provided."}
            </p>
          </section>

          <AiDraftPanel lead={lead} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-white border border-border p-5">
            <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
              Contact
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${lead.email}`}
                  className="text-[#0a2540] hover:text-[#c9a84c] break-all"
                >
                  {lead.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${lead.phone.replace(/\s/g, "")}`}
                  className="text-[#0a2540] hover:text-[#c9a84c]"
                >
                  {lead.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquare className="h-4 w-4 text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0a2540] hover:text-[#c9a84c]"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white border border-border p-5">
            <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
              Metadata
            </p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <Meta
                icon={<Tag className="h-4 w-4" />}
                label="Service interest"
                value={
                  SERVICE_LABELS[lead.serviceInterest] ??
                  lead.serviceInterest
                }
              />
              <Meta
                icon={<User className="h-4 w-4" />}
                label="Source"
                value={
                  lead.source.charAt(0).toUpperCase() + lead.source.slice(1)
                }
              />
              <Meta
                icon={<Calendar className="h-4 w-4" />}
                label="Captured"
                value={new Date(lead.createdAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
            </ul>
          </section>

          <Button
            render={<a href={`mailto:${lead.email}`} />}
            className="w-full bg-[#0a2540] hover:bg-[#071a2e] text-white"
          >
            <Mail className="mr-1.5 h-4 w-4" />
            Send email
          </Button>
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
