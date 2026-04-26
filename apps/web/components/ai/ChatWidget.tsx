"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Phone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your Synergy Business assistant. Ask me about Mainland or Free Zone setup, the Golden Visa, costs, or required documents — I'm here to help.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming, open]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || streaming) return;

    const next: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((_, i) => i !== 0 || messages.length > 1).map(
            (m) => ({ role: m.role, content: m.content }),
          ),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const errorText =
          (await res.text().catch(() => "")) || "Service unavailable";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please try again, or tap 'Talk to a Consultant' to reach a human team member.",
          },
        ]);
        console.error("Chat error:", errorText);
        return;
      }

      // Add empty assistant message we will fill in.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload) as {
              text?: string;
              error?: string;
            };
            if (json.error) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content:
                      "Sorry — something went wrong. A consultant can help directly.",
                  };
                }
                return updated;
              });
              return;
            }
            if (json.text) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: last.content + json.text,
                  };
                }
                return updated;
              });
            }
          } catch {
            // ignore malformed events
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      console.error("Chat fetch error:", err);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Synergy Business chat"
        className={cn(
          "fixed z-40 right-5 bottom-5 h-14 w-14 rounded-full shadow-xl",
          "bg-gradient-to-br from-[#c9a84c] to-[#e8c96b] text-[#0a2540]",
          "flex items-center justify-center transition-transform hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:ring-offset-2",
          open && "opacity-0 pointer-events-none",
        )}
      >
        <MessageSquare className="h-6 w-6" strokeWidth={2.25} />
        <span className="sr-only">Chat with Synergy Business</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className={cn(
                "fixed z-50 right-4 bottom-4 sm:right-5 sm:bottom-5",
                "w-[calc(100vw-2rem)] max-w-md h-[min(640px,calc(100vh-2rem))]",
                "bg-card text-card-foreground border border-border",
                "rounded-2xl shadow-2xl flex flex-col overflow-hidden",
              )}
              role="dialog"
              aria-label="Synergy Business chat"
            >
              <div className="flex items-center justify-between px-5 py-4 bg-[#0a2540] text-white">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c96b] flex items-center justify-center text-[#0a2540]">
                    <Sparkles className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="font-display text-base leading-tight">
                      Synergy Business
                    </p>
                    <p className="text-xs text-white/70 leading-tight">
                      AI Setup Consultant · Replies instantly
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f8f9fc]"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                        m.role === "user"
                          ? "bg-[#0a2540] text-white rounded-br-sm"
                          : "bg-white text-[#1a2b3c] border border-border rounded-bl-sm shadow-sm",
                      )}
                    >
                      {m.content || (
                        <span className="inline-flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-[#6b7e96] animate-bounce" />
                          <span
                            className="h-2 w-2 rounded-full bg-[#6b7e96] animate-bounce"
                            style={{ animationDelay: "120ms" }}
                          />
                          <span
                            className="h-2 w-2 rounded-full bg-[#6b7e96] animate-bounce"
                            style={{ animationDelay: "240ms" }}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSend}
                className="border-t border-border bg-card p-3 flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about setup, costs, visas…"
                  disabled={streaming}
                  className="flex-1"
                  aria-label="Message"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || streaming}
                  className="bg-[#0a2540] hover:bg-[#071a2e] text-white"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              <div className="border-t border-border bg-[#f8f9fc] px-3 py-2">
                <a
                  href="https://wa.me/971500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-md py-2 text-sm font-medium text-[#0a2540] hover:bg-white transition"
                >
                  <Phone className="h-4 w-4" />
                  Talk to a Human Consultant
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
