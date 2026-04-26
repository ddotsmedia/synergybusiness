import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@synergybusiness/db";
import { documents } from "@synergybusiness/db/schema";
import { clerkConfigured } from "@/lib/auth";
import { r2PublicBaseUrl } from "@/lib/integrations/r2";

export const runtime = "nodejs";

const schema = z.object({
  applicationId: z.string().min(1).max(80),
  name: z.string().min(1).max(200),
  type: z.enum([
    "passport",
    "emirates_id",
    "visa",
    "noc",
    "moa",
    "bank_statement",
    "other",
  ]),
  fileKey: z.string().min(1).max(400),
  sizeBytes: z.number().int().positive(),
});

export async function POST(req: Request) {
  if (clerkConfigured) {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
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

  const db = getDb();
  if (!db) {
    return Response.json(
      { error: "Database not configured", note: "Upload metadata not persisted" },
      { status: 503 },
    );
  }

  const fileUrl = r2PublicBaseUrl
    ? `${r2PublicBaseUrl.replace(/\/$/, "")}/${parsed.data.fileKey}`
    : `r2://${parsed.data.fileKey}`;

  const sizeKb = Math.ceil(parsed.data.sizeBytes / 1024);

  try {
    const [row] = await db
      .insert(documents)
      .values({
        applicationId: parsed.data.applicationId,
        name: parsed.data.name,
        type: parsed.data.type,
        fileKey: parsed.data.fileKey,
        fileUrl,
        sizeKb,
        verified: false,
      })
      .returning();
    return Response.json({ ok: true, document: row });
  } catch (err) {
    return Response.json(
      {
        error: "DB insert failed",
        message: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 },
    );
  }
}
