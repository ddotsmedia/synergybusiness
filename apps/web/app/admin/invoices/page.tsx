import { InvoicesTable } from "@/components/admin/InvoicesTable";
import { listAdminInvoices } from "@/lib/admin/data";

export const metadata = { title: "Invoices" };
export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const invoices = await listAdminInvoices();

  const outstanding = invoices
    .filter((i) => i.status === "due" || i.status === "overdue")
    .reduce((s, i) => s + i.amountAed, 0);
  const paid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amountAed, 0);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Billing
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Invoices
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Issue, track and reconcile client invoices.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs uppercase tracking-wider text-amber-900 font-semibold">
            Outstanding
          </p>
          <p className="mt-2 font-display text-2xl text-[#0a2540]">
            AED {outstanding.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs uppercase tracking-wider text-emerald-900 font-semibold">
            Paid (lifetime)
          </p>
          <p className="mt-2 font-display text-2xl text-[#0a2540]">
            AED {paid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[#6b7e96] font-semibold">
            Total invoices
          </p>
          <p className="mt-2 font-display text-2xl text-[#0a2540]">
            {invoices.length}
          </p>
        </div>
      </div>

      <InvoicesTable invoices={invoices} />
    </div>
  );
}
