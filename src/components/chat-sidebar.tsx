"use client";

import { Plus, Trash2, MessageCircle, X } from "lucide-react";

export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 mt-16 flex w-72 flex-col border-r border-border bg-background transition-transform duration-200 lg:static lg:mt-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">Chats</h2>
          <button
            onClick={onToggle}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-border bg-accent/50 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>

        <div className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {chats.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              Koi chat nahi hai. Nayi shuru karo!
            </p>
          )}
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                activeChat === chat.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex min-w-0 items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
