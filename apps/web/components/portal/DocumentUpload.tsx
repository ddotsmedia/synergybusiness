"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Application = { id: string; label: string };

const DOC_TYPES: { value: string; label: string }[] = [
  { value: "passport", label: "Passport" },
  { value: "emirates_id", label: "Emirates ID" },
  { value: "visa", label: "Visa" },
  { value: "noc", label: "NOC" },
  { value: "moa", label: "MOA" },
  { value: "bank_statement", label: "Bank statement" },
  { value: "other", label: "Other" },
];

type FileState =
  | { status: "queued"; file: File }
  | { status: "uploading"; file: File; progress: number }
  | { status: "done"; file: File }
  | { status: "error"; file: File; message: string };

export function DocumentUpload({
  applications,
}: {
  applications: Application[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [applicationId, setApplicationId] = useState<string>(
    applications[0]?.id ?? "",
  );
  const [docType, setDocType] = useState<string>("other");
  const [files, setFiles] = useState<FileState[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const onPick = useCallback(() => inputRef.current?.click(), []);

  const enqueue = useCallback((picked: FileList | null) => {
    if (!picked) return;
    setFiles((prev) => [
      ...prev,
      ...Array.from(picked).map(
        (file): FileState => ({ status: "queued", file }),
      ),
    ]);
  }, []);

  const removeAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAt = (index: number, next: FileState) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? next : f)));
  };

  const upload = async () => {
    if (!applicationId) return;

    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      if (entry.status !== "queued") continue;
      const { file } = entry;

      try {
        updateAt(i, { status: "uploading", file, progress: 0 });

        // 1. Get a presigned PUT URL from our API
        const presignRes = await fetch("/api/portal/documents/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type || "application/octet-stream",
            applicationId,
            documentType: docType,
            sizeBytes: file.size,
          }),
        });

        if (!presignRes.ok) {
          const body = await presignRes.json().catch(() => ({}));
          const msg =
            (body as { error?: string }).error ?? "Upload not configured";
          throw new Error(msg);
        }

        const { uploadUrl, key } = (await presignRes.json()) as {
          uploadUrl: string;
          key: string;
        };

        // 2. PUT the file directly to R2
        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });

        if (!putRes.ok) {
          throw new Error(`Upload failed: ${putRes.status}`);
        }

        // 3. Tell our API to record metadata
        const metaRes = await fetch("/api/portal/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId,
            name: file.name,
            type: docType,
            fileKey: key,
            sizeBytes: file.size,
          }),
        });

        if (!metaRes.ok && metaRes.status !== 503) {
          const body = await metaRes.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ?? "Failed to record upload",
          );
        }

        updateAt(i, { status: "done", file });
      } catch (err) {
        updateAt(i, {
          status: "error",
          file,
          message: err instanceof Error ? err.message : "Upload failed",
        });
      }
    }

    // Refresh server data so the document list updates
    router.refresh();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    enqueue(e.dataTransfer.files);
  };

  const queuedCount = files.filter((f) => f.status === "queued").length;
  const anyUploading = files.some((f) => f.status === "uploading");

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-[#6b7e96]">
        You don&apos;t have any applications yet — once one is opened by a
        Synergy consultant, you&apos;ll be able to upload documents here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#6b7e96] uppercase tracking-wide">
            Application
          </label>
          <Select
            value={applicationId}
            onValueChange={(v) => setApplicationId(v ?? "")}
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder="Select application" />
            </SelectTrigger>
            <SelectContent>
              {applications.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#6b7e96] uppercase tracking-wide">
            Document type
          </label>
          <Select value={docType} onValueChange={(v) => setDocType(v ?? "")}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={onPick}
        role="button"
        tabIndex={0}
        className={cn(
          "rounded-2xl border-2 border-dashed cursor-pointer transition-colors p-8 text-center",
          dragOver
            ? "border-[#c9a84c] bg-[#c9a84c]/5"
            : "border-border bg-white hover:border-[#c9a84c]/60",
        )}
      >
        <Upload className="mx-auto h-8 w-8 text-[#c9a84c]" />
        <p className="mt-3 font-medium text-[#0a2540]">
          Drag & drop files, or click to browse
        </p>
        <p className="mt-1 text-xs text-[#6b7e96]">
          PDF, PNG, JPG, DOCX. Max 25 MB per file.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
          onChange={(e) => enqueue(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="rounded-2xl bg-white border border-border divide-y divide-border">
          {files.map((entry, i) => (
            <div
              key={`${entry.file.name}-${i}`}
              className="px-4 py-3 flex items-center gap-3 text-sm"
            >
              <FileText className="h-4 w-4 text-[#6b7e96] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-[#0a2540]">{entry.file.name}</p>
                <p className="text-xs text-[#6b7e96]">
                  {(entry.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="text-xs">
                {entry.status === "queued" && (
                  <span className="text-[#6b7e96]">Queued</span>
                )}
                {entry.status === "uploading" && (
                  <span className="inline-flex items-center gap-1.5 text-[#0a2540]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading…
                  </span>
                )}
                {entry.status === "done" && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Uploaded
                  </span>
                )}
                {entry.status === "error" && (
                  <span className="text-red-700">{entry.message}</span>
                )}
              </div>
              {entry.status !== "uploading" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAt(i);
                  }}
                  className="ml-2 h-7 w-7 rounded hover:bg-[#f8f9fc] flex items-center justify-center"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4 text-[#6b7e96]" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={upload}
          disabled={queuedCount === 0 || anyUploading || !applicationId}
          className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
        >
          {anyUploading ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="mr-1 h-4 w-4" />
              {queuedCount > 0
                ? `Upload ${queuedCount} file${queuedCount === 1 ? "" : "s"}`
                : "Upload"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
