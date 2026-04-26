# @synergybusiness/db

Postgres + Drizzle data layer.

## First-time setup

1. Create a Postgres database (Supabase, Neon, Vercel Postgres or self-hosted).
2. Set `DATABASE_URL` in `apps/web/.env.local`.
3. From the repo root, generate migrations and apply them:

```bash
pnpm db:generate     # produces SQL migrations under packages/db/migrations
pnpm db:push         # applies them to DATABASE_URL
```

## Day-to-day

```bash
pnpm db:studio       # opens Drizzle Studio (web UI for the DB)
pnpm db:generate     # after schema changes
pnpm db:push         # apply pending migrations
```

When `DATABASE_URL` is unset, `getDb()` returns `null` and callers fall back
to seed data — the app works without a DB during dev, preview and demos.
