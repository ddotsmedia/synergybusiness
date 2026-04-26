import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getAdminActor } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inputSchema = z.object({
  applicationLabel: z.string().min(1).max(200),
  stage: z.string().min(1).max(40),
  notes: z.array(z.string().max(500)).max(30),
  ageDays: z.number().int().min(0).max(3650).optional(),
});

const SYSTEM_PROMPT = `You are a senior consultant at Synergy Business writing a 2-3 sentence executive summary of a UAE business-setup application for a colleague picking up the work.

Lead with the headline (current stage + ETA risk), then mention the most important blocker or next step. No greetings, no sign-off, no bullet points.`;

function fallback(input: z.infer<typeof inputSchema>) {
  const noteCount = input.notes.length;
  const last = input.notes[noteCount - 1] ?? "no notes recorded yet";
  return `${input.applicationLabel} is currently at stage "${input.stage.replace("_", " ")}" with ${noteCount} note${noteCount === 1 ? "" : "s"}. Most recent: "${last.slice(0, 140)}${last.length > 140 ? "..." : ""}".`;
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
      summary: fallback(parsed.data),
      source: "fallback",
    });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const result = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 250,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        { role: "user", content: JSON.stringify(parsed.data, null, 2) },
      ],
    });
    const text = result.content
      .filter((c): c is Anthropic.TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("\n")
      .trim();
    return Response.json({
      summary: text || fallback(parsed.data),
      source: "claude",
    });
  } catch (err) {
    console.error("[admin/ai/summarize] error:", err);
    return Response.json({
      summary: fallback(parsed.data),
      source: "fallback",
    });
  }
}
