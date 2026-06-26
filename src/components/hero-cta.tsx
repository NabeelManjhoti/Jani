"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export function HeroCta() {
  const { data: session } = useSession();

  if (session) return null;

  return (
    <Link
      href="/auth"
      className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      <MessageCircle className="h-5 w-5" />
      Get Started
    </Link>
  );
}
