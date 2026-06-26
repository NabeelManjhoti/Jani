import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jani — Karachi ka Asli Dost",
  description:
    "Apna street-smart AI guide. Jani knows Karachi like the back of its hand — food, traffic, culture, and everything in between.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Jani — Karachi ka Asli Dost",
    description:
      "Your hyper-local AI guide to Karachi. Roman Urdu. Street smart. Always set.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var t = localStorage.getItem("theme");
                if (t === "light" || t === "dark") {
                  document.documentElement.className = t;
                } else {
                  document.documentElement.className = "dark";
                }
              } catch (e) {}
            })();
          `,
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
