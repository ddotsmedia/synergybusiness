import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "drizzle-kit";

// Resolve paths relative to THIS config file regardless of where
// drizzle-kit is invoked from. The root scripts run drizzle-kit via
// `pnpm --filter web exec`, so CWD ends up as apps/web — `./schema.ts`
// would otherwise look for `apps/web/schema.ts`.
const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: path.join(here, "schema.ts"),
  out: path.join(here, "migrations"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
