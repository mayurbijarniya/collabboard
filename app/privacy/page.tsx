"use client";

import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-500 mb-8">Last updated: January 4, 2026</p>

            <div className="space-y-6 text-slate-600 dark:text-zinc-300 text-sm leading-relaxed">
              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">1. Introduction</h2>
                <p>At CollabBoard, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our service.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">2. Information We Collect</h2>
                <p>We collect information you provide when creating an account (name, email), usage data (boards, notes, interactions), and technical data (IP address, browser type, device information).</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>To provide and maintain our services</li>
                  <li>To improve and personalize your experience</li>
                  <li>To communicate with you about updates</li>
                  <li>To detect and prevent fraud or abuse</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">4. Data Sharing</h2>
                <p>We do not sell your personal information. We may share your information with service providers who assist in operating our platform, law enforcement when required by law, and in connection with a merger or acquisition.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">5. Data Security</h2>
                <p>We implement industry-standard security measures including encryption of data in transit and at rest, regular security audits, and secure infrastructure practices. However, no method of transmission over the internet is 100% secure.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">6. Your Rights</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate or incomplete data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict processing of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">7. Cookies</h2>
                <p>We use cookies and similar tracking technologies. You can control cookies through your browser settings.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">8. Children</h2>
                <p>CollabBoard is not intended for use by children under 13. We do not knowingly collect personal information from children under 13.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">9. Changes</h2>
                <p>We may update this Privacy Policy from time to time. Continued use after changes constitutes acceptance of the new policy.</p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">10. Contact</h2>
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
