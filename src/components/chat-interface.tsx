"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { Menu, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: id }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setMessages(data ?? []);
    }
  };

  const handleSend = async (content: string) => {
    if (!chatId || !content.trim() || isLoading) return;

    const tempId = "temp-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "user", content: content.trim() },
    ]);
    setIsLoading(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          message: content.trim(),
          userId: session?.user?.id,
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
          id: "assistant-" + Date.now(),
          role: "assistant",
          content: accumulated,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
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
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
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
