/**
 * Server-side admin role gate.
 *
 * Clerk-configured: requires the signed-in user's `publicMetadata.role` to
 * be `"admin"`. In demo mode (Clerk not configured) the gate is open so the
 * admin panel is browsable as a UI showcase.
 */
import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkConfigured } from "@/lib/auth";

export type AdminActor = {
  clerkUserId: string | null;
  email: string | null;
  name: string | null;
  role: "admin" | "consultant" | "client" | "demo";
};

/**
 * Resolve the current admin actor. Use this inside layout/page components
 * and server actions. Throws (redirects) when access is denied.
 */
export async function requireAdmin(): Promise<AdminActor> {
  if (!clerkConfigured) {
    return {
      clerkUserId: null,
      email: null,
      name: "Demo admin",
      role: "demo",
    };
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/admin");

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  const role = meta.role;

  if (role !== "admin" && role !== "consultant") {
    redirect("/?error=not-authorized");
  }

  return {
    clerkUserId: userId,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    name:
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.username ||
      "Admin",
    role: role === "admin" ? "admin" : "consultant",
  };
}

/**
 * Same as requireAdmin but never redirects — returns null when the caller
 * isn't an admin. Useful inside server actions where you want to return a
 * structured error rather than a redirect.
 */
export async function getAdminActor(): Promise<AdminActor | null> {
  if (!clerkConfigured) {
    return {
      clerkUserId: null,
      email: null,
      name: "Demo admin",
      role: "demo",
    };
  }
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as { role?: string };
  const role = meta.role;
  if (role !== "admin" && role !== "consultant") return null;
  return {
    clerkUserId: userId,
    email: user?.primaryEmailAddress?.emailAddress ?? null,
    name:
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.username ||
      "Admin",
    role: role === "admin" ? "admin" : "consultant",
  };
}
