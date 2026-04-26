import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/admin/StatusBadge";
import { InvoiceStatusChanger } from "@/components/admin/InvoiceDetailActions";
import { getAdminInvoice } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getAdminInvoice(id);
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b7e96] hover:text-[#0a2540]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All invoices
        </Link>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Invoice
          </p>
          <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
            {invoice.number}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <InvoiceStatusBadge status={invoice.status} />
            {invoice.applicationId && (
              <Link
                href={`/admin/applications/${invoice.applicationId}`}
                className="text-xs text-[#c9a84c] hover:underline"
              >
                {invoice.applicationLabel}
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <InvoiceStatusChanger invoice={invoice} />
          {invoice.pdfUrl && (
            <Button
              render={<a href={invoice.pdfUrl} download />}
              variant="outline"
              size="sm"
            >
              <Download className="mr-1 h-3.5 w-3.5" />
              PDF
            </Button>
          )}
        </div>
      </header>

      <section className="rounded-2xl bg-white border border-border p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Field
            icon={<Calendar className="h-4 w-4" />}
            label="Issued"
            value={formatDate(invoice.issueDate)}
          />
          <Field
            icon={<Calendar className="h-4 w-4" />}
            label="Due"
            value={formatDate(invoice.dueDate)}
          />
          <Field
            icon={null}
            label="Amount"
            value={`AED ${invoice.amountAed.toLocaleString()}`}
            big
          />
        </div>
      </section>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  big = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
        {icon && <span className="text-[#c9a84c]">{icon}</span>}
        {label}
      </div>
      <p
        className={
          big
            ? "mt-2 font-display text-3xl text-[#0a2540]"
            : "mt-2 text-[#0a2540]"
        }
      >
        {value}
      </p>
    </div>
  );
}
