import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createInvoice } from "@/lib/admin/actions";

export const metadata = { title: "New invoice" };
export const dynamic = "force-dynamic";

async function action(formData: FormData) {
  "use server";
  const res = await createInvoice(formData);
  if (res.ok && res.data?.id) {
    redirect(`/admin/invoices/${res.data.id}`);
  }
  redirect(`/admin/invoices?error=${encodeURIComponent(
    res.ok ? "" : res.error,
  )}`);
}

export default function NewInvoicePage() {
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const number = `INV-${new Date().getFullYear()}-${String(
    Math.floor(Math.random() * 9000) + 1000,
  )}`;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-1.5 text-xs text-[#6b7e96] hover:text-[#0a2540]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All invoices
        </Link>
      </div>

      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Billing
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          New invoice
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Issue an invoice. Status defaults to <em>due</em>; mark paid once
          funds clear.
        </p>
      </header>

      <form
        action={action}
        className="rounded-2xl bg-white border border-border p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Invoice number" name="number" defaultValue={number} required />
          <Field
            label="Amount (AED)"
            name="amountAed"
            type="number"
            min={1}
            defaultValue={5000}
            required
          />
        </div>

        <Field
          label="Application label"
          name="applicationLabel"
          placeholder="e.g. Free Zone Setup — ADGM"
          required
        />

        <Field
          label="Application ID (optional)"
          name="applicationId"
          placeholder="app_..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Issue date" name="issueDate" type="date" defaultValue={today} required />
          <Field label="Due date" name="dueDate" type="date" defaultValue={due} required />
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          Invoice creation requires <code className="font-mono">DATABASE_URL</code> to be configured.
          In demo mode the form will return an error — that's expected.
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            render={<Link href="/admin/invoices" />}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
          >
            Create invoice
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  placeholder?: string;
  min?: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs font-medium text-[#6b7e96] uppercase tracking-wide"
      >
        {label}
      </label>
      <Input id={name} name={name} type={type} className="mt-1.5" {...rest} />
    </div>
  );
}
