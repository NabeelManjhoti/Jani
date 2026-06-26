"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { Menu, MessageCircle, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  chatId: string | null;
  onNewChat: () => void;
  onToggleSidebar: () => void;
}

export function ChatInterface({
  chatId,
  onNewChat,
  onToggleSidebar,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [failedContent, setFailedContent] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setStreamingContent("");
      return;
    }
    loadMessages(chatId);
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const loadMessages = async (id: string) => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: id }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setMessages(data ?? []);
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleSend = async (content: string) => {
    if (!chatId || !content.trim() || isLoading) return;

    const tempId = "temp-" + crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "user", content: content.trim() },
    ]);
    setIsLoading(true);
    setStreamingContent("");
    setFailedContent(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          message: content.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let done = false;
      let accumulated = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          accumulated += decoder.decode(value, { stream: true });
          setStreamingContent(accumulated);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "assistant-" + crypto.randomUUID(),
          role: "assistant",
          content: accumulated,
        },
      ]);
    } catch {
      setFailedContent(content.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry Jani, kuch masla hogaya. Dobara try karo ya mughe batao.",
        },
      ]);
    } finally {
      setStreamingContent("");
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (failedContent) {
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("error-")));
      handleSend(failedContent);
    }
  };

  if (!chatId) {
    return (
      <div className="flex flex-1 flex-col">
        <button
          onClick={onToggleSidebar}
          className="self-start rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <MessageCircle className="h-16 w-16 text-primary/40" />
          <h2 className="text-2xl font-bold text-foreground">
            Kuch poochna hai Jani se?
          </h2>
          <p className="max-w-md text-center text-muted-foreground">
            Nayi chat shuru karo aur Karachi ke baare mein pocho jo poochna hai
          </p>
          <button
            onClick={onNewChat}
            className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Nayi Chat Shuru Karein
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-medium text-foreground">Jani</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {isFetching && (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {messages.some((m) => m.id.startsWith("error-")) && failedContent && (
            <div className="flex justify-center">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                <RefreshCw className="h-4 w-4" />
                Dobara karo
              </button>
            </div>
          )}
          {streamingContent && (
            <ChatMessage
              role="assistant"
              content={streamingContent}
              isStreaming
            />
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
