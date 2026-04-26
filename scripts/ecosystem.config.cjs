// PM2 process definition. Run from the repo root:
//
//     pm2 startOrReload scripts/ecosystem.config.cjs
//
// PM2 reads `apps/web/.env.local` via Next.js itself when the process starts.

const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const webDir = path.join(repoRoot, "apps", "web");

module.exports = {
  apps: [
    {
      name: "synergy-web",
      cwd: webDir,
      // Use `pnpm start` so we get exactly the same `next start` command
      // configured in apps/web/package.json.
      script: "pnpm",
      args: "start",
      // Single fork — Next.js handles concurrency itself; multiple PM2
      // instances would each open their own Postgres pool.
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // Ensure Next reads the right port; .env.local can override.
      env: {
        NODE_ENV: "production",
        PORT: process.env.APP_PORT || "3000",
        HOSTNAME: "127.0.0.1",
      },
      // Logs land in ~/.pm2/logs/ by default.
      out_file: path.join(process.env.HOME || "/home/synergy", ".pm2/logs/synergy-web.out.log"),
      error_file: path.join(process.env.HOME || "/home/synergy", ".pm2/logs/synergy-web.err.log"),
      merge_logs: true,
      time: true,
    },
  ],
};
