import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs/server";
import { clerkConfigured } from "@/lib/auth";
import { getR2, r2Bucket, r2Configured } from "@/lib/integrations/r2";

export const runtime = "nodejs";

const schema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
  applicationId: z.string().min(1).max(80),
  documentType: z
    .enum([
      "passport",
      "emirates_id",
      "visa",
      "noc",
      "moa",
      "bank_statement",
      "other",
    ])
    .default("other"),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024), // 25 MB cap
});

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

export async function POST(req: Request) {
  // Auth gate when Clerk is configured.
  if (clerkConfigured) {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!r2Configured) {
    return Response.json(
      { error: "Document uploads are not configured" },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (!ALLOWED_MIME.has(parsed.data.contentType)) {
    return Response.json(
      { error: "Unsupported file type" },
      { status: 415 },
    );
  }

  const safeName = parsed.data.filename.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const key = `applications/${parsed.data.applicationId}/${Date.now()}-${safeName}`;

  const client = getR2();
  if (!client) {
    return Response.json({ error: "R2 unavailable" }, { status: 503 });
  }

  const url = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      ContentType: parsed.data.contentType,
      ContentLength: parsed.data.sizeBytes,
    }),
    { expiresIn: 60 * 5 }, // 5 minutes
  );

  return Response.json({
    uploadUrl: url,
    key,
    method: "PUT",
    headers: { "Content-Type": parsed.data.contentType },
    expiresInSeconds: 300,
  });
}
