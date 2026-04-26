import { CheckCircle2, Clock, FileText } from "lucide-react";
import { DocumentUpload } from "@/components/portal/DocumentUpload";
import { listApplications, listDocuments } from "@/lib/portal-data";

export const metadata = {
  title: "Documents",
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

const TYPE_LABEL: Record<string, string> = {
  passport: "Passport",
  emirates_id: "Emirates ID",
  visa: "Visa",
  noc: "NOC",
  moa: "MOA",
  bank_statement: "Bank statement",
  other: "Other",
};

export default async function DocumentsPage() {
  const [PORTAL_DOCUMENTS, applications] = await Promise.all([
    listDocuments(),
    listApplications(),
  ]);
  const uploadTargets = applications.map((a) => ({
    id: a.id,
    label: a.serviceLabel,
  }));
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Documents
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Your document vault
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Everything you&apos;ve uploaded — and what we still need from you.
        </p>
      </header>

      <DocumentUpload applications={uploadTargets} />

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f9fc] border-b border-border text-left text-xs uppercase tracking-wide text-[#6b7e96]">
            <tr>
              <th className="px-5 py-3 font-semibold">File</th>
              <th className="px-5 py-3 font-semibold hidden sm:table-cell">
                Type
              </th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell">
                Application
              </th>
              <th className="px-5 py-3 font-semibold hidden md:table-cell">
                Uploaded
              </th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PORTAL_DOCUMENTS.map((doc) => (
              <tr key={doc.id} className="hover:bg-[#f8f9fc] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-[#0a2540]/5 text-[#0a2540] flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0a2540]">{doc.name}</p>
                      <p className="text-xs text-[#6b7e96]">
                        {(doc.sizeKb / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell text-[#6b7e96]">
                  {TYPE_LABEL[doc.type] ?? doc.type}
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-[#6b7e96]">
                  {doc.applicationLabel}
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-[#6b7e96]">
                  {formatDate(doc.uploadedAt)}
                </td>
                <td className="px-5 py-4">
                  {doc.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-800 border-amber-200">
                      <Clock className="h-3 w-3" />
                      Pending review
                    </span>
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
