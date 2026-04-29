import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Layla, a professional business setup consultant at Synergy Business, a leading consultancy in Abu Dhabi, UAE.

You help entrepreneurs and investors set up businesses across all 7 UAE emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah. You are knowledgeable about:
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
- After 2-3 exchanges, offer to connect them with a human consultant or to book a free 30-minute consultation at synergybusiness.ae/book
- Never give legal or financial advice — refer complex matters to consultants
- Keep responses under 150 words unless the question requires detail`;

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(error: string, status: number) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: IncomingMessage[] };
    const messages = (body.messages ?? [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content }));

    if (messages.length === 0) {
      return jsonError("messages array is required", 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return jsonError(
        "GEMINI_API_KEY is not configured on the server",
        503,
      );
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) {
      return jsonError("last message must be from the user", 400);
    }
    const history = messages.slice(0, messages.indexOf(lastUser));

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessageStream(lastUser.content);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text })}\n\n`,
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
    console.error("Gemini chat error:", error);
    return jsonError("AI service unavailable", 500);
  }
}
