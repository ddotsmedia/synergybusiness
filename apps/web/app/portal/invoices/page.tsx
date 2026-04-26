import { Download } from "lucide-react";
import { listInvoices } from "@/lib/portal-data";

export const metadata = {
  title: "Invoices",
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

const STATUS_BADGE: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
  due: "bg-amber-50 text-amber-800 border-amber-200",
  overdue: "bg-red-50 text-red-800 border-red-200",
  draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export default async function InvoicesPage() {
  const PORTAL_INVOICES = await listInvoices();
  const totalOutstanding = PORTAL_INVOICES.filter(
    (i) => i.status === "due" || i.status === "overdue",
  ).reduce((sum, i) => sum + i.amountAed, 0);

  const totalPaid = PORTAL_INVOICES.filter(
    (i) => i.status === "paid",
  ).reduce((sum, i) => sum + i.amountAed, 0);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Invoices
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Billing history
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          All Synergy invoices on your account, with downloadable PDFs.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white border border-border p-5">
          <p className="text-xs uppercase tracking-wide text-[#6b7e96]">
            Outstanding
          </p>
          <p className="mt-1 font-display text-2xl text-[#0a2540]">
            AED {totalOutstanding.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-border p-5">
          <p className="text-xs uppercase tracking-wide text-[#6b7e96]">
            Paid (lifetime)
          </p>
          <p className="mt-1 font-display text-2xl text-[#0a2540]">
            AED {totalPaid.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f9fc] border-b border-border text-left text-xs uppercase tracking-wide text-[#6b7e96]">
            <tr>
              <th className="px-5 py-3 font-semibold">Invoice</th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell">
                Application
              </th>
              <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                Issued
              </th>
              <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                Due
              </th>
              <th className="px-5 py-3 font-semibold text-right">Amount</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold sr-only">PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PORTAL_INVOICES.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#f8f9fc] transition-colors">
                <td className="px-5 py-4 font-medium text-[#0a2540]">
                  {inv.number}
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-[#6b7e96]">
                  {inv.applicationLabel}
                </td>
                <td className="px-5 py-4 hidden sm:table-cell text-[#6b7e96]">
                  {formatDate(inv.issueDate)}
                </td>
                <td className="px-5 py-4 hidden sm:table-cell text-[#6b7e96]">
                  {formatDate(inv.dueDate)}
                </td>
                <td className="px-5 py-4 text-right font-medium text-[#0a2540]">
                  AED {inv.amountAed.toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_BADGE[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {inv.pdfUrl && (
                    <a
                      href={inv.pdfUrl}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0a2540] hover:text-[#c9a84c]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
