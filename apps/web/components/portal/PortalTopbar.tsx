import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { clerkConfigured } from "@/lib/auth";

export function PortalTopbar() {
  return (
    <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl text-[#0a2540]">Synergy</span>
          <span className="font-display text-xl text-gold-gradient">
            Business
          </span>
          <span className="ml-2 hidden sm:inline-flex items-center gap-1 rounded-full border border-border bg-[#f8f9fc] px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-[#6b7e96]">
            Client portal
          </span>
        </Link>

        {clerkConfigured ? (
          <>
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-9 w-9" },
                }}
              />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button className="bg-[#0a2540] hover:bg-[#071a2e] text-white">
                  Sign in
                </Button>
              </SignInButton>
            </Show>
          </>
        ) : (
          <span className="text-xs px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-900">
            Demo mode · Clerk not configured
          </span>
        )}
      </div>
    </div>
  );
}
