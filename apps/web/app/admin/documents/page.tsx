import { DocumentsBoard } from "@/components/admin/DocumentsBoard";
import { listAdminDocuments } from "@/lib/admin/data";

export const metadata = { title: "Documents" };
export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const documents = await listAdminDocuments();
  const pending = documents.filter((d) => !d.verified).length;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Compliance
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Documents
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Verify uploaded documents and bulk-process the queue.
          {pending > 0 && (
            <>
              {" "}
              <strong className="text-[#0a2540]">
                {pending} pending review.
              </strong>
            </>
          )}
        </p>
      </header>

      <DocumentsBoard documents={documents} />
    </div>
  );
}
