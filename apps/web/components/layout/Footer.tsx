import Link from "next/link";
import { MapPin } from "lucide-react";

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.99 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.22 0z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Mainland Setup", href: "/services/mainland" },
      { label: "Free Zone Setup", href: "/services/free-zone" },
      { label: "Offshore Companies", href: "/services/offshore" },
      { label: "PRO Services", href: "/services/pro-services" },
      { label: "Visa Services", href: "/services/visa" },
      { label: "Golden Visa", href: "/services/golden-visa" },
    ],
  },
  {
    title: "Free Zones",
    links: [
      { label: "ADGM", href: "/free-zones#adgm" },
      { label: "KIZAD", href: "/free-zones#kizad" },
      { label: "twofour54", href: "/free-zones#twofour54" },
      { label: "Masdar City", href: "/free-zones#masdar" },
      { label: "ADAFZ", href: "/free-zones#adafz" },
      { label: "RAKEZ", href: "/free-zones#rakez" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Cost Calculator", href: "/cost-calculator" },
      { label: "Blog & Guides", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Client Portal", href: "/portal/dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Cookie Policy", href: "/legal/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#071a2e] text-white overflow-hidden">
      {/* gold-tinted ambient bloom for depth */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-[#c9a84c]/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* gold rule above the brand block */}
        <span
          aria-hidden
          className="block h-px w-16 bg-gradient-to-r from-[#c9a84c] to-transparent mb-12"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="col-span-2 max-w-md">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-2xl text-white">Synergy</span>
              <span className="font-display text-2xl text-gold-gradient">
                Business
              </span>
            </Link>
            <p className="mt-5 text-sm text-white/65 leading-[1.7]">
              Abu Dhabi&apos;s trusted business setup consultancy. Trade
              licences, free-zone formation, visa services and PRO support
              across the UAE — under one roof since 2014.
            </p>
            <div className="mt-6 flex items-start gap-2 text-sm text-white/65">
              <MapPin className="h-4 w-4 mt-0.5 text-[#c9a84c] flex-shrink-0" />
              <span>
                Office 24, Al Maryah Tower, Al Maryah Island
                <br />
                Abu Dhabi, United Arab Emirates
              </span>
            </div>
            <div className="mt-7 flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#c9a84c] hover:text-[#0a2540] flex items-center justify-center transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#c9a84c] hover:text-[#0a2540] flex items-center justify-center transition-colors"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#c9a84c] hover:text-[#0a2540] flex items-center justify-center transition-colors"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#c9a84c]">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-7 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs text-white/55">
          <p>
            &copy; {new Date().getFullYear()} Synergy Business Consultancy LLC.
            All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#c9a84c]" />
            Licensed by the Abu Dhabi Department of Economic Development
          </p>
        </div>
      </div>
    </footer>
  );
}
