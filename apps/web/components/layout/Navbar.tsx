"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services", dropdown: "services" as const },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

const SERVICE_LINKS = [
  { href: "/services/mainland", label: "Mainland Setup" },
  { href: "/services/free-zone", label: "Free Zone Formation" },
  { href: "/services/offshore", label: "Offshore Companies" },
  { href: "/services/pro-services", label: "PRO Services" },
  { href: "/services/visa", label: "UAE Visa Services" },
  { href: "/services/golden-visa", label: "UAE Golden Visa" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-xl sm:text-2xl text-[#0a2540]">
            Synergy
          </span>
          <span className="font-display text-xl sm:text-2xl text-gold-gradient">
            Business
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) =>
            l.dropdown === "services" ? (
              <div
                key={l.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <a
                  href={l.href}
                  className="inline-flex items-center gap-1 text-sm text-[#1a2b3c] hover:text-[#c9a84c] transition-colors"
                  aria-haspopup="true"
                  aria-expanded={servicesOpen}
                >
                  {l.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      servicesOpen && "rotate-180",
                    )}
                  />
                </a>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                    >
                      <div className="w-72 rounded-xl border border-border bg-white shadow-xl p-2">
                        {SERVICE_LINKS.map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className="block rounded-lg px-3 py-2.5 text-sm text-[#1a2b3c] hover:bg-[#f6efd8] hover:text-[#0a2540] transition-colors"
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-[#1a2b3c] hover:text-[#c9a84c] transition-colors"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            render={<a href="/#contact" />}
            variant="ghost"
            className="text-[#0a2540] hover:bg-[#eef1f6]"
          >
            Get a Quote
          </Button>
          <Button
            render={<Link href="/book" />}
            className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
          >
            Book an Appointment
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden h-10 w-10 inline-flex items-center justify-center text-[#0a2540]"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                <span className="font-display text-xl text-[#0a2540]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-10 w-10 inline-flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 px-5 py-6 flex flex-col gap-1 overflow-y-auto">
                {NAV_LINKS.map((l) =>
                  l.dropdown === "services" ? (
                    <div key={l.href} className="border-b border-border/60">
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className="w-full py-3 flex items-center justify-between text-base text-[#1a2b3c] hover:text-[#c9a84c]"
                        aria-expanded={mobileServicesOpen}
                      >
                        <span>{l.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            mobileServicesOpen && "rotate-180",
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3 pl-3 flex flex-col">
                              {SERVICE_LINKS.map((s) => (
                                <Link
                                  key={s.href}
                                  href={s.href}
                                  onClick={() => setOpen(false)}
                                  className="py-2 text-sm text-[#1a2b3c] hover:text-[#c9a84c]"
                                >
                                  {s.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="py-3 text-base text-[#1a2b3c] hover:text-[#c9a84c] border-b border-border/60"
                    >
                      {l.label}
                    </a>
                  ),
                )}
              </nav>
              <div className="p-5 flex flex-col gap-3 border-t border-border">
                <Button
                  render={
                    <Link href="/book" onClick={() => setOpen(false)} />
                  }
                  className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold w-full"
                >
                  Book an Appointment
                </Button>
                <Button
                  render={
                    <a
                      href="tel:+97120000000"
                      onClick={() => setOpen(false)}
                    />
                  }
                  variant="outline"
                  className="w-full border-[#0a2540] text-[#0a2540]"
                >
                  Call +971 2 000 0000
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
