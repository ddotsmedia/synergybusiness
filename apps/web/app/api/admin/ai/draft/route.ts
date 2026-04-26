import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getAdminActor } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inputSchema = z.object({
  context: z.enum(["lead.followup", "application.update", "general"]),
  lead: z
    .object({
      name: z.string().max(120),
      email: z.string().max(180),
      serviceInterest: z.string().max(40),
      message: z.string().max(2000).nullable(),
      source: z.string().max(40),
      status: z.string().max(40),
    })
    .optional(),
  application: z
    .object({
      label: z.string().max(200),
      stage: z.string().max(40),
      notes: z.array(z.string().max(500)).max(20),
    })
    .optional(),
  prompt: z.string().min(1).max(500),
});

const SYSTEM_PROMPT = `You are a senior consultant drafting communications for Synergy Business, an Abu Dhabi business setup consultancy.

Write in a warm, concise, professional tone. Reference UAE-specific concepts (free zones, mainland licences, Golden Visa) where relevant. Keep messages under 180 words unless the prompt asks for more.

Guidelines:
- For follow-up emails: open with a friendly line, refer to the lead's stated interest, propose 2-3 concrete next steps, end with a soft call-to-action.
- For application updates: state the current stage, list what was done, list what's next, give an honest ETA.
- For summaries: 2-3 sentences, lead with the headline.

Never make up government fees, free-zone names, or visa categories you don't recognise. Use general guidance and prompt the consultant to verify specifics.`;

function fallback(input: z.infer<typeof inputSchema>) {
  if (input.context === "lead.followup" && input.lead) {
    return `Hi ${input.lead.name.split(" ")[0]},\n\nThanks again for your interest in our ${input.lead.serviceInterest.replace("-", " ")} services. I'd love to schedule 30 minutes to walk you through your options and put together a tailored quote.\n\nWould any of these times work? Tuesday 11:00 GST, Wednesday 14:00 GST, or Thursday 10:00 GST.\n\nWarm regards,\nSynergy Business`;
  }
  return `Draft generated. Tip: set ANTHROPIC_API_KEY for AI-assisted drafting tuned to your specific context.`;
}

export async function POST(req: Request) {
  const actor = await getAdminActor();
  if (!actor) return Response.json({ error: "Unauthorised" }, { status: 401 });

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

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({
      draft: fallback(parsed.data),
      source: "fallback",
    });
  }

  const userMsg = JSON.stringify(parsed.data, null, 2);

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const result = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
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
      draft: text || fallback(parsed.data),
      source: "claude",
    });
  } catch (err) {
    console.error("[admin/ai/draft] error:", err);
    return Response.json({
      draft: fallback(parsed.data),
      source: "fallback",
    });
  }
}
