"use client";

import { Github, Mail } from "lucide-react";
import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 relative overflow-hidden font-sans">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <LandingNavbar variant="simple" />

      <main className="pt-20 relative z-10">
        <section className="w-full py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">About CollabBoard</h1>
            <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed mb-8">
              CollabBoard is an open-source project designed to help teams work together seamlessly.
              We believe in transparency, simplicity, and the power of community-driven development.
            </p>

            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Our Mission</h2>
                <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed">
                  We&apos;re building tools that make collaboration effortless. Our goal is to create a platform
                  where teams can focus on what matters most—their ideas. Everything we build is open source
                  because we believe in community-driven development and complete transparency.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 py-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">100%</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">Open Source</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">Free</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">To Use</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">Simple</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">No Bloat</div>
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Get in Touch</h2>
                <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed mb-4">
                  Have questions, suggestions, or just want to say hi? We&apos;d love to hear from you.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/mayurbijarniya/collabboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors text-sm"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href="mailto:mayurbijarniya7@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
