"use client";

import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-500 mb-8">Last updated: January 4, 2026</p>

            <div className="space-y-6 text-slate-600 dark:text-zinc-300 text-sm leading-relaxed">
              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">1. Acceptance</h2>
                <p>By accessing and using CollabBoard, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">2. Description</h2>
                <p>CollabBoard is an open-source collaborative whiteboard and note-taking platform providing tools for teams to create, share, and collaborate in real-time.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">3. User Accounts</h2>
                <p>You must provide accurate information, maintain password security, and accept responsibility for all activities under your account. Notify us immediately of any unauthorized use.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">4. Acceptable Use</h2>
                <p>You agree not to: use for illegal purposes, harass or harm users, attempt unauthorized access, upload malicious content, or send spam.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">5. Content Ownership</h2>
                <p>You retain ownership of all content you create. By using our service, you grant us a license to store and display your content as necessary to provide our services.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">6. Warranty Disclaimer</h2>
                <p>CollabBoard is provided &quot;as is&quot; without any warranties. We do not guarantee uninterrupted or error-free service.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">7. Limitation of Liability</h2>
                <p>CollabBoard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">8. Changes</h2>
                <p>We may modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">9. Contact</h2>
                <p>Questions? Email us at <a href="mailto:mayurbijarniya7@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">mayurbijarniya7@gmail.com</a></p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
