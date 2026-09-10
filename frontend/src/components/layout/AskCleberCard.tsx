import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowIcon } from "@/components/icons/Arrow";
import { SparklesIcon } from "@/components/icons/Sparkles";
import { postChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const MAX_HISTORY_SENT = 6;

export function AskCleberCard() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const { reply } = await postChatMessage(
        trimmed,
        messages.slice(-MAX_HISTORY_SENT),
      );
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao falar com o Cleber.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="brand-gradient space-y-4 rounded-[2rem] p-6 shadow-sm">
      <div className="flex items-center gap-2 text-lg font-semibold text-brand">
        Ask Cleber
        <SparklesIcon className="h-5 w-5 text-brand" />
      </div>

      {messages.length > 0 && (
        <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "rounded-2xl px-3 py-2 text-sm",
                message.role === "user"
                  ? "bg-white/70 text-foreground dark:bg-black/20"
                  : "bg-brand text-brand-foreground",
              )}
            >
              {message.content}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask anything..."
          disabled={isSending}
          className="flex-1 bg-white/90 dark:bg-background/80"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSending || !input.trim()}
          className="shrink-0 rounded-full bg-brand text-brand-foreground hover:opacity-90"
        >
          <ArrowIcon className="h-3.5 w-3.5 rotate-180" aria-label="Enviar" />
        </Button>
      </form>
    </section>
  );
}
