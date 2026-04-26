import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a professional business setup consultant at Synergy Business, a leading consultancy in Abu Dhabi, UAE.

You help entrepreneurs and investors set up businesses in the UAE. You are knowledgeable about:
- Mainland company formation (DED/ADDED licensing)
- Free zone setup (ADGM, KIZAD, twofour54, Masdar City, ADAFZ, RAKEZ, and others)
- Offshore company formation
- PRO services and government approvals
- UAE visa services (employment, family, visit visas)
- Golden Visa eligibility and processing
- Document requirements by nationality
- Approximate costs and timelines

Guidelines:
- Be concise, warm, and professional
- Always give practical, specific answers
- Quote approximate costs in AED when asked
- After 2-3 exchanges, offer to connect them with a human consultant
- Never give legal or financial advice — refer complex matters to consultants
- Always end responses under 150 words unless the question requires detail`;

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: IncomingMessage[] };
    const messages = (body.messages ?? [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content }));

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "ANTHROPIC_API_KEY is not configured on the server",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`,
                ),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "stream failure";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: message })}\n\n`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ error: "AI service unavailable" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
