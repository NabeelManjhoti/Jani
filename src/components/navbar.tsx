"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, MessageCircle, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Jani
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href="/chat"
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
