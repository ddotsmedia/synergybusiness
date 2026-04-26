"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#free-zones", label: "Free Zones" },
  { href: "/#process", label: "How It Works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#1a2b3c] hover:text-[#c9a84c] transition-colors"
            >
              {l.label}
            </a>
          ))}
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
            render={<a href="/#contact" />}
            className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
          >
            Start Setup
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
              <nav className="flex-1 px-5 py-6 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-3 text-base text-[#1a2b3c] hover:text-[#c9a84c] border-b border-border/60"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <div className="p-5 flex flex-col gap-3 border-t border-border">
                <Button
                  render={
                    <a href="/#contact" onClick={() => setOpen(false)} />
                  }
                  className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold w-full"
                >
                  Start Setup
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
