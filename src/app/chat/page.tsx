"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatInterface } from "@/components/chat-interface";
import type { Chat } from "@/components/chat-sidebar";

export default function ChatPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }
    if (status === "authenticated") {
      loadChats();
    }
  }, [status]);

  const loadChats = async () => {
    const res = await fetch("/api/chats");
    if (res.ok) {
      const { data } = await res.json();
      setChats(data ?? []);
    }
  };

  async function handleNewChat() {
    const res = await fetch("/api/chats", { method: "POST" });
    if (!res.ok) return;
    const { data } = await res.json();
    if (data) {
      setChats((prev) => [data, ...prev]);
      setActiveChat(data.id);
    }
  }

  async function handleDeleteChat(chatId: string) {
    const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
    if (!res.ok) return;
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChat === chatId) setActiveChat(null);
  }

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <>
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatInterface
        chatId={activeChat}
        onNewChat={handleNewChat}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </>
  );
}
