"use client";

import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo/collabboard.svg" alt="CollabBoard" width={20} height={20} />
            <span className="font-bold text-slate-900 dark:text-white text-sm">CollabBoard</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-zinc-400">
            <Link href="/about" className="hover:text-slate-900 dark:hover:text-white">About</Link>
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms</Link>
            <a href="https://github.com/mayurbijarniya/collabboard" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
