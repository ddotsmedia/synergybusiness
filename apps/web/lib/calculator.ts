import {
  FREE_ZONES,
  type FreeZone,
  type FreeZoneCategory,
  type FreeZoneEmirate,
} from "@/lib/free-zones-data";

export type OfficePreference = "flexi-desk" | "co-working" | "dedicated";
export type Priority = "cost" | "banking" | "prestige" | "speed";

export type CalculatorInput = {
  activityCategory: FreeZoneCategory;
  shareholders: number;
  visasNeeded: number;
  officePreference: OfficePreference;
  emiratePreference: FreeZoneEmirate | "any";
  priority: Priority;
};

export type CostBreakdownLine = {
  label: string;
  amountAed: number;
  detail?: string;
};

export type ZoneEstimate = {
  zone: FreeZone;
  matchScore: number; // 0–100
  reasons: string[];
  yearOne: {
    lines: CostBreakdownLine[];
    totalAed: number;
  };
  yearTwoOnwards: {
    lines: CostBreakdownLine[];
    totalAed: number;
  };
  setupTime: string;
};

const BANK_WEIGHT: Record<FreeZone["bankFriendliness"], number> = {
  Excellent: 1.0,
  Strong: 0.85,
  Good: 0.7,
  Variable: 0.5,
};

const VISA_FEE_AED = 4500; // medical + EID + stamping per person
const SYNERGY_BASE_FEE_AED = 7500;
const SYNERGY_PER_VISA_AED = 1500;
const PRO_RETAINER_PER_YEAR_AED = 4000;
const SHAREHOLDER_SURCHARGE_AED = 1500; // beyond the first

function score(zone: FreeZone, input: CalculatorInput): {
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let s = 0;

  if (zone.category === input.activityCategory) {
    s += 30;
    reasons.push(`Specialised cluster for ${zone.category.toLowerCase()}`);
  }

  if (
    input.emiratePreference !== "any" &&
    zone.emirate === input.emiratePreference
  ) {
    s += 18;
    reasons.push(`Located in ${zone.emirate} as you preferred`);
  } else if (input.emiratePreference === "any") {
    s += 6;
  }

  // Office preference fit
  const wantsOffice = input.officePreference === "dedicated";
  if (wantsOffice && zone.officeRequired) {
    s += 10;
    reasons.push("Supports a dedicated Ejari office");
  } else if (!wantsOffice && !zone.officeRequired) {
    s += 12;
    reasons.push("Supports flexi-desk and co-working");
  } else {
    s -= 6;
  }

  // Visa quota fit
  if (input.visasNeeded <= 3 && !zone.officeRequired) {
    s += 6;
  } else if (input.visasNeeded > 6 && zone.officeRequired) {
    s += 8;
    reasons.push(
      "Visa quota scales cleanly with office size for larger teams",
    );
  }

  // Priority weighting
  if (input.priority === "cost") {
    // Lower startingCostAed → higher score (max 20)
    const minCost = Math.min(...FREE_ZONES.map((z) => z.startingCostAed));
    const maxCost = Math.max(...FREE_ZONES.map((z) => z.startingCostAed));
    const range = maxCost - minCost || 1;
    const costScore =
      20 * (1 - (zone.startingCostAed - minCost) / range);
    s += costScore;
    if (zone.startingCostAed <= 7000) {
      reasons.push("Among the lowest entry costs in the UAE");
    }
  } else if (input.priority === "banking") {
    s += 20 * BANK_WEIGHT[zone.bankFriendliness];
    if (zone.bankFriendliness === "Excellent") {
      reasons.push("Top-tier UAE banking acceptance");
    }
  } else if (input.priority === "prestige") {
    if (zone.bankFriendliness === "Excellent") s += 14;
    if (
      ["Finance & Holding", "Aviation"].includes(zone.category as string)
    ) {
      s += 8;
      reasons.push("Strong international reputation");
    }
  } else if (input.priority === "speed") {
    // Bias toward zones with shorter setup times
    if (zone.setupTime.startsWith("1") || zone.setupTime.startsWith("2")) {
      s += 16;
      reasons.push(`Setup in ${zone.setupTime}`);
    } else if (zone.setupTime.startsWith("3")) {
      s += 10;
    }
  }

  return { score: Math.max(0, Math.min(100, Math.round(s))), reasons };
}

function costBreakdown(zone: FreeZone, input: CalculatorInput) {
  const extraShareholders = Math.max(0, input.shareholders - 1);
  const visaFees = input.visasNeeded * VISA_FEE_AED;
  const synergyFee =
    SYNERGY_BASE_FEE_AED + input.visasNeeded * SYNERGY_PER_VISA_AED;
  const shareholderSurcharge =
    extraShareholders * SHAREHOLDER_SURCHARGE_AED;

  const yearOneLines: CostBreakdownLine[] = [
    {
      label: `${zone.short} licence (year 1)`,
      amountAed: zone.startingCostAed,
      detail: `Government & free-zone fees`,
    },
    {
      label: "Synergy service fee",
      amountAed: synergyFee,
      detail: `Setup, KYC, MOA, immigration card${
        input.visasNeeded > 0 ? `, ${input.visasNeeded} visa application(s)` : ""
      }`,
    },
  ];
  if (input.visasNeeded > 0) {
    yearOneLines.push({
      label: "Visa government fees",
      amountAed: visaFees,
      detail: `Medical, Emirates ID, stamping × ${input.visasNeeded}`,
    });
  }
  if (extraShareholders > 0) {
    yearOneLines.push({
      label: `Additional shareholders × ${extraShareholders}`,
      amountAed: shareholderSurcharge,
    });
  }

  const yearOneTotal = yearOneLines.reduce(
    (sum, l) => sum + l.amountAed,
    0,
  );

  // Year 2 renewal — typically licence at full price, no MOA again, plus PRO retainer
  const renewalLicence = Math.round(zone.startingCostAed * 0.85);
  const yearTwoLines: CostBreakdownLine[] = [
    {
      label: `${zone.short} licence renewal`,
      amountAed: renewalLicence,
    },
    {
      label: "Synergy PRO retainer",
      amountAed: PRO_RETAINER_PER_YEAR_AED,
      detail: "Renewal filing, immigration card, compliance reminders",
    },
  ];
  if (input.visasNeeded > 0) {
    yearTwoLines.push({
      label: "Visa renewals (50% trigger)",
      amountAed: Math.round((visaFees / 2) * 0.5),
      detail: "Phased over 2 years; estimate only",
    });
  }
  const yearTwoTotal = yearTwoLines.reduce(
    (sum, l) => sum + l.amountAed,
    0,
  );

  return {
    yearOne: { lines: yearOneLines, totalAed: yearOneTotal },
    yearTwoOnwards: { lines: yearTwoLines, totalAed: yearTwoTotal },
  };
}

export function estimate(input: CalculatorInput): ZoneEstimate[] {
  const ranked = FREE_ZONES.map((zone) => {
    const { score: s, reasons } = score(zone, input);
    const { yearOne, yearTwoOnwards } = costBreakdown(zone, input);
    return {
      zone,
      matchScore: s,
      reasons,
      yearOne,
      yearTwoOnwards,
      setupTime: zone.setupTime,
    } satisfies ZoneEstimate;
  })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return ranked;
}

export function emptyInput(): CalculatorInput {
  return {
    activityCategory: "General SME",
    shareholders: 1,
    visasNeeded: 1,
    officePreference: "flexi-desk",
    emiratePreference: "any",
    priority: "cost",
  };
}
