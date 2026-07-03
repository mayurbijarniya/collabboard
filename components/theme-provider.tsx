"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  const isMarketingPage =
    pathname === "/" || pathname === "/about" || pathname === "/privacy" || pathname === "/terms";

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="collabboard-theme"
      enableColorScheme={false}
      forcedTheme={isMarketingPage ? "light" : undefined}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
