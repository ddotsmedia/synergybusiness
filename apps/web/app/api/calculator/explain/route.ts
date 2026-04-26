import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const inputSchema = z.object({
  zoneShort: z.string().min(1).max(40),
  zoneName: z.string().min(1).max(120),
  zoneCategory: z.string().min(1).max(60),
  emirate: z.string().min(1).max(40),
  matchScore: z.number().min(0).max(100),
  reasons: z.array(z.string().max(200)).max(8),
  user: z.object({
    activityCategory: z.string().min(1).max(60),
    shareholders: z.number().int().min(1).max(20),
    visasNeeded: z.number().int().min(0).max(50),
    officePreference: z.string().min(1).max(40),
    emiratePreference: z.string().min(1).max(40),
    priority: z.string().min(1).max(40),
  }),
  yearOneTotalAed: z.number().int().min(0),
});

const SYSTEM_PROMPT = `You are a senior business setup consultant at Synergy Business in Abu Dhabi.

You will be given a UAE free zone recommendation along with the user's stated needs and a year-1 cost. Write a single warm, concrete paragraph (2-3 sentences, max 60 words) explaining why this zone fits this specific user.

Rules:
- Be specific to the user's inputs (their priority, visa count, activity).
- Reference one or two concrete features of the zone (e.g. banking acceptance, industry cluster, cost level).
- Do not invent fees or numbers; refer to "the year-one estimate" if you mention cost.
- No headings, no bullet points, no markdown — just one short paragraph.
- Don't repeat the zone's full name; use the short name only.
- End with a soft prompt to talk to a human consultant if it's a borderline fit.`;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fallbackExplanation(input: z.infer<typeof inputSchema>) {
  const { zoneShort, user, reasons } = input;
  const reason = reasons[0] ?? `it matches your ${user.activityCategory.toLowerCase()} activity`;
  return `${zoneShort} is a strong fit because ${reason.toLowerCase()}. With ${user.visasNeeded} visa${user.visasNeeded === 1 ? "" : "s"} and a ${user.officePreference.replace("-", " ")} setup, the year-one estimate lines up with your ${user.priority} priority. If you'd like a sanity check, talk to a Synergy consultant.`;
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Graceful fallback when Anthropic key isn't configured.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({
      explanation: fallbackExplanation(parsed.data),
      source: "fallback",
    });
  }

  const userMsg = JSON.stringify(parsed.data, null, 2);

  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const result = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 220,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMsg }],
    });

    const text = result.content
      .filter((c): c is Anthropic.TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("\n")
      .trim();

    return Response.json({
      explanation: text || fallbackExplanation(parsed.data),
      source: "claude",
    });
  } catch (err) {
    console.error("[calculator/explain] Claude error:", err);
    return Response.json({
      explanation: fallbackExplanation(parsed.data),
      source: "fallback",
    });
  }
}
