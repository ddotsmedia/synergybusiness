import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

let cachedClient: S3Client | null = null;

export const r2Configured = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME,
);

export const r2Bucket = process.env.R2_BUCKET_NAME ?? "";
export const r2PublicBaseUrl = process.env.R2_PUBLIC_URL ?? "";

export function getR2(): S3Client | null {
  if (!r2Configured) return null;
  if (cachedClient) return cachedClient;

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    },
  });
  return cachedClient;
}
