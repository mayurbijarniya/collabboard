import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/app/contexts/UserContext";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollabBoard - Real-Time Collaboration Platform",
  description: "Organize your team's tasks with real-time collaborative boards. Stay aligned, work together, achieve more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
