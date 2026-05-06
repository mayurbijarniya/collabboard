"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">C</div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">CollabBoard</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-4">
              Visual workspace for teams. Plan, organize, and ship together.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/mayurbijarniya/collabboard" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/mayurbijarniya" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="/#features" className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/" className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Home</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">About us</Link></li>
              <li><a href="mailto:mayurbijarniya7@gmail.com" className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} CollabBoard. Built with care.
          </p>
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            Open source on <a href="https://github.com/mayurbijarniya/collabboard" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors underline">GitHub</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
