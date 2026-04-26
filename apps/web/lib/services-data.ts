export type ServiceSlug =
  | "mainland"
  | "free-zone"
  | "offshore"
  | "pro-services"
  | "visa"
  | "golden-visa";

export type ServiceFeature = {
  title: string;
  body: string;
  icon:
    | "shield"
    | "globe"
    | "target"
    | "stamp"
    | "key"
    | "rocket"
    | "users"
    | "clock"
    | "wallet"
    | "sparkles";
};

export type ServicePackage = {
  name: string;
  tagline: string;
  priceFromAed: number | null;
  priceNote?: string;
  features: string[];
  highlight?: boolean;
  cta?: string;
};

export type ServiceProcessStep = {
  title: string;
  body: string;
  durationDays?: string;
};

export type ServiceFAQ = {
  q: string;
  a: string;
};

export type ServiceDetail = {
  slug: ServiceSlug;
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    description: string;
    bullets: string[];
    startingPrice?: number;
    timelineDays: string;
  };
  metricStrip: {
    label: string;
    value: string;
  }[];
  features: ServiceFeature[];
  packages?: ServicePackage[];
  process: ServiceProcessStep[];
  faqs: ServiceFAQ[];
  related: ServiceSlug[];
  seo: {
    title: string;
    description: string;
  };
};

export const SERVICES: Record<ServiceSlug, ServiceDetail> = {
  mainland: {
    slug: "mainland",
    hero: {
      eyebrow: "Mainland Setup",
      title: "Open the entire UAE market with a",
      titleHighlight: "Mainland trade licence",
      description:
        "A DED or ADDED-issued trade licence lets you trade anywhere in the UAE, bid on government contracts, lease offices in any emirate and sponsor unlimited employees. Synergy handles activity selection, name reservation, MOA drafting, and immigration cards end-to-end.",
      bullets: [
        "100% foreign ownership for most activities",
        "Bid on UAE government and semi-government tenders",
        "Lease an office anywhere in the UAE",
        "Unlimited visa quota subject to office size",
      ],
      startingPrice: 12500,
      timelineDays: "5–10 working days",
    },
    metricStrip: [
      { label: "Foreign ownership", value: "100%" },
      { label: "Activities available", value: "2,000+" },
      { label: "Average timeline", value: "5–10 days" },
      { label: "Corporate tax", value: "9% over AED 375K" },
    ],
    features: [
      {
        icon: "globe",
        title: "Trade across all 7 emirates",
        body: "Mainland licences let you sell directly to UAE consumers and businesses — no free-zone-to-mainland intermediary required.",
      },
      {
        icon: "users",
        title: "Unlimited visa quota",
        body: "Visa allocation scales with your office Ejari. We help right-size your space to your hiring plan.",
      },
      {
        icon: "stamp",
        title: "Activity selection done right",
        body: "We map your real-world business to the correct DED/ADDED activity codes — avoiding rework and additional licence fees.",
      },
      {
        icon: "shield",
        title: "100% foreign ownership",
        body: "Since the 2021 Commercial Companies Law amendment, most activities no longer require a UAE national sponsor.",
      },
      {
        icon: "wallet",
        title: "Bank account introductions",
        body: "Direct relationships with Emirates NBD, ADCB, FAB, Mashreq and Wio — we prepare the file and shepherd the application.",
      },
      {
        icon: "clock",
        title: "Renewals on autopilot",
        body: "Annual licence, Ejari and immigration card renewals handled by your dedicated PRO — never miss a deadline.",
      },
    ],
    packages: [
      {
        name: "Starter",
        tagline: "One activity, one shareholder, no visa",
        priceFromAed: 12500,
        priceNote: "All-in for year one",
        features: [
          "DED / ADDED trade licence",
          "Initial approval & name reservation",
          "MOA drafting & notarisation",
          "Establishment card",
          "Office address (1-year flexi-desk)",
        ],
      },
      {
        name: "Founder",
        tagline: "Most popular for first-time founders",
        priceFromAed: 19500,
        priceNote: "Includes investor visa",
        highlight: true,
        features: [
          "Everything in Starter",
          "Investor visa (2-year)",
          "Emirates ID & medical",
          "Corporate bank account introduction",
          "1-year PRO support included",
        ],
      },
      {
        name: "Growth",
        tagline: "Scaling teams with multiple visas",
        priceFromAed: 32000,
        priceNote: "+ visa-stamping per employee",
        features: [
          "Everything in Founder",
          "Up to 3 employee visas processed",
          "Dedicated office (Ejari)",
          "Corporate tax registration",
          "VAT registration if applicable",
        ],
      },
    ],
    process: [
      {
        title: "Discovery & activity selection",
        body: "We map your business model to DED/ADDED activity codes, advise on legal form (LLC, sole establishment, branch) and sketch your visa plan.",
        durationDays: "Day 1–2",
      },
      {
        title: "Name reservation & initial approval",
        body: "We secure your trade name and obtain initial approval from the Department of Economic Development.",
        durationDays: "Day 2–4",
      },
      {
        title: "MOA & external approvals",
        body: "Memorandum of Association is drafted and notarised. Activity-specific approvals (e.g. KHDA, ADAFSA, Civil Defence) are obtained where required.",
        durationDays: "Day 4–7",
      },
      {
        title: "Licence issuance & immigration card",
        body: "Your trade licence is issued. We open the immigration file and apply for your establishment card so visa processing can begin.",
        durationDays: "Day 7–10",
      },
    ],
    faqs: [
      {
        q: "Do I still need a local sponsor for a mainland LLC?",
        a: "For most commercial and professional activities — no. The 2021 Commercial Companies Law allows 100% foreign ownership. A handful of strategic activities still require a UAE national service agent or 51% Emirati shareholder; we'll flag these during discovery.",
      },
      {
        q: "Can I share an office to keep costs low?",
        a: "Yes. ADDED and DED accept flexi-desks and shared offices for the first licence year, typically supporting up to 3–6 visas. Larger teams need a private office with Ejari.",
      },
      {
        q: "What's the corporate tax position for a mainland company?",
        a: "Profits above AED 375,000 are taxed at 9%. Profits below that threshold are 0%. Mainland companies must register for corporate tax with the FTA — we handle registration.",
      },
      {
        q: "How does mainland compare to a free zone?",
        a: "Mainland gives you full UAE market access and unlimited visa quotas tied to office size; free zones often offer lower entry cost and 0% tax incentives but restrict direct trade with the UAE mainland.",
      },
    ],
    related: ["free-zone", "pro-services", "visa"],
    seo: {
      title: "Mainland Company Setup in Abu Dhabi & UAE",
      description:
        "Open a mainland LLC in Abu Dhabi or anywhere in the UAE with 100% foreign ownership. DED/ADDED licensing, MOA drafting, visas and bank accounts — handled end-to-end by Synergy Business.",
    },
  },

  "free-zone": {
    slug: "free-zone",
    hero: {
      eyebrow: "Free Zone Formation",
      title: "Pick the perfect zone for your business in",
      titleHighlight: "5 working days",
      description:
        "Synergy works with every major Abu Dhabi and UAE free zone — ADGM, KIZAD, twofour54, Masdar, ADAFZ, RAKEZ and more. We match your activity, ownership structure and visa plan to the right zone, then handle incorporation end-to-end.",
      bullets: [
        "100% foreign ownership in every free zone",
        "0% personal income tax, repatriation of capital",
        "Flexi-desks and dedicated office options",
        "Visa quotas tuned to your hiring plan",
      ],
      startingPrice: 5750,
      timelineDays: "3–7 working days",
    },
    metricStrip: [
      { label: "Free zones supported", value: "30+" },
      { label: "Avg. setup time", value: "3–7 days" },
      { label: "Foreign ownership", value: "100%" },
      { label: "Personal income tax", value: "0%" },
    ],
    features: [
      {
        icon: "target",
        title: "Right-zone matching",
        body: "We compare ADGM, KIZAD, twofour54, Masdar, ADAFZ, RAKEZ, IFZA, SHAMS and more — across cost, credibility, visa quota and banking acceptance.",
      },
      {
        icon: "wallet",
        title: "Transparent costs",
        body: "Government fees, registration, immigration card and your first visa — all itemised before you commit. No hidden renewals.",
      },
      {
        icon: "users",
        title: "Visa quota planning",
        body: "Whether you need 1 visa or 50, we shape your office package and zone choice around your 12-month hiring plan.",
      },
      {
        icon: "shield",
        title: "Bank-friendly structures",
        body: "Some zones face stricter bank scrutiny than others. We steer toward zones (ADGM, ADAFZ, KIZAD) with the smoothest UAE banking acceptance.",
      },
      {
        icon: "rocket",
        title: "Launch in days",
        body: "Most free-zone licences are issued in 3–7 working days once your KYC is complete. Some zones offer same-day digital incorporation.",
      },
      {
        icon: "clock",
        title: "Renewals & amendments",
        body: "Annual renewals, shareholder changes, activity additions and visa extensions handled by your account manager.",
      },
    ],
    packages: [
      {
        name: "Solo",
        tagline: "One shareholder, no visa",
        priceFromAed: 5750,
        priceNote: "Year-one all-in",
        features: [
          "Trade licence (1 activity)",
          "Flexi-desk address",
          "Establishment card",
          "Digital company stamp & MOA",
        ],
      },
      {
        name: "Founder",
        tagline: "1 shareholder + 1 visa",
        priceFromAed: 11900,
        priceNote: "Most popular",
        highlight: true,
        features: [
          "Everything in Solo",
          "Investor visa (2-year)",
          "Emirates ID & medical",
          "Bank account introduction",
          "1 year of PRO support",
        ],
      },
      {
        name: "Team",
        tagline: "Up to 5 visas",
        priceFromAed: 24500,
        priceNote: "+ per-visa fees",
        features: [
          "Everything in Founder",
          "Up to 5 employee visas",
          "Co-working office (12 months)",
          "Corporate tax registration",
          "Quarterly compliance review",
        ],
      },
    ],
    process: [
      {
        title: "Zone matching",
        body: "Tell us your activity, target market and visa plan. We shortlist 2–3 zones and present a side-by-side cost and benefit comparison.",
        durationDays: "Day 1",
      },
      {
        title: "Application & KYC",
        body: "We submit your application form, KYC pack (passports, proof of address, references) and reserve your company name.",
        durationDays: "Day 1–2",
      },
      {
        title: "Licence issuance",
        body: "The free-zone authority issues your trade licence, certificate of incorporation, share certificates and digital MOA.",
        durationDays: "Day 3–5",
      },
      {
        title: "Immigration & banking",
        body: "We open your immigration file, apply for your investor visa, complete medical and Emirates ID, and introduce you to your banker.",
        durationDays: "Day 5–7",
      },
    ],
    faqs: [
      {
        q: "Which free zone should I choose?",
        a: "It depends on your activity, banking needs and visa quota. ADGM is gold-standard for fintech and holding companies; KIZAD for industrial; twofour54 for media; Masdar for sustainability; RAKEZ for low-cost SMEs. We'll shortlist the right 2–3 in a free consultation.",
      },
      {
        q: "Can a free-zone company trade in the UAE mainland?",
        a: "Free-zone companies cannot directly issue invoices to UAE mainland customers without a local distributor or branch. If you sell B2C in the UAE, a mainland licence is usually a better fit. For B2B exports, fund management, or international clients, a free-zone licence is ideal.",
      },
      {
        q: "Do I need to be physically present?",
        a: "Most free zones allow remote incorporation. You'll only need to come to the UAE for visa medical, Emirates ID biometrics and bank account opening — typically 3–5 days, once.",
      },
      {
        q: "Can I open a UAE bank account with a free-zone licence?",
        a: "Yes. Some zones (ADGM, ADAFZ, KIZAD, JAFZA) carry strong bank credibility; others (very low-cost zones) face heavier scrutiny. We'll factor banking into your zone choice from the start.",
      },
    ],
    related: ["mainland", "offshore", "visa"],
    seo: {
      title: "Free Zone Company Setup in Abu Dhabi & UAE",
      description:
        "Set up in ADGM, KIZAD, twofour54, Masdar, ADAFZ, RAKEZ and 30+ UAE free zones. 100% foreign ownership, 0% personal tax, fast incorporation. Synergy handles licensing, visas and banking.",
    },
  },

  offshore: {
    slug: "offshore",
    hero: {
      eyebrow: "Offshore Companies",
      title: "International holding & asset structures via",
      titleHighlight: "RAK ICC and JAFZA Offshore",
      description:
        "Offshore companies are ideal for holding UAE real estate, owning subsidiaries, IP licensing and international trading. They incorporate in 2–4 days, require no physical office, and provide a clean structure for asset protection and estate planning.",
      bullets: [
        "Holding & asset-protection structures",
        "Hold UAE freehold real estate (JAFZA)",
        "No physical office required",
        "Privacy of beneficial ownership",
      ],
      startingPrice: 9000,
      timelineDays: "2–4 working days",
    },
    metricStrip: [
      { label: "Setup time", value: "2–4 days" },
      { label: "Office required", value: "None" },
      { label: "Foreign ownership", value: "100%" },
      { label: "Visa eligibility", value: "Not included" },
    ],
    features: [
      {
        icon: "shield",
        title: "Asset protection",
        body: "Hold your UAE and international assets through a single offshore structure — separating personal liability from business risk.",
      },
      {
        icon: "globe",
        title: "International trading",
        body: "Bill non-UAE clients and conduct global trade without the overhead of a mainland or free-zone office.",
      },
      {
        icon: "key",
        title: "JAFZA real-estate ownership",
        body: "JAFZA Offshore is the only UAE structure that can directly own freehold property in Dubai — useful for family-office structures.",
      },
      {
        icon: "stamp",
        title: "Beneficial-ownership privacy",
        body: "Shareholder details are not publicly searchable. Your structure stays confidential while remaining fully UAE-compliant.",
      },
    ],
    packages: [
      {
        name: "RAK ICC",
        tagline: "International holding & trading",
        priceFromAed: 9000,
        priceNote: "Year-one all-in",
        highlight: true,
        features: [
          "RAK ICC certificate of incorporation",
          "Registered agent & office",
          "Memorandum & Articles",
          "Share certificates",
          "Year-one renewal included",
        ],
      },
      {
        name: "JAFZA Offshore",
        tagline: "For UAE freehold property holding",
        priceFromAed: 14500,
        priceNote: "Real-estate ready",
        features: [
          "JAFZA Offshore incorporation",
          "Eligible to hold UAE freehold property",
          "Registered agent",
          "MOA & shareholder register",
          "Annual compliance support",
        ],
      },
    ],
    process: [
      {
        title: "Structure design",
        body: "We confirm your purpose — holding, IP licensing, real estate, trading — and recommend RAK ICC or JAFZA Offshore.",
        durationDays: "Day 1",
      },
      {
        title: "KYC & due diligence",
        body: "Passport, proof of address, source-of-funds declaration and bank reference are reviewed by the registered agent.",
        durationDays: "Day 1–2",
      },
      {
        title: "Incorporation",
        body: "Certificate of incorporation, MOA and share certificates are issued. Company is added to the offshore registry.",
        durationDays: "Day 2–4",
      },
    ],
    faqs: [
      {
        q: "Can an offshore company sponsor visas?",
        a: "No. Offshore structures (RAK ICC and JAFZA Offshore) are not permitted to sponsor employment or investor visas. They are pure holding/trading vehicles. For visas, pair with a free-zone or mainland operating company.",
      },
      {
        q: "Can an offshore company open a UAE bank account?",
        a: "Yes — though banks scrutinise offshore companies more heavily than free-zone or mainland entities. We prepare a strong file (clear purpose, source of funds, ownership chart) and steer toward banks that accept offshore structures.",
      },
      {
        q: "What's the difference between RAK ICC and JAFZA Offshore?",
        a: "RAK ICC is the more flexible, lower-cost option for international holding and trading. JAFZA Offshore is more expensive but uniquely able to hold UAE freehold real estate — making it the structure of choice for family offices buying property in Dubai.",
      },
      {
        q: "Is the offshore company taxed?",
        a: "Offshore companies are not subject to UAE corporate tax on foreign-sourced income. UAE-sourced income may be taxable depending on activity. Consult our tax partners for an opinion specific to your structure.",
      },
    ],
    related: ["mainland", "free-zone", "golden-visa"],
    seo: {
      title: "Offshore Company Formation — RAK ICC & JAFZA",
      description:
        "Form a RAK ICC or JAFZA Offshore company in 2–4 days. Ideal for international holding, asset protection and UAE freehold property ownership. Synergy handles structuring, KYC and banking.",
    },
  },

  "pro-services": {
    slug: "pro-services",
    hero: {
      eyebrow: "PRO Services",
      title: "Government, immigration and HR paperwork —",
      titleHighlight: "handled.",
      description:
        "Our PRO team is your liaison to MOHRE, GDRFA, MOFA, the courts and every UAE ministry that touches your business. From document attestation to MOHRE quotas, we keep you compliant and free to run your company.",
      bullets: [
        "Same-day Arabic typing & translations",
        "MOHRE labour quotas & contracts",
        "Document attestation: MOFA, embassy, MOJ",
        "Power-of-attorney & corporate amendments",
      ],
      timelineDays: "Same-day to 5 days per task",
    },
    metricStrip: [
      { label: "Avg. ticket time", value: "< 24h" },
      { label: "Government desks", value: "20+" },
      { label: "Languages", value: "EN · AR · UR" },
      { label: "Coverage", value: "All emirates" },
    ],
    features: [
      {
        icon: "stamp",
        title: "Attestation & legalisation",
        body: "Educational, marriage, birth and corporate documents attested through MOFA, MOJ and country embassies — both incoming and outgoing.",
      },
      {
        icon: "users",
        title: "MOHRE labour management",
        body: "Quota approvals, work permits, labour contracts, end-of-service settlements and Wage Protection System (WPS) registrations.",
      },
      {
        icon: "key",
        title: "Immigration desk",
        body: "Visa cancellations, status changes, exit permits, dependants' visas and overstay resolutions handled at GDRFA / ICA.",
      },
      {
        icon: "globe",
        title: "Court & notary",
        body: "Power of attorney drafting, MOA amendments, share-transfer notarisation and court attestations across Abu Dhabi and Dubai.",
      },
      {
        icon: "clock",
        title: "Renewals on autopilot",
        body: "Trade licence, Ejari, immigration card and visa renewals tracked centrally — we file 30 days ahead of expiry, every time.",
      },
      {
        icon: "shield",
        title: "Compliance monitoring",
        body: "UBO disclosures, ESR notifications, AML registrations and corporate tax filings tracked against your activity profile.",
      },
    ],
    process: [
      {
        title: "Submit a ticket",
        body: "WhatsApp, email or portal — describe what you need (e.g. 'attest my MBA from India for use in ADGM').",
        durationDays: "Same-day",
      },
      {
        title: "We confirm cost & timeline",
        body: "Government fees, Synergy service fee and an SLA are sent back within 1 business hour.",
        durationDays: "1 hour",
      },
      {
        title: "We execute",
        body: "Our PRO visits the relevant counter, files documents and follows up daily until your ticket clears.",
        durationDays: "1–5 days",
      },
      {
        title: "Delivery & filing",
        body: "Original documents are couriered to you and digital copies are filed in your client portal for future reference.",
      },
    ],
    faqs: [
      {
        q: "Do I need to retain Synergy on a monthly basis?",
        a: "Optional. Most clients pay per ticket. Larger clients prefer a monthly retainer (from AED 1,500/month) for unlimited routine PRO work plus a 30-day renewal calendar — typically cheaper if you process 4+ tickets a month.",
      },
      {
        q: "How long does MOFA attestation take?",
        a: "For documents already legalised in their country of origin, MOFA attestation in the UAE is typically same-day or next-day. Foreign documents that require embassy legalisation first can take 1–3 weeks depending on the country.",
      },
      {
        q: "Can you handle visa cancellations remotely?",
        a: "Yes — once we have a signed power of attorney and the original passport, most cancellations can be completed in 2–5 working days without your physical presence.",
      },
      {
        q: "What's the WPS and do I need it?",
        a: "The Wage Protection System is mandatory for any company with employees on labour contracts. Salaries must be paid via a UAE bank linked to the WPS file. We register your company and configure your bank's WPS feed.",
      },
    ],
    related: ["mainland", "visa", "free-zone"],
    seo: {
      title: "UAE PRO Services — MOHRE, GDRFA, MOFA & More",
      description:
        "Same-day typing, MOHRE quotas, document attestation and government liaison across the UAE. Synergy's PRO team keeps your company compliant so you can focus on operations.",
    },
  },

  visa: {
    slug: "visa",
    hero: {
      eyebrow: "UAE Visa Services",
      title: "Employment, family and investor visas —",
      titleHighlight: "stamped and ready.",
      description:
        "Whether you're sponsoring a new hire, bringing your family to the UAE, or stamping your own investor visa, Synergy handles every step: entry permit, medical, Emirates ID and final visa stamping.",
      bullets: [
        "Employment, investor, family and visit visas",
        "2-year and 3-year residency options",
        "Medical, biometrics and Emirates ID end-to-end",
        "Status change without leaving the UAE",
      ],
      timelineDays: "10–15 working days",
    },
    metricStrip: [
      { label: "Avg. processing", value: "10–15 days" },
      { label: "Visa types", value: "12+" },
      { label: "Family included", value: "Spouse + kids" },
      { label: "Status change", value: "In-country" },
    ],
    features: [
      {
        icon: "users",
        title: "Employment visas",
        body: "MOHRE work permit, entry permit, medical, Emirates ID and visa stamping for new hires — fully tracked through our portal.",
      },
      {
        icon: "key",
        title: "Investor & partner visas",
        body: "2-year residency tied to your share in a UAE company. We handle the establishment-card update, immigration and stamping.",
      },
      {
        icon: "shield",
        title: "Family sponsorship",
        body: "Sponsor your spouse, children and parents (subject to salary thresholds). We handle attestation of marriage and birth certificates where needed.",
      },
      {
        icon: "globe",
        title: "Visit & 60-day visas",
        body: "Tourism, business and 60-day grace visas — useful while a long-term visa is being processed.",
      },
      {
        icon: "clock",
        title: "Renewals 60 days ahead",
        body: "We open renewal applications 60 days before expiry, batch medical bookings and minimise your team's downtime.",
      },
      {
        icon: "stamp",
        title: "Status change",
        body: "Convert from a visit visa to a residence visa without leaving the UAE — saving the round-trip flight and time off.",
      },
    ],
    process: [
      {
        title: "Quota & eligibility check",
        body: "We confirm visa quota on your immigration card, salary threshold for sponsorship and required documents per nationality.",
        durationDays: "Day 1",
      },
      {
        title: "Entry permit (e-visa)",
        body: "Online application via ICA / GDRFA. Approval typically arrives in 2–4 working days.",
        durationDays: "Day 1–4",
      },
      {
        title: "Medical & Emirates ID",
        body: "We book and accompany your candidate to medical screening and Emirates ID biometrics.",
        durationDays: "Day 5–8",
      },
      {
        title: "Final visa stamping",
        body: "Visa is stamped in the passport (or e-visa issued); Emirates ID is delivered. Welcome to the UAE.",
        durationDays: "Day 10–15",
      },
    ],
    faqs: [
      {
        q: "What salary do I need to sponsor my family?",
        a: "AED 4,000/month with accommodation (or AED 5,000/month without) for spouse and children under 18. Sponsoring parents typically requires AED 20,000/month plus extra deposits and proof that you are their sole supporter.",
      },
      {
        q: "How long is a UAE residence visa valid?",
        a: "Standard employment and investor visas are 2 years; some skilled-professional and Golden Visa categories are 5 or 10 years. All require renewal before expiry to avoid overstay fines.",
      },
      {
        q: "Can I start working before my visa is stamped?",
        a: "Once the entry permit is approved and the medical / Emirates ID are submitted, your candidate can begin work in most cases. Final stamping happens within ~10 days; we issue an interim work confirmation if HR requires it.",
      },
      {
        q: "What happens if a visa application is rejected?",
        a: "Rejections are rare with proper preparation. If one occurs, we appeal within the 30-day window and address the cited reason — usually a typo, a missing attestation or a quota issue. There's no additional fee for our appeal work.",
      },
    ],
    related: ["mainland", "free-zone", "golden-visa"],
    seo: {
      title: "UAE Visa Services — Employment, Family & Investor",
      description:
        "Sponsor employees, bring your family to the UAE, or stamp your investor visa. Synergy handles entry permits, medical, Emirates ID and stamping in 10–15 days.",
    },
  },

  "golden-visa": {
    slug: "golden-visa",
    hero: {
      eyebrow: "UAE Golden Visa",
      title: "Secure 10-year UAE residency with the",
      titleHighlight: "Golden Visa",
      description:
        "The Golden Visa is the UAE's premier long-term residency programme — 10 years, family included, no employer sponsor required. Synergy runs a free eligibility check across all 7 tracks and handles your application end-to-end.",
      bullets: [
        "10-year renewable residency",
        "No employer sponsor required",
        "Sponsor unlimited family members",
        "6-month grace period on each renewal",
      ],
      timelineDays: "30–60 working days",
    },
    metricStrip: [
      { label: "Validity", value: "10 years" },
      { label: "Family included", value: "Yes" },
      { label: "Eligibility tracks", value: "7" },
      { label: "Sponsor required", value: "None" },
    ],
    features: [
      {
        icon: "wallet",
        title: "Investor track",
        body: "AED 2M+ in UAE real estate, an active business with paid-up capital ≥ AED 2M, or AED 2M in a UAE-licensed investment fund.",
      },
      {
        icon: "rocket",
        title: "Entrepreneur track",
        body: "Founders of approved or acquired startups (≥ AED 500K project value) or holders of equivalent business approvals from a UAE accelerator.",
      },
      {
        icon: "sparkles",
        title: "Specialised talent",
        body: "Doctors, scientists, engineers, IT specialists, artists, athletes and PhD-holders with proof of accomplishments and a salary threshold.",
      },
      {
        icon: "users",
        title: "Outstanding students",
        body: "Top-ranked UAE high-school graduates and university students with GPAs at the top of their cohort qualify directly.",
      },
      {
        icon: "shield",
        title: "Frontline workers",
        body: "Healthcare professionals who served during national emergencies are eligible under a dedicated humanitarian track.",
      },
      {
        icon: "globe",
        title: "Family sponsorship included",
        body: "Sponsor your spouse and children under one application — and unmarried daughters and sons up to 25 with no salary threshold.",
      },
    ],
    packages: [
      {
        name: "Eligibility Check",
        tagline: "Find your strongest track",
        priceFromAed: 0,
        priceNote: "Free",
        features: [
          "30-min consultation",
          "Track-by-track eligibility scorecard",
          "Document checklist",
          "Realistic-timeline estimate",
        ],
      },
      {
        name: "Application",
        tagline: "End-to-end Golden Visa",
        priceFromAed: 18500,
        priceNote: "+ government fees",
        highlight: true,
        features: [
          "Full application drafting & filing",
          "Document attestation & translations",
          "Entry-permit issuance",
          "Medical, biometrics, Emirates ID",
          "Family-member sponsorship included",
        ],
      },
    ],
    process: [
      {
        title: "Free eligibility assessment",
        body: "30-min discovery call. We map your profile to the strongest of the 7 Golden Visa tracks and identify any gaps.",
        durationDays: "Day 1",
      },
      {
        title: "Document pack & nomination",
        body: "We assemble the evidence package — financials, MOFA-attested certificates, NOCs — and file your nomination with the relevant authority.",
        durationDays: "Day 2–14",
      },
      {
        title: "Pre-approval & entry permit",
        body: "Once nominated, the federal authority issues a pre-approval and entry permit (or status change if you're already in the UAE).",
        durationDays: "Day 14–30",
      },
      {
        title: "Stamping & family inclusion",
        body: "Medical, Emirates ID and stamping. Family members are sponsored on the same file — typically completed within 30–45 days of pre-approval.",
        durationDays: "Day 30–60",
      },
    ],
    faqs: [
      {
        q: "Do I need a UAE company to qualify?",
        a: "Not always. The investor (real estate or fund) and specialised-talent tracks don't require company ownership. The entrepreneur and business-investor tracks do require a UAE-licensed company. We'll match you to the easiest track first.",
      },
      {
        q: "Can I include my parents?",
        a: "Parents are not automatic. They can be sponsored on a regular family residence visa under the Golden Visa holder, subject to standard salary and accommodation requirements. We handle the parallel application.",
      },
      {
        q: "What happens to my Golden Visa if I leave the UAE for an extended period?",
        a: "Unlike standard residence visas (which lapse after 6 months outside the UAE), Golden Visas remain valid even with extended absence. This is one of the key advantages of the programme.",
      },
      {
        q: "Is there a fast-track option?",
        a: "Yes — for nominations with strong evidence, the government offers an expedited service that can compress the timeline to 15–25 days. We'll flag if your profile qualifies.",
      },
    ],
    related: ["visa", "mainland", "offshore"],
    seo: {
      title: "UAE Golden Visa — 10-Year Residency",
      description:
        "Apply for a 10-year UAE Golden Visa under the investor, entrepreneur, talent or student tracks. Free eligibility check, end-to-end processing and family inclusion by Synergy Business.",
    },
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICES) as ServiceSlug[];

export function getService(slug: string): ServiceDetail | null {
  return (SERVICES as Record<string, ServiceDetail | undefined>)[slug] ?? null;
}
