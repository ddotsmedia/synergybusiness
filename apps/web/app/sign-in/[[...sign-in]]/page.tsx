import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { clerkConfigured } from "@/lib/auth";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-navy-pattern flex items-center justify-center px-4 py-12">
      {clerkConfigured ? (
        <SignIn
          appearance={{
            variables: { colorPrimary: "#0a2540" },
          }}
        />
      ) : (
        <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center">
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Sign-in
          </p>
          <h1 className="mt-2 font-display text-2xl text-[#0a2540]">
            Authentication is not yet configured
          </h1>
          <p className="mt-3 text-sm text-[#6b7e96]">
            Set Clerk environment variables in{" "}
            <code className="font-mono text-xs">.env.local</code> to enable
            sign-in for this site.
          </p>
          <div className="mt-6">
            <Button
              render={<Link href="/" />}
              className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
            >
              Back to home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
