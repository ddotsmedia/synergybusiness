export type FreeZoneCategory =
  | "Finance & Holding"
  | "Industrial & Logistics"
  | "Media & Tech"
  | "Sustainability"
  | "General SME"
  | "Aviation";

export type FreeZoneEmirate =
  | "Abu Dhabi"
  | "Dubai"
  | "Sharjah"
  | "Ras Al Khaimah"
  | "Umm Al Quwain"
  | "Fujairah"
  | "Ajman";

export type FreeZone = {
  id: string;
  short: string;
  name: string;
  emirate: FreeZoneEmirate;
  category: FreeZoneCategory;
  pitch: string;
  industries: string[];
  highlights: string[];
  startingCostAed: number;
  visaQuotaFromOffice: string;
  officeRequired: boolean;
  foreignOwnership: number;
  bankFriendliness: "Excellent" | "Strong" | "Good" | "Variable";
  setupTime: string;
};

export const FREE_ZONES: FreeZone[] = [
  {
    id: "adgm",
    short: "ADGM",
    name: "Abu Dhabi Global Market",
    emirate: "Abu Dhabi",
    category: "Finance & Holding",
    pitch:
      "International financial centre on Al Maryah Island operating under English Common Law — the gold standard for fintech, asset management and holding companies.",
    industries: [
      "Fintech",
      "Asset management",
      "Family offices",
      "Holding companies",
      "Crypto / VARA-adjacent",
    ],
    highlights: [
      "English Common Law jurisdiction",
      "Direct FSRA regulation for financial firms",
      "Strong international banking acceptance",
      "Tier-1 reputation for investor visas",
    ],
    startingCostAed: 12500,
    visaQuotaFromOffice: "1 visa per 9 sqm of office",
    officeRequired: true,
    foreignOwnership: 100,
    bankFriendliness: "Excellent",
    setupTime: "5–10 working days",
  },
  {
    id: "kizad",
    short: "KIZAD",
    name: "Khalifa Industrial Zone Abu Dhabi",
    emirate: "Abu Dhabi",
    category: "Industrial & Logistics",
    pitch:
      "Mega industrial cluster next to Khalifa Port — built for manufacturing, heavy logistics, e-commerce fulfilment and chemicals.",
    industries: [
      "Manufacturing",
      "Logistics & warehousing",
      "Pharma",
      "F&B production",
      "E-commerce fulfilment",
    ],
    highlights: [
      "Direct Khalifa Port access",
      "Plots from 2,500 sqm to 100+ ha",
      "Dual licence (mainland + free zone) options",
      "Tax incentives for industrial activity",
    ],
    startingCostAed: 8500,
    visaQuotaFromOffice: "Activity-driven (industrial-class)",
    officeRequired: true,
    foreignOwnership: 100,
    bankFriendliness: "Strong",
    setupTime: "7–14 working days",
  },
  {
    id: "twofour54",
    short: "twofour54",
    name: "Media Zone Authority — twofour54",
    emirate: "Abu Dhabi",
    category: "Media & Tech",
    pitch:
      "Abu Dhabi's media free zone for content production, broadcasting, gaming, animation and digital media — co-working and broadcast-ready studios available.",
    industries: [
      "Content production",
      "Gaming & esports",
      "Broadcasting",
      "Marketing & PR",
      "Influencer & creator businesses",
    ],
    highlights: [
      "Production rebates up to 30%",
      "Studios, edit suites & MOCAP onsite",
      "Streamlined media filming permits",
      "Strong creator-economy talent pool",
    ],
    startingCostAed: 5750,
    visaQuotaFromOffice: "Up to 4 visas on flexi-desk",
    officeRequired: false,
    foreignOwnership: 100,
    bankFriendliness: "Strong",
    setupTime: "3–7 working days",
  },
  {
    id: "masdar",
    short: "Masdar",
    name: "Masdar City Free Zone",
    emirate: "Abu Dhabi",
    category: "Sustainability",
    pitch:
      "Sustainability-focused free zone for clean tech, AI, mobility, energy and innovation companies inside Abu Dhabi's flagship low-carbon city.",
    industries: [
      "Clean tech & renewables",
      "AI & robotics",
      "Mobility & EV",
      "Sustainable construction",
      "ESG advisory",
    ],
    highlights: [
      "Flagship sustainability cluster",
      "Co-located with IRENA & MBZUAI",
      "Generous innovation grants ecosystem",
      "Premium ESG branding for investors",
    ],
    startingCostAed: 6500,
    visaQuotaFromOffice: "Up to 6 visas on co-working",
    officeRequired: false,
    foreignOwnership: 100,
    bankFriendliness: "Strong",
    setupTime: "5–10 working days",
  },
  {
    id: "adafz",
    short: "ADAFZ",
    name: "Abu Dhabi Airports Free Zone",
    emirate: "Abu Dhabi",
    category: "Aviation",
    pitch:
      "Free zone inside Zayed International Airport — built for aviation, logistics, e-commerce and time-sensitive trade.",
    industries: [
      "Aviation services",
      "Logistics & freight",
      "Cross-border e-commerce",
      "MRO & aerospace",
    ],
    highlights: [
      "Airside warehouse access",
      "Streamlined customs clearance",
      "Bonded logistics zone",
      "Tier-1 connectivity to Asia & Europe",
    ],
    startingCostAed: 11000,
    visaQuotaFromOffice: "Activity-driven",
    officeRequired: true,
    foreignOwnership: 100,
    bankFriendliness: "Strong",
    setupTime: "7–14 working days",
  },
  {
    id: "rakez",
    short: "RAKEZ",
    name: "Ras Al Khaimah Economic Zone",
    emirate: "Ras Al Khaimah",
    category: "General SME",
    pitch:
      "Most popular low-cost UAE free zone for SMEs, consultancies and trading companies. Multiple specialised parks within one authority.",
    industries: [
      "Trading & general services",
      "Consulting",
      "Light industrial",
      "Education",
      "Media & marketing",
    ],
    highlights: [
      "Lowest entry cost in the UAE",
      "Wide activity catalogue",
      "5-day setup",
      "Easy upgrade path between licence types",
    ],
    startingCostAed: 5750,
    visaQuotaFromOffice: "Up to 6 visas on flexi-desk",
    officeRequired: false,
    foreignOwnership: 100,
    bankFriendliness: "Variable",
    setupTime: "3–5 working days",
  },
  {
    id: "ifza",
    short: "IFZA",
    name: "International Free Zone Authority",
    emirate: "Dubai",
    category: "General SME",
    pitch:
      "Dubai-based free zone with one of the broadest activity lists and competitive package pricing. Strong fit for service businesses, consultancies and SMEs.",
    industries: [
      "Consulting & professional services",
      "Trading",
      "E-commerce",
      "Marketing agencies",
      "IT services",
    ],
    highlights: [
      "Broad 1,500+ activity catalogue",
      "Competitive multi-shareholder pricing",
      "Strong agent network",
      "Flexible visa add-on packages",
    ],
    startingCostAed: 12500,
    visaQuotaFromOffice: "Visa packages bundled",
    officeRequired: false,
    foreignOwnership: 100,
    bankFriendliness: "Good",
    setupTime: "3–7 working days",
  },
  {
    id: "dmcc",
    short: "DMCC",
    name: "Dubai Multi Commodities Centre",
    emirate: "Dubai",
    category: "Finance & Holding",
    pitch:
      "Dubai's free zone of choice for commodities, crypto, precious metals and trading companies. JLT location offers premium credibility for clients in fintech and trade.",
    industries: [
      "Crypto & digital assets",
      "Commodities trading",
      "Precious metals & gems",
      "Trading & holding",
      "Professional services",
    ],
    highlights: [
      "Strong crypto licensing pathway",
      "Tier-1 banking acceptance",
      "Iconic JLT corporate address",
      "Active member community",
    ],
    startingCostAed: 20865,
    visaQuotaFromOffice: "1 visa per 9 sqm",
    officeRequired: true,
    foreignOwnership: 100,
    bankFriendliness: "Excellent",
    setupTime: "7–10 working days",
  },
  {
    id: "difc",
    short: "DIFC",
    name: "Dubai International Financial Centre",
    emirate: "Dubai",
    category: "Finance & Holding",
    pitch:
      "Internationally recognised financial free zone under English Common Law. The natural home for banks, asset managers, family offices and fintechs.",
    industries: [
      "Banking & wealth",
      "Asset management",
      "Family offices",
      "Fintech",
      "Holding & trust",
    ],
    highlights: [
      "DFSA financial regulation",
      "English Common Law jurisdiction",
      "Tier-1 international reputation",
      "High-end office tower locations",
    ],
    startingCostAed: 38000,
    visaQuotaFromOffice: "1 visa per 9 sqm",
    officeRequired: true,
    foreignOwnership: 100,
    bankFriendliness: "Excellent",
    setupTime: "20–30 working days",
  },
  {
    id: "jafza",
    short: "JAFZA",
    name: "Jebel Ali Free Zone",
    emirate: "Dubai",
    category: "Industrial & Logistics",
    pitch:
      "Dubai's flagship industrial free zone — adjacent to Jebel Ali Port and Al Maktoum Airport. Long-standing reputation for trading, manufacturing and logistics.",
    industries: [
      "Manufacturing",
      "Logistics & re-export",
      "Heavy industry",
      "Distribution",
      "Auto trade",
    ],
    highlights: [
      "Direct Jebel Ali Port access",
      "Tier-1 international reputation",
      "Plot, warehouse & office options",
      "Offshore + onshore in one authority",
    ],
    startingCostAed: 15500,
    visaQuotaFromOffice: "Activity-driven",
    officeRequired: true,
    foreignOwnership: 100,
    bankFriendliness: "Excellent",
    setupTime: "10–20 working days",
  },
  {
    id: "shams",
    short: "SHAMS",
    name: "Sharjah Media City",
    emirate: "Sharjah",
    category: "Media & Tech",
    pitch:
      "Low-cost Sharjah free zone for media, marketing and creator businesses with a notably broad activity list and competitive entry pricing.",
    industries: [
      "Marketing & advertising",
      "Content & influencers",
      "Software & IT",
      "Media production",
    ],
    highlights: [
      "Single-shareholder packages",
      "1,500+ activities allowed",
      "Affordable visa packages",
      "Beginner-friendly for creators",
    ],
    startingCostAed: 5750,
    visaQuotaFromOffice: "Up to 6 visas on flexi-desk",
    officeRequired: false,
    foreignOwnership: 100,
    bankFriendliness: "Good",
    setupTime: "3–5 working days",
  },
  {
    id: "saif",
    short: "SAIF Zone",
    name: "Sharjah Airport International Free Zone",
    emirate: "Sharjah",
    category: "Industrial & Logistics",
    pitch:
      "Established Sharjah free zone next to Sharjah International Airport. Strong for logistics, F&B, trading and light manufacturing.",
    industries: [
      "Logistics & freight",
      "Light manufacturing",
      "Trading & distribution",
      "F&B",
    ],
    highlights: [
      "Bonded warehousing & cold storage",
      "Direct airport / port connectivity",
      "Long-standing trading reputation",
      "24/7 operations support",
    ],
    startingCostAed: 11500,
    visaQuotaFromOffice: "Activity-driven",
    officeRequired: true,
    foreignOwnership: 100,
    bankFriendliness: "Strong",
    setupTime: "7–14 working days",
  },
  {
    id: "ajman",
    short: "Ajman FZ",
    name: "Ajman Free Zone",
    emirate: "Ajman",
    category: "General SME",
    pitch:
      "Cost-leading free zone for first-time entrepreneurs and small trading businesses with simplified setup and inexpensive renewals.",
    industries: [
      "General trading",
      "Consulting",
      "E-commerce",
      "Light services",
    ],
    highlights: [
      "Low first-year cost",
      "Same-day digital licence option",
      "Simple renewal model",
      "Ideal for solo founders",
    ],
    startingCostAed: 5750,
    visaQuotaFromOffice: "1–3 visas",
    officeRequired: false,
    foreignOwnership: 100,
    bankFriendliness: "Variable",
    setupTime: "1–3 working days",
  },
];

export const FREE_ZONE_CATEGORIES: FreeZoneCategory[] = [
  "Finance & Holding",
  "Industrial & Logistics",
  "Media & Tech",
  "Sustainability",
  "Aviation",
  "General SME",
];

export const FREE_ZONE_EMIRATES: FreeZoneEmirate[] = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ras Al Khaimah",
  "Ajman",
];

export function getFreeZone(id: string): FreeZone | null {
  return FREE_ZONES.find((z) => z.id === id) ?? null;
}
