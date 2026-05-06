import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Toaster from "@/components/ui/sonner";
import { UserProvider } from "./contexts/UserContext";

export const metadata: Metadata = {
  title: "CollabBoard",
  description: "Keep on top of your team's to-dos",
  manifest: "/logo/site.webmanifest",
  icons: {
    icon: "/logo/favicon.ico",
    shortcut: "/logo/favicon-96x96.png",
    apple: "/logo/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <UserProvider>
              {children}
              <Toaster richColors position="bottom-right" />
            </UserProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
