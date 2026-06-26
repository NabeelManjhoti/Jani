"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  }, [status, router]);

  const loadChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const { data } = await res.json();
        setChats(data ?? []);
      } else {
        toast.error("Chats load nahi ho sakay");
      }
    } catch {
      toast.error("Network error — chats load nahi ho sakay");
    }
  };

  async function handleNewChat() {
    try {
      const res = await fetch("/api/chats", { method: "POST" });
      if (!res.ok) {
        toast.error("Nayi chat nahi ban sakti");
        return;
      }
      const { data } = await res.json();
      if (data) {
        setChats((prev) => [data, ...prev]);
        setActiveChat(data.id);
      }
    } catch {
      toast.error("Network error — nayi chat nahi ban sakti");
    }
  }

  async function handleDeleteChat(chatId: string) {
    try {
      const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Chat delete nahi ho sakti");
        return;
      }
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChat === chatId) setActiveChat(null);
    } catch {
      toast.error("Network error — chat delete nahi ho sakti");
    }
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
