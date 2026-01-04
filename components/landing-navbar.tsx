"use client";

import Link from "next/link";
import Image from "next/image";

interface LandingNavbarProps {
  variant?: "full" | "simple";
}

export function LandingNavbar({ variant = "full" }: LandingNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-zinc-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image src="/logo/collabboard.svg" alt="CollabBoard" width={36} height={36} />
            <span className="text-xl font-bold tracking-tight">CollabBoard</span>
          </Link>

          {variant === "full" && (
            <div className="hidden md:flex items-center gap-8">
              <a href="/#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
              </a>
              <a href="/#use-cases" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors relative group">
                Use cases
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
              </a>
            </div>
          )}

          <div className="flex items-center gap-3">
            {variant === "full" && (
              <Link href="/auth/signin" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors hidden sm:block">
                Sign in
              </Link>
            )}
            <Link href="/auth/signin" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
