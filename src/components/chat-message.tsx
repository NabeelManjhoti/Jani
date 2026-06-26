"use client";

import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({
  role,
  content,
  isStreaming,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-2 list-disc pl-5 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 list-decimal pl-5 last:mb-0">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  {children}
                </a>
              ),
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              code: ({ children }) => (
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">{children}</code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary" />
        )}
      </div>
    </div>
  );
}
