/**
 * Centralised place to ask: "is Clerk wired up in this environment?"
 * Used by portal pages and sign-in routes to gracefully degrade when keys
 * aren't set (e.g. local dev without Clerk credentials).
 */
export const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);
