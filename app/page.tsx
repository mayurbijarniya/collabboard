"use client";

import { useEffect, useRef, type PropsWithChildren } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Lock,
  CheckCircle,
  Slack,
  Mail,
  ArrowRight,
  Zap,
  MessageSquare,
  LayoutGrid,
  Share2,
  Github,
} from "lucide-react";
import { StickyNotesDemo } from "@/components/sticky-notes-demo";
import { StatsGrid } from "@/components/stats-grid";
import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Data ---
const features = [
  {
    icon: LayoutGrid,
    title: "Visual Boards",
    description: "Create boards with sticky notes, checklists, and more.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Share2,
    title: "Real-time Sync",
    description: "See changes instantly as your team collaborates.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Globe,
    title: "Public Sharing",
    description: "Share boards publicly with a secure link.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
];

const useCases = [
  {
    title: "Daily Standups",
    description: "Visualize what everyone is working on effortlessly.",
    icon: MessageSquare,
    bullets: ["Blockers visible", "Quick updates", "History tracking"],
  },
  {
    title: "Ops Checklists",
    description: "Standardize recurring team processes.",
    icon: CheckCircle,
    bullets: ["Onboarding steps", "Release QA", "Weekly reporting"],
  },
  {
    title: "Product Launch",
    description: "Coordinate cross-functional tasks seamlessly.",
    icon: Zap,
    bullets: ["Marketing assets", "Dev tasks", "Sales enablement"],
  },
];

const faqs = [
  {
    question: "Is CollabBoard free?",
    answer: "Yes! You can get started for free. No credit card required.",
  },
  {
    question: "How do public boards work?",
    answer: "Toggle any board to 'Public' in settings to generate a read-only link.",
  },
  {
    question: "Can I use it with my team?",
    answer: "Yes. Create an organization and invite team members via email or links.",
  },
  {
    question: "Is my data secure?",
    answer: "Your data is private by default with role-based access controls.",
  },
];

// FadeIn Section Component
function FadeIn({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-4");
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-4 transition-all duration-700"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>("a[href^='#']");
    const handleClick = (e: MouseEvent) => {
      const anchor = e.currentTarget as HTMLAnchorElement;
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href") || "");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    anchors.forEach((anchor) => anchor.addEventListener("click", handleClick));
    return () => anchors.forEach((anchor) => anchor.removeEventListener("click", handleClick));
  }, []);

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 relative overflow-hidden font-sans">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <LandingNavbar />

      <main className="pt-16 relative z-10">
        {/* --- Hero Section --- */}
        <section className="w-full py-16 md:py-20 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              {/* Hero Content */}
              <div className="flex flex-col justify-center space-y-5 lg:sticky lg:top-24 lg:pt-20">
                <FadeIn>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                    Transform ideas into <span className="text-blue-600 dark:text-blue-400">action together</span>
                  </h1>
                </FadeIn>

                <FadeIn delay={100}>
                  <p className="text-slate-600 dark:text-zinc-300 max-w-[480px] text-lg">
                    Your team&apos;s visual workspace. Brainstorm, plan, and execute projects with intuitive boards.
                  </p>
                </FadeIn>

                <FadeIn delay={200}>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/auth/signin">
                        Start free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100">
                      <Link href="/public/boards/demo">See demo</Link>
                    </Button>
                  </div>
                </FadeIn>
              </div>

              {/* Demo Section */}
              <FadeIn delay={200}>
                <div id="demo">
                  <StickyNotesDemo />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="w-full py-16 bg-slate-50/50 dark:bg-zinc-900/50 scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Everything you need
                </h2>
                <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
                  Powerful tools to help your team stay organized and productive.
                </p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {features.map((feature, i) => {
                const IconComponent = feature.icon;
                return (
                  <FadeIn key={feature.title} delay={i * 100}>
                    <Card className="h-full border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300">
                      <CardContent className="pt-6 pb-6 h-full flex flex-col">
                        <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 ring-1 ring-black/5 dark:ring-white/10 flex-shrink-0`}>
                          <IconComponent className={`h-7 w-7 ${feature.color}`} />
                        </div>
                        <CardTitle className="text-lg mb-2 text-slate-900 dark:text-white">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed flex-grow">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- Use Cases --- */}
        <section id="use-cases" className="w-full py-16 scroll-mt-16 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Built for any workflow
                </h2>
                <p className="text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
                  Adaptable templates for teams of all sizes and types.
                </p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {useCases.map((useCase, i) => {
                const IconComponent = useCase.icon;
                return (
                  <FadeIn key={useCase.title} delay={i * 100}>
                    <Card className="h-full border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                      <CardContent className="pt-6 pb-6 h-full flex flex-col">
                        <div className={`w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 ring-1 ring-black/5 dark:ring-white/10 flex-shrink-0`}>
                          <IconComponent className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-lg mb-2 text-slate-900 dark:text-white">
                          {useCase.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed flex-grow mb-4">
                          {useCase.description}
                        </CardDescription>
                        <div className="border-t border-slate-200 dark:border-zinc-700 pt-4 mt-auto">
                          <ul className="space-y-1">
                            {useCase.bullets.map((bullet, j) => (
                              <li key={j} className="flex items-center text-sm text-slate-700 dark:text-zinc-300">
                                <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- Integrations --- */}
        <section className="w-full py-16 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
              <FadeIn>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Integrates with your tools
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-400 mb-4">
                    Connect CollabBoard with the tools you already use.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Slack", icon: Slack, color: "text-[#4A154B]" },
                      { name: "GitHub", icon: Github, color: "text-gray-900 dark:text-white" },
                      { name: "Email", icon: Mail, color: "text-blue-600" },
                    ].map((integration) => {
                      const IconComponent = integration.icon;
                      return (
                        <div
                          key={integration.name}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700"
                        >
                          <IconComponent className={`w-4 h-4 ${integration.color}`} />
                          <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">
                            {integration.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                {/* Security Teaser */}
                <div className="p-5 bg-white dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        Secure by design
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-zinc-400">
                        Private organizations, role-based access
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Private by default",
                      "OAuth 2.0",
                      "Secure links",
                      "Audit logs",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-700 dark:text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-blue-500 mr-1.5" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* --- Open Source & Stats --- */}
        <section className="w-full pt-12 pb-8 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            {/* Live stats row */}
            <FadeIn>
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                <StatsGrid />
              </div>
            </FadeIn>

            {/* GitHub CTA */}
            <FadeIn delay={100}>
              <div className="flex justify-center">
                <a
                  href="https://github.com/mayurbijarniya/collabboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span className="font-medium">Star on GitHub</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section className="w-full pt-12 pb-16 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-slate-900 dark:text-white">
                Questions?
              </h2>
            </FadeIn>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <FadeIn key={faq.question} delay={i * 50}>
                  <AccordionItem value={`faq-${faq.question}`} className="bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 px-4">
                    <AccordionTrigger className="text-sm font-medium text-slate-900 dark:text-white hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-600 dark:text-zinc-400 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </FadeIn>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
