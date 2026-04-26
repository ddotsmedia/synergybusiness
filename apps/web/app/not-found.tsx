import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const QUICK_LINKS = [
  { label: "Mainland Setup", href: "/services/mainland" },
  { label: "Free Zone Setup", href: "/services/free-zone" },
  { label: "Golden Visa", href: "/services/golden-visa" },
  { label: "Compare free zones", href: "/free-zones" },
  { label: "Cost calculator", href: "/cost-calculator" },
  { label: "About Synergy", href: "/about" },
];

export default function NotFound() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-navy-pattern text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
            <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-[#c9a84c] text-[#0a2540] flex items-center justify-center">
              <Compass className="h-7 w-7" />
            </div>

            <p className="mt-6 text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
              Error 404
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-tight">
              This page took an{" "}
              <span className="text-gold-gradient">unscheduled visa run</span>.
            </h1>
            <p className="mt-5 text-white/75 leading-relaxed max-w-xl mx-auto">
              We couldn&apos;t find the page you were looking for. Let&apos;s
              get you back on track — pick a destination below or talk to a
              consultant.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                render={<Link href="/" />}
                size="lg"
                className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold h-12 px-7"
              >
                Back to home
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                render={<Link href="/contact" />}
                size="lg"
                variant="outline"
                className="h-12 px-7 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                Talk to a consultant
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-2xl mx-auto">
              {QUICK_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 hover:border-[#c9a84c]/40 hover:bg-white/10 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
