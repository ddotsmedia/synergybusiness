import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export * from "./schema";
export { sql, eq, and, or, asc, desc, ne, inArray } from "drizzle-orm";

export type Database = PostgresJsDatabase<typeof schema>;

let cachedDb: Database | null = null;

/**
 * Returns the Drizzle client when `DATABASE_URL` is set; otherwise `null`.
 * Callers should treat `null` as "DB not configured" and fall back to seed
 * data so the app still works in dev / preview environments.
 */
export function getDb(): Database | null {
  if (cachedDb) return cachedDb;
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  const sqlClient = postgres(url, {
    max: 5,
    prepare: false,
    idle_timeout: 30,
  });
  cachedDb = drizzle(sqlClient, { schema });
  return cachedDb;
}

export const dbConfigured = Boolean(process.env.DATABASE_URL);
