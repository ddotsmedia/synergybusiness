/**
 * Declarative definition of every editable page in the admin panel.
 *
 * Each page has sections; each section has fields. The admin form is
 * generated from this schema, so adding a new editable string is just:
 *   1. Add a field here.
 *   2. Read it via `getString(content, "your.key", "your default")` in the
 *      component that renders it.
 */

export type FieldDef =
  | {
      key: string;
      type: "text";
      label: string;
      defaultValue: string;
      help?: string;
    }
  | {
      key: string;
      type: "textarea";
      label: string;
      defaultValue: string;
      rows?: number;
      help?: string;
    }
  | {
      key: string;
      type: "list";
      label: string;
      defaultValue: string[];
      itemLabel?: string;
      help?: string;
    }
  | {
      key: string;
      type: "url";
      label: string;
      defaultValue: string;
      help?: string;
    };

export type SectionDef = {
  title: string;
  description?: string;
  fields: FieldDef[];
};

export type PageSchema = {
  slug: string;
  title: string;
  description: string;
  publicUrl: string;
  sections: SectionDef[];
};

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    slug: "home",
    title: "Home page",
    description:
      "The marketing landing page at synergybusiness.ae — hero, services intro, CTAs, FAQ intro.",
    publicUrl: "/",
    sections: [
      {
        title: "Hero",
        description: "First thing visitors see. Keep punchy.",
        fields: [
          {
            key: "hero.eyebrow",
            type: "text",
            label: "Eyebrow chip",
            defaultValue: "Abu Dhabi · Dubai · Sharjah · Ajman · UAQ · RAK · Fujairah",
          },
          {
            key: "hero.titleMain",
            type: "text",
            label: "Title — main line",
            defaultValue: "Set up your UAE business with",
          },
          {
            key: "hero.titleHighlight",
            type: "text",
            label: "Title — gold-highlighted word",
            defaultValue: "Synergy",
            help: "Renders with the gold gradient. One short word works best.",
          },
          {
            key: "hero.titleSubtitle",
            type: "text",
            label: "Title — second line",
            defaultValue: "Fast, simple, and trusted.",
          },
          {
            key: "hero.description",
            type: "textarea",
            label: "Description paragraph",
            defaultValue:
              "From mainland trade licenses and free-zone formation to PRO services, employment visas, and the UAE Golden Visa — Synergy Business handles every step from Abu Dhabi.",
            rows: 3,
          },
          {
            key: "hero.cta1Label",
            type: "text",
            label: "Primary CTA label",
            defaultValue: "Start your setup",
          },
          {
            key: "hero.cta1Href",
            type: "url",
            label: "Primary CTA href",
            defaultValue: "#contact",
          },
          {
            key: "hero.cta2Label",
            type: "text",
            label: "Secondary CTA label",
            defaultValue: "Estimate my cost",
          },
          {
            key: "hero.cta2Href",
            type: "url",
            label: "Secondary CTA href",
            defaultValue: "#calculator",
          },
        ],
      },
      {
        title: "Services intro",
        fields: [
          {
            key: "services.eyebrow",
            type: "text",
            label: "Eyebrow",
            defaultValue: "What we do",
          },
          {
            key: "services.title",
            type: "text",
            label: "Section title",
            defaultValue:
              "Every service you need to launch and operate in the UAE",
          },
          {
            key: "services.description",
            type: "textarea",
            label: "Description",
            defaultValue:
              "From your first trade licence to your Golden Visa — Synergy Business is your single point of contact across the Emirates.",
            rows: 2,
          },
        ],
      },
    ],
  },

  {
    slug: "about",
    title: "About page",
    description: "/about — company story, mission, values.",
    publicUrl: "/about",
    sections: [
      {
        title: "Hero",
        fields: [
          {
            key: "hero.eyebrow",
            type: "text",
            label: "Eyebrow chip",
            defaultValue: "About Synergy Business",
          },
          {
            key: "hero.titleMain",
            type: "text",
            label: "Title — main",
            defaultValue: "Abu Dhabi's",
          },
          {
            key: "hero.titleHighlight",
            type: "text",
            label: "Title — gold word",
            defaultValue: "trusted",
          },
          {
            key: "hero.titleAfter",
            type: "text",
            label: "Title — after the gold word",
            defaultValue: "business setup partner since 2014.",
          },
          {
            key: "hero.description",
            type: "textarea",
            label: "Description",
            defaultValue:
              "We're a licensed Abu Dhabi consultancy that has helped over 1,800 founders incorporate, hire, bank and obtain residence in the UAE. Our north star is simple: protect your time and your capital — and tell you the truth, even when it's inconvenient.",
            rows: 4,
          },
        ],
      },
      {
        title: "Mission section",
        fields: [
          {
            key: "mission.eyebrow",
            type: "text",
            label: "Eyebrow",
            defaultValue: "Our mission",
          },
          {
            key: "mission.headline",
            type: "textarea",
            label: "Headline",
            defaultValue:
              "Make UAE business setup feel obvious — not overwhelming.",
            rows: 2,
            help: "The word in italics-gold is rendered automatically.",
          },
          {
            key: "mission.paragraph1",
            type: "textarea",
            label: "Paragraph 1",
            defaultValue:
              "The UAE rewards founders who move fast — but the regulatory landscape rewards patience and precision. Our job is to take the second part off your plate so you can focus on the first.",
            rows: 4,
          },
          {
            key: "mission.paragraph2",
            type: "textarea",
            label: "Paragraph 2",
            defaultValue:
              "Synergy was founded in 2014 by a team of UAE-licensed PROs and ex-Big-4 consultants who were tired of seeing first-time founders steered into the wrong free zone, the wrong visa class, or the wrong bank — usually because their advisor optimised for commission rather than fit.",
            rows: 4,
          },
          {
            key: "mission.paragraph3",
            type: "textarea",
            label: "Paragraph 3",
            defaultValue:
              "A decade later, we're still founder-led, still Abu-Dhabi-based, and still measured by one metric: would our clients refer us? About 80% of our revenue comes from existing clients and their referrals — that's the answer we trust most.",
            rows: 4,
          },
        ],
      },
    ],
  },

  {
    slug: "legal-privacy",
    title: "Legal — Privacy Policy",
    description:
      "/legal/privacy — title, last-updated label, optional lead paragraph. The clauses stay in code (lawyer-reviewed).",
    publicUrl: "/legal/privacy",
    sections: [
      {
        title: "Header",
        fields: [
          {
            key: "header.title",
            type: "text",
            label: "Page title",
            defaultValue: "Privacy Policy",
          },
          {
            key: "header.updated",
            type: "text",
            label: "Last updated label",
            defaultValue: "January 2026",
          },
          {
            key: "header.lead",
            type: "textarea",
            label: "Optional lead paragraph (shown above the body)",
            defaultValue: "",
            rows: 3,
            help: "Leave blank to skip.",
          },
        ],
      },
    ],
  },
  {
    slug: "legal-terms",
    title: "Legal — Terms of Service",
    description:
      "/legal/terms — title and lead paragraph editable.",
    publicUrl: "/legal/terms",
    sections: [
      {
        title: "Header",
        fields: [
          {
            key: "header.title",
            type: "text",
            label: "Page title",
            defaultValue: "Terms of Service",
          },
          {
            key: "header.updated",
            type: "text",
            label: "Last updated label",
            defaultValue: "January 2026",
          },
          {
            key: "header.lead",
            type: "textarea",
            label: "Optional lead paragraph",
            defaultValue: "",
            rows: 3,
          },
        ],
      },
    ],
  },
  {
    slug: "legal-cookies",
    title: "Legal — Cookie Policy",
    description: "/legal/cookies — title and lead paragraph editable.",
    publicUrl: "/legal/cookies",
    sections: [
      {
        title: "Header",
        fields: [
          {
            key: "header.title",
            type: "text",
            label: "Page title",
            defaultValue: "Cookie Policy",
          },
          {
            key: "header.updated",
            type: "text",
            label: "Last updated label",
            defaultValue: "January 2026",
          },
          {
            key: "header.lead",
            type: "textarea",
            label: "Optional lead paragraph",
            defaultValue: "",
            rows: 3,
          },
        ],
      },
    ],
  },

  {
    slug: "contact",
    title: "Contact page",
    description: "/contact — channels and office details.",
    publicUrl: "/contact",
    sections: [
      {
        title: "Hero",
        fields: [
          {
            key: "hero.eyebrow",
            type: "text",
            label: "Eyebrow",
            defaultValue: "We reply in under 1 hour, every business day",
          },
          {
            key: "hero.titleMain",
            type: "text",
            label: "Title — main",
            defaultValue: "Talk to a",
          },
          {
            key: "hero.titleHighlight",
            type: "text",
            label: "Title — gold word",
            defaultValue: "Synergy",
          },
          {
            key: "hero.titleAfter",
            type: "text",
            label: "Title — after the gold word",
            defaultValue: "consultant.",
          },
          {
            key: "hero.description",
            type: "textarea",
            label: "Description",
            defaultValue:
              "Fastest response is on WhatsApp. Prefer email or a scheduled call? We'll work with whatever fits your style.",
            rows: 3,
          },
        ],
      },
      {
        title: "Channels",
        description: "Phone numbers, email, WhatsApp link.",
        fields: [
          {
            key: "channels.whatsappNumber",
            type: "text",
            label: "WhatsApp display number",
            defaultValue: "+971 50 000 0000",
          },
          {
            key: "channels.whatsappLink",
            type: "url",
            label: "WhatsApp link (wa.me/...)",
            defaultValue: "https://wa.me/971500000000",
          },
          {
            key: "channels.phone",
            type: "text",
            label: "Phone number",
            defaultValue: "+971 2 000 0000",
          },
          {
            key: "channels.email",
            type: "text",
            label: "Public email address",
            defaultValue: "hello@synergybusiness.ae",
          },
          {
            key: "channels.hours",
            type: "text",
            label: "Office hours",
            defaultValue: "Sun–Thu · 9:00 – 18:00 GST",
          },
        ],
      },
      {
        title: "Headquarters card",
        fields: [
          {
            key: "hq.title",
            type: "text",
            label: "Title",
            defaultValue: "Office 24, Al Maryah Tower",
          },
          {
            key: "hq.subtitle",
            type: "text",
            label: "Address line",
            defaultValue: "Al Maryah Island, Abu Dhabi, UAE",
          },
        ],
      },
    ],
  },
];

PAGE_SCHEMAS.push(
  {
    slug: "book",
    title: "Book an Appointment",
    description:
      "/book — hero, perks, 'what to expect', office hours. Form labels stay in code.",
    publicUrl: "/book",
    sections: [
      {
        title: "Hero",
        fields: [
          {
            key: "hero.eyebrow",
            type: "text",
            label: "Eyebrow chip",
            defaultValue: "Free 30-minute consultation · No obligation",
          },
          {
            key: "hero.titleMain",
            type: "text",
            label: "Title — main",
            defaultValue: "Book an",
          },
          {
            key: "hero.titleHighlight",
            type: "text",
            label: "Title — gold word",
            defaultValue: "Appointment",
          },
          {
            key: "hero.description",
            type: "textarea",
            label: "Description",
            defaultValue:
              "Sit down with a Synergy Business setup specialist. We'll map out the right licence, free zone, visa quota, and approximate cost for your business — and answer every question you bring.",
            rows: 4,
          },
          {
            key: "hero.perks",
            type: "list",
            label: "Hero perk badges",
            defaultValue: [
              "Confirmation within 1 business hour",
              "In-person, phone, or video",
              "English & Arabic specialists",
            ],
            itemLabel: "Perk",
          },
        ],
      },
      {
        title: "Form intro",
        fields: [
          {
            key: "form.title",
            type: "text",
            label: "Form heading",
            defaultValue: "Choose a date & time",
          },
          {
            key: "form.subtitle",
            type: "text",
            label: "Form subtitle",
            defaultValue:
              "We'll confirm the exact slot by WhatsApp or email within one business hour.",
          },
        ],
      },
      {
        title: "Sidebar — talk now",
        fields: [
          {
            key: "sidebar.talkNowTitle",
            type: "text",
            label: "Title",
            defaultValue: "Prefer to talk now?",
          },
          {
            key: "sidebar.talkNowDescription",
            type: "textarea",
            label: "Description",
            defaultValue:
              "Skip the form — message us on WhatsApp for an instant reply.",
            rows: 2,
          },
        ],
      },
      {
        title: "Sidebar — what to expect",
        fields: [
          {
            key: "expect.title",
            type: "text",
            label: "Section title",
            defaultValue: "What to expect",
          },
          {
            key: "expect.steps",
            type: "list",
            label: "Steps (numbered automatically)",
            defaultValue: [
              "A 30-minute call to understand your business activity, nationality, and goals.",
              "A short-list of the right licence, free zone, and visa structure for you.",
              "A written cost estimate and a step-by-step plan — emailed the same day.",
            ],
            itemLabel: "Step",
          },
        ],
      },
      {
        title: "Sidebar — office hours",
        fields: [
          {
            key: "hours.title",
            type: "text",
            label: "Title",
            defaultValue: "Office hours",
          },
          {
            key: "hours.body",
            type: "textarea",
            label: "Body (use a blank line between days and time)",
            defaultValue: "Sunday – Thursday\n09:00 – 18:00 GST",
            rows: 3,
          },
          {
            key: "hours.weekendNote",
            type: "text",
            label: "Weekend note",
            defaultValue: "Friday & Saturday: WhatsApp only.",
          },
        ],
      },
    ],
  },

  {
    slug: "cost-calculator",
    title: "Cost Calculator",
    description:
      "/cost-calculator — hero text only. The estimator engine and outputs are computed from data, not editable here.",
    publicUrl: "/cost-calculator",
    sections: [
      {
        title: "Hero",
        fields: [
          {
            key: "hero.eyebrow",
            type: "text",
            label: "Eyebrow chip",
            defaultValue: "5-step estimator · ~60 seconds",
          },
          {
            key: "hero.titleMain",
            type: "text",
            label: "Title — main",
            defaultValue: "Itemised",
          },
          {
            key: "hero.titleHighlight",
            type: "text",
            label: "Title — gold phrase",
            defaultValue: "UAE setup cost",
          },
          {
            key: "hero.titleAfter",
            type: "text",
            label: "Title — after the gold phrase",
            defaultValue: "in 60 seconds.",
          },
          {
            key: "hero.description",
            type: "textarea",
            label: "Description",
            defaultValue:
              "Answer five quick questions. We'll match you to the top three free zones and break down government fees, Synergy service fees and yearly renewals — no email required for the result.",
            rows: 4,
          },
          {
            key: "hero.badges",
            type: "list",
            label: "Trust badges (3 items recommended)",
            defaultValue: [
              "13 free zones compared",
              "AED itemised",
              "No registration needed",
            ],
            itemLabel: "Badge",
          },
        ],
      },
    ],
  },

  {
    slug: "free-zones",
    title: "Free Zones",
    description:
      "/free-zones — hero text only. The zone cards and details are managed under Free zones.",
    publicUrl: "/free-zones",
    sections: [
      {
        title: "Hero",
        fields: [
          {
            key: "hero.eyebrowSuffix",
            type: "text",
            label: "Eyebrow suffix (after 'UAE Free Zones · N options compared')",
            defaultValue: "options compared",
            help: "The full chip reads 'UAE Free Zones · {count} {suffix}'. Edit only the suffix.",
          },
          {
            key: "hero.titleMain",
            type: "text",
            label: "Title — main",
            defaultValue: "Pick the right",
          },
          {
            key: "hero.titleHighlight",
            type: "text",
            label: "Title — gold phrase",
            defaultValue: "UAE free zone",
          },
          {
            key: "hero.titleAfter",
            type: "text",
            label: "Title — after the gold phrase",
            defaultValue: "for your business.",
          },
          {
            key: "hero.description",
            type: "textarea",
            label: "Description",
            defaultValue:
              "Each zone is tuned to a specific industry, cost profile and visa quota. Search by name, filter by emirate, or browse by category — then book a free 30-minute matching call with Synergy.",
            rows: 4,
          },
        ],
      },
    ],
  },

  {
    slug: "blog",
    title: "Blog index",
    description:
      "/blog — hero text only. Posts themselves are managed under Blog.",
    publicUrl: "/blog",
    sections: [
      {
        title: "Hero",
        fields: [
          {
            key: "hero.eyebrow",
            type: "text",
            label: "Eyebrow chip",
            defaultValue: "Synergy Insights",
          },
          {
            key: "hero.titleMain",
            type: "text",
            label: "Title — main",
            defaultValue: "Practical guides for",
          },
          {
            key: "hero.titleHighlight",
            type: "text",
            label: "Title — gold phrase",
            defaultValue: "UAE founders",
          },
          {
            key: "hero.titleAfter",
            type: "text",
            label: "Title — after the gold phrase",
            defaultValue: ".",
            help: "Use a single character like '.' or '!' if you don't want trailing words.",
          },
          {
            key: "hero.description",
            type: "textarea",
            label: "Description",
            defaultValue:
              "Setup decisions, free-zone comparisons, visa eligibility, banking and compliance — written by the consultants doing the work.",
            rows: 3,
          },
        ],
      },
    ],
  },
);

export function getPageSchema(slug: string): PageSchema | null {
  return PAGE_SCHEMAS.find((p) => p.slug === slug) ?? null;
}
