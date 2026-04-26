/**
 * Blog seed data. Shape mirrors a future Sanity `post` document so that
 * `lib/integrations/sanity.ts` can later return `BlogPost[]` with no caller
 * changes. Until Sanity is wired, posts are authored in this file.
 */

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; title: string; body: string };

export type BlogCategory =
  | "Setup"
  | "Free Zones"
  | "Visas"
  | "Compliance"
  | "Banking";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  publishedAt: string; // ISO date
  readingMinutes: number;
  author: {
    name: string;
    role: string;
  };
  body: BlogBlock[];
  tags: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mainland-vs-free-zone-uae",
    title: "Mainland vs Free Zone: how to pick the right UAE setup in 2026",
    excerpt:
      "The choice between a mainland and a free zone licence shapes your costs, market access and visa quota for years. Here's the practical decision framework Synergy uses with every founder.",
    category: "Setup",
    publishedAt: "2026-03-12",
    readingMinutes: 7,
    author: {
      name: "Layla Al Mansouri",
      role: "Senior Setup Consultant, Synergy Business",
    },
    tags: ["mainland", "free zone", "company formation", "UAE"],
    body: [
      {
        type: "p",
        text: "Choosing between a mainland licence and a free zone licence is the single biggest structural decision you'll make when launching in the UAE. The wrong call can cost six figures in re-licensing, lost contracts and visa delays. The good news is the decision is usually simpler than agents make it sound.",
      },
      {
        type: "h2",
        text: "The 60-second test",
      },
      {
        type: "p",
        text: "If your customers are UAE consumers or UAE-based businesses, you almost always want mainland. If your customers are international (or other UAE-licensed businesses you can supply via a distributor), free zones are usually cheaper and faster.",
      },
      {
        type: "h2",
        text: "When mainland is the right answer",
      },
      {
        type: "ul",
        items: [
          "You sell B2C in the UAE — retail, food & beverage, clinics, salons, education.",
          "You bid on UAE government or semi-government tenders.",
          "You need an unlimited visa quota tied to your office Ejari.",
          "You want a single licence to cover all 7 emirates with no distributor friction.",
        ],
      },
      {
        type: "h2",
        text: "When a free zone wins",
      },
      {
        type: "ul",
        items: [
          "Your clients are international (consulting, agencies, software, exports).",
          "You want lower entry cost — flexi-desk packages from AED 5,750.",
          "You need 100% foreign ownership in an activity where mainland still has restrictions.",
          "You operate in a regulated industry where a specialised free zone (ADGM for fintech, KIZAD for industrial) carries credibility.",
        ],
      },
      {
        type: "callout",
        title: "Hybrid is real",
        body: "More UAE founders run a free zone OpCo plus a mainland branch (or vice versa) than most agents admit. We design these dual structures for clients who need free-zone tax efficiency and mainland market access in the same year.",
      },
      {
        type: "h2",
        text: "Five mistakes we see weekly",
      },
      {
        type: "h3",
        text: "1. Picking the cheapest free zone first",
      },
      {
        type: "p",
        text: "Some ultra-low-cost zones face heavy scrutiny from UAE banks. You save AED 4,000 on the licence, then spend three months fighting for an account. We always factor banking acceptance into the zone choice.",
      },
      {
        type: "h3",
        text: "2. Underestimating visa quota",
      },
      {
        type: "p",
        text: "Visa quota in mainland and most free zones scales with office size. A flexi-desk supports 1–6 visas; an Ejari office supports unlimited. If you're hiring 15 people in year one, plan the office accordingly.",
      },
      {
        type: "h3",
        text: "3. Choosing activity codes too narrowly",
      },
      {
        type: "p",
        text: "DED activity codes are specific. Picking the closest-sounding code rather than the right one means you can technically operate but can't issue invoices for half your real-world services. Always do a thorough activity match in week one.",
      },
      {
        type: "h3",
        text: "4. Ignoring corporate tax",
      },
      {
        type: "p",
        text: "From mid-2023, mainland and free-zone companies are subject to 9% corporate tax above AED 375,000. Free-zone companies can qualify for 0% on 'qualifying income' but the rules are nuanced — book a tax sit-down before assuming you're exempt.",
      },
      {
        type: "h3",
        text: "5. Forgetting about substance",
      },
      {
        type: "p",
        text: "ESR (Economic Substance Regulations) require companies in certain activities to demonstrate adequate UAE substance — staff, premises, decision-making. A virtual presence won't cut it for IP, finance leasing, holding or distribution activities.",
      },
      {
        type: "h2",
        text: "How Synergy decides",
      },
      {
        type: "p",
        text: "Our decision tree is simple. We map your activity, customer base, hiring plan and ownership structure to an emirate, a licence type and a specific zone — then we cost-compare the top two options side-by-side. The recommendation is based on fit, not on which agent commission is higher.",
      },
      {
        type: "p",
        text: "If you're stuck on this decision right now, book a 30-minute call with us. The recommendation is free; you decide whether to engage.",
      },
    ],
  },
  {
    slug: "uae-golden-visa-2026",
    title: "Everything you need to know about the UAE Golden Visa in 2026",
    excerpt:
      "The UAE Golden Visa programme has expanded across seven tracks — investor, entrepreneur, specialised talent, student, scientist, frontline worker and humanitarian. Here's how to find the strongest one for you.",
    category: "Visas",
    publishedAt: "2026-02-04",
    readingMinutes: 9,
    author: {
      name: "Mariam Khoury",
      role: "Golden Visa Specialist, Synergy Business",
    },
    tags: ["Golden Visa", "residency", "UAE", "investor visa"],
    body: [
      {
        type: "p",
        text: "The UAE Golden Visa is the world's most generous long-term residency programme — 10 years, no employer sponsor, family included, and it survives extended absences from the UAE. In 2026 the programme spans seven eligibility tracks. The trick is matching your profile to the strongest one.",
      },
      {
        type: "h2",
        text: "The 7 tracks at a glance",
      },
      {
        type: "h3",
        text: "1. Investor (real estate)",
      },
      {
        type: "p",
        text: "Hold UAE property worth AED 2 million or more. The property can be off-plan (with a developer NOC), residential or commercial. Mortgages are allowed if the down payment is at least AED 2 million.",
      },
      {
        type: "h3",
        text: "2. Investor (business / fund)",
      },
      {
        type: "p",
        text: "Own a UAE-licensed business with paid-up capital of AED 2 million, or invest AED 2 million in a UAE-licensed investment fund. We see family offices and professional investors use this track frequently.",
      },
      {
        type: "h3",
        text: "3. Entrepreneur",
      },
      {
        type: "p",
        text: "Found an approved or acquired startup with a project value of at least AED 500,000, or be endorsed by an accredited UAE accelerator. The entrepreneur track is the fastest-growing in our practice — Synergy nominated 60+ entrepreneurs in 2025.",
      },
      {
        type: "h3",
        text: "4. Specialised talent",
      },
      {
        type: "p",
        text: "Doctors, scientists, engineers, IT specialists, athletes, artists, executive directors and PhD holders qualify under this track. Each profession has its own eligibility criteria — typically a salary threshold (AED 30,000+/month is a common floor) plus proof of accomplishments.",
      },
      {
        type: "h3",
        text: "5. Outstanding students",
      },
      {
        type: "p",
        text: "Top-ranked UAE high-school graduates and university students with GPAs in the top tier of their cohort can qualify directly — and in some cases, their parents and siblings can be sponsored on the same file.",
      },
      {
        type: "h3",
        text: "6. Frontline / humanitarian",
      },
      {
        type: "p",
        text: "Healthcare professionals who served during national emergencies, and individuals recognised for humanitarian contributions, can be nominated under dedicated tracks. These are typically by referral.",
      },
      {
        type: "h3",
        text: "7. Scientists",
      },
      {
        type: "p",
        text: "Holders of the Mohammed bin Rashid Medal for Scientific Excellence or PhD-level researchers from accredited institutions are eligible. The Council of Scientists handles nominations.",
      },
      {
        type: "callout",
        title: "Family is included",
        body: "Spouse, sons under 25, unmarried daughters of any age, and parents (subject to a separate file) can all be sponsored on a Golden Visa. This is one of the strongest features of the programme.",
      },
      {
        type: "h2",
        text: "Documents you'll need",
      },
      {
        type: "ul",
        items: [
          "Passport copy (validity > 6 months)",
          "Recent passport-size photo, white background",
          "MOFA-attested educational certificates (for talent and student tracks)",
          "Proof of investment / business / property (for investor tracks)",
          "Salary certificate or bank statements (for talent track)",
          "Marriage and birth certificates for family inclusion (MOFA-attested)",
        ],
      },
      {
        type: "h2",
        text: "Timeline",
      },
      {
        type: "p",
        text: "End-to-end, most Golden Visa applications take 30–60 days. The bottlenecks are document attestation (especially for foreign certificates) and medical scheduling. Pre-approval typically lands in 14–30 days; the rest is biometrics, medical and stamping.",
      },
      {
        type: "h2",
        text: "What it costs",
      },
      {
        type: "p",
        text: "Government fees alone vary from AED 2,800 (10-year residence stamping) to AED 6,000+ depending on track and emirate. Synergy's end-to-end service fee starts at AED 18,500 — covering eligibility assessment, document drafting, attestation co-ordination, nomination filing, medical and stamping.",
      },
      {
        type: "h2",
        text: "Common rejection reasons",
      },
      {
        type: "ul",
        items: [
          "Mismatched documents (different name spellings on passport vs certificates)",
          "Insufficient evidence of accomplishments under the talent track",
          "Property valuation below AED 2 million after currency conversion",
          "Missing MOFA attestation for foreign documents",
          "Salary on paper but not corroborated by bank statements",
        ],
      },
      {
        type: "p",
        text: "Most rejections are recoverable on appeal within 30 days. We handle appeals at no additional fee for Synergy clients.",
      },
      {
        type: "h2",
        text: "Should you apply now?",
      },
      {
        type: "p",
        text: "If you're already in the UAE, a Golden Visa eliminates employer dependency and gives you 10 years of stability. If you're considering relocating, the Golden Visa unlocks UAE banking, property purchase and family residency in one application — which is hard to beat anywhere else in the world.",
      },
      {
        type: "p",
        text: "Book a 30-minute eligibility check with us — it's free, and you'll leave with a clear answer on which track is strongest for you.",
      },
    ],
  },
  {
    slug: "common-uae-business-setup-mistakes",
    title: "The 7 most common UAE business setup mistakes (and how to avoid them)",
    excerpt:
      "Eleven years of consulting taught us the patterns. Most setup mistakes are predictable, expensive, and avoidable in a 30-minute conversation before you commit.",
    category: "Setup",
    publishedAt: "2026-01-15",
    readingMinutes: 6,
    author: {
      name: "Ravi Sundaram",
      role: "Managing Director, Synergy Business",
    },
    tags: ["mistakes", "setup", "due diligence", "UAE"],
    body: [
      {
        type: "p",
        text: "Synergy has helped over 1,800 founders incorporate in the UAE since 2014. The mistakes we see are remarkably consistent — and the ones below cost our clients five and six figures before they came to us. Read this before you commit to a structure.",
      },
      {
        type: "h2",
        text: "1. Picking the licence before defining the activity",
      },
      {
        type: "p",
        text: "Most founders ask 'mainland or free zone?' before they've articulated exactly what they're selling, to whom, and where. The structure follows the business — never the other way round. Spend an afternoon writing a one-page business model first.",
      },
      {
        type: "h2",
        text: "2. Trusting the cheapest agent",
      },
      {
        type: "p",
        text: "The UAE setup market is saturated with low-margin agents who push the same package to every client. Their incentive is volume. If your activity needs a non-standard NOC or a free-zone-with-banking-acceptance, you'll discover it the hard way — usually three weeks in, after the deposit is paid.",
      },
      {
        type: "h2",
        text: "3. Skipping the bank conversation",
      },
      {
        type: "p",
        text: "UAE banks are stricter than they were five years ago. They scrutinise activity, ownership chain, free zone choice, and source of funds. Some free zones face automatic AML scrutiny that adds 6–8 weeks to onboarding. Always pick the bank before — or alongside — the licence.",
      },
      {
        type: "h2",
        text: "4. Underestimating ongoing costs",
      },
      {
        type: "p",
        text: "Year-one cost is the headline. Year-two onwards is what you actually live with — licence renewal, immigration card renewal, Ejari, employee visas, audit, corporate tax filing. Build a 36-month cost model before you sign anything.",
      },
      {
        type: "callout",
        title: "Rule of thumb",
        body: "Year-2 ongoing cost is typically 50–70% of year-1 setup cost for a free-zone company; 60–80% for mainland. If your agent can't give you the year-2 number on request, it's a red flag.",
      },
      {
        type: "h2",
        text: "5. Forgetting about UBO and ESR filings",
      },
      {
        type: "p",
        text: "Ultimate Beneficial Ownership disclosure is mandatory for every UAE-licensed company. Economic Substance Regulations apply to certain activities (holding, distribution, IP, finance leasing, headquartering). Missed filings carry fines of AED 50,000+ per breach. We see new clients arriving with two years of unfiled UBO records.",
      },
      {
        type: "h2",
        text: "6. Using a personal email for the licence application",
      },
      {
        type: "p",
        text: "Many free zones treat the application email as the official communication channel for renewals, audits and compliance notices. Use a dedicated domain email — not your personal Gmail — from day one. We've seen renewals lapse because notification emails went to a junior employee's spam folder.",
      },
      {
        type: "h2",
        text: "7. Hiring before the visa quota is in place",
      },
      {
        type: "p",
        text: "The UAE has a clear sequence: licence → immigration card → establishment card → visa quota approval → individual visas. Promising a candidate a start date before this sequence completes burns trust and creates legal exposure. Map the timeline backwards from the visa stamp date.",
      },
      {
        type: "h2",
        text: "The fix is the same in every case",
      },
      {
        type: "p",
        text: "A 30-minute structured conversation with someone who has done this 100+ times. We do that for free — and we say no to clients whose structure we can't honestly improve. If you want a sanity check before you commit, book a slot.",
      },
    ],
  },
];

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Setup",
  "Free Zones",
  "Visas",
  "Compliance",
  "Banking",
];

export function getPost(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const current = getPost(slug);
  if (!current) return [];
  const sameCategory = BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === current.category,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
