import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher(["/portal(.*)", "/admin(.*)"]);

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY,
);

const protectedProxy = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

const passthroughProxy = (_req: NextRequest) => NextResponse.next();

export const proxy = hasClerkKeys ? protectedProxy : passthroughProxy;

export const config = {
  matcher: [
    // Run on all paths except static assets and Next.js internals.
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|css|js|woff2?|ttf|otf|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
