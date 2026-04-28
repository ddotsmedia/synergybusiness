import {
  Award,
  BadgeCheck,
  Building2,
  Clock,
  type LucideIcon,
} from "lucide-react";

const ITEMS: { icon: LucideIcon; label: string; sub: string }[] = [
  {
    icon: BadgeCheck,
    label: "ADDED Licensed",
    sub: "Abu Dhabi Dept. of Economic Development",
  },
  {
    icon: Award,
    label: "ADGM Authorised",
    sub: "Registered ADGM agents",
  },
  {
    icon: Clock,
    label: "Established 2014",
    sub: "11 years of UAE setup",
  },
  {
    icon: Building2,
    label: "1,800+ companies",
    sub: "Mainland · free zone · offshore",
  },
];

export function AuthorityStrip() {
  return (
    <section
      aria-label="Credentials"
      className="relative bg-white border-y border-[#0a2540]/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#0a2540]/10">
          {ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-start gap-3 py-5 lg:py-6 px-1 lg:px-6 first:lg:pl-0 last:lg:pr-0"
            >
              <span
                className="flex-shrink-0 h-9 w-9 rounded-md bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center"
                aria-hidden
              >
                <item.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm sm:text-base text-[#0a2540] leading-tight">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-[#6b7e96] leading-snug">
                  {item.sub}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
