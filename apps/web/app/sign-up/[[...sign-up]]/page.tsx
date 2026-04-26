import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { clerkConfigured } from "@/lib/auth";

export const metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-navy-pattern flex items-center justify-center px-4 py-12">
      {clerkConfigured ? (
        <SignUp
          appearance={{
            variables: { colorPrimary: "#0a2540" },
          }}
        />
      ) : (
        <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center">
          <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
            Sign-up
          </p>
          <h1 className="mt-2 font-display text-2xl text-[#0a2540]">
            Account creation is not yet configured
          </h1>
          <p className="mt-3 text-sm text-[#6b7e96]">
            Set Clerk environment variables in{" "}
            <code className="font-mono text-xs">.env.local</code> to enable
            account creation.
          </p>
          <div className="mt-6">
            <Button
              render={<Link href="/contact" />}
              className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
            >
              Contact us instead
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
