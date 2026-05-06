"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

interface LandingNavbarProps {
  variant?: "full" | "simple";
}

export function LandingNavbar({ variant = "full" }: LandingNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { status } = useSession();
  const authCtaHref = status === "authenticated" ? "/dashboard" : "/auth/signin";

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-zinc-800/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-base shadow-sm">C</div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">CollabBoard</span>
          </Link>

          {/* Desktop nav links */}
          {variant === "full" && (
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {variant === "full" && (
              <Link
                href={authCtaHref}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Sign in
              </Link>
            )}
            <Link
              href={authCtaHref}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href={authCtaHref}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Get Started
            </Link>
            {variant === "full" && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {variant === "full" && isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 px-4 py-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => { setIsOpen(false); handleScroll(e, item.href); }}
              className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href={authCtaHref}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-600 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
