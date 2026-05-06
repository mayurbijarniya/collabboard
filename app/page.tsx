"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, Bell, Activity, Users,
  Shield, Globe, Lock, Eye, CheckCircle, Home, FileText,
  LayoutGrid, Mail, Calendar, Zap, PartyPopper, Star,
  Rocket, Trophy, Image as ImageIcon, Ban,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";

// DECORATIVE SVG COMPONENTS
const ScribbleUnderline = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
    <path d="M2 10 Q30 2 60 10 Q90 18 118 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
  </svg>
);
const ScribbleUnderlineThick = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 140 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
    <path d="M2 12 Q35 2 70 10 Q105 18 138 6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
  </svg>
);
const CircleScribble = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
    <ellipse cx="70" cy="25" rx="65" ry="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);
const StarSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M256 24L316 188H492L348 292L396 488L256 380L116 488L164 292L20 188H196L256 24Z" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);
const CrownSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 68 L90 68 L82 22 L50 44 L18 22 Z" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="18" cy="16" r="5" fill="currentColor"/>
    <circle cx="50" cy="38" r="5" fill="currentColor"/>
    <circle cx="82" cy="16" r="5" fill="currentColor"/>
  </svg>
);
const SparkBurst = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="14" y1="1" x2="14" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="14" y1="21" x2="14" y2="27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="1" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="21" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const TealSquiggle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 0 Q38 28 20 56 Q2 84 20 112 Q38 140 20 168 Q12 176 4 180" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
);
const Arrow1 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 8 Q60 15 72 72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M58 62 L72 72 L76 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Arrow2 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 68" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M72 8 Q20 12 8 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M20 43 L8 52 L3 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CurvedArrowDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 8 Q40 8 48 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M38 30 L48 35 L52 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PaperAirplane = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 24L44 4L28 44L22 26L4 24Z" fill="currentColor"/>
    <path d="M22 26L44 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const SlackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 2447.6 2452.5" className={className}>
    <g clipRule="evenodd" fillRule="evenodd">
      <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0" />
      <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d" />
      <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e" />
      <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a" />
    </g>
  </svg>
);

function FadeIn({ children, delay = 0, className = "", direction = "up" }: {
  children: React.ReactNode; delay?: number; className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const initial: Record<string, number> =
    direction === "up" ? { opacity: 0, y: 24 } :
    direction === "down" ? { opacity: 0, y: -24 } :
    direction === "left" ? { opacity: 0, x: -24 } :
    direction === "right" ? { opacity: 0, x: 24 } :
    { opacity: 0 };
  return (
    <motion.div ref={ref} initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}>
      {children}
    </motion.div>
  );
}

function Float({ children, delay = 0, y = 10, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  return (
    <motion.div animate={{ y: [0, -y, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

function AvatarStack({ imgs, extra, size = "md" }: { imgs: number[]; extra?: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {imgs.map((i) => (
          <img key={i} src={`/avatar/avatar${i}.png`} alt="" className={`${s} rounded-full border-2 border-white dark:border-zinc-800 object-cover`} />
        ))}
      </div>
      {extra && (
        <div className={`ml-1.5 ${size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"} bg-teal-100 text-teal-700 font-bold rounded-full`}>
          {extra}
        </div>
      )}
    </div>
  );
}

function MockCard({ children, className = "", borderColor = "border-t-teal-400" }: { children: React.ReactNode; className?: string; borderColor?: string }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-100 dark:border-zinc-800 ${borderColor} border-t-[3px] p-4 ${className}`}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { status } = useSession();
  const authCtaHref = status === "authenticated" ? "/dashboard" : "/auth/signin";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `.font-hand { font-family: 'Caveat', cursive !important; }` }} />
      <LandingNavbar />

      <main>
        {/* SECTION 1 — HERO */}
        <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f8fafc 0%,#ffffff 50%,#f0fdfa 100%)" }}>

          <div className="pointer-events-none absolute bottom-0 right-0 z-[2] w-[68%] h-[65%] hidden lg:block">
            <svg viewBox="0 0 680 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMaxYMax meet">
              <defs>
                <filter id="paintRoughness" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
                <clipPath id="heroPaintBlob">
                  <path d="M0 320 Q55 278 130 248 Q245 208 390 170 Q535 132 630 108 Q656 102 680 96 L680 480 L0 480 Z"/>
                </clipPath>
              </defs>
              <g clipPath="url(#heroPaintBlob)" filter="url(#paintRoughness)">
                <rect width="680" height="480" fill="#1E40AF"/>
                {/* Main paint layers with brush stroke texture */}
                <path d="M-20 355 Q160 315 340 282 Q520 250 680 220 L680 305 Q520 332 340 362 Q160 392 -20 425 Z" fill="#2563EB" opacity="0.9"/>
                <path d="M-20 390 Q170 355 350 325 Q530 295 680 270 L680 480 L-20 480 Z" fill="#1D4ED8" opacity="0.8"/>
                {/* Horizontal brush streaks */}
                <path d="M20 340 Q200 310 380 285 Q560 260 660 245" stroke="#60A5FA" strokeWidth="18" strokeLinecap="round" opacity="0.35" fill="none"/>
                <path d="M0 365 Q180 335 360 310 Q540 285 640 270" stroke="#93C5FD" strokeWidth="12" strokeLinecap="round" opacity="0.25" fill="none"/>
                <path d="M40 380 Q220 355 400 332 Q580 308 680 295" stroke="#3B82F6" strokeWidth="22" strokeLinecap="round" opacity="0.4" fill="none"/>
                <path d="M10 400 Q190 375 370 352 Q550 328 650 315" stroke="white" strokeWidth="8" strokeLinecap="round" opacity="0.15" fill="none"/>
                <path d="M60 420 Q240 398 420 375 Q600 352 680 340" stroke="#60A5FA" strokeWidth="14" strokeLinecap="round" opacity="0.3" fill="none"/>
                <path d="M30 445 Q210 422 390 400 Q570 378 660 365" stroke="#1E40AF" strokeWidth="20" strokeLinecap="round" opacity="0.5" fill="none"/>
                {/* White highlight streaks */}
                <path d="M80 350 Q260 325 440 302 Q620 280 680 268" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.2" fill="none"/>
                <path d="M120 375 Q300 352 480 330 Q660 308 680 305" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.12" fill="none"/>
                {/* Paint splatter dots */}
                <circle cx="620" cy="390" r="5" fill="white" opacity="0.3"/>
                <circle cx="660" cy="360" r="3" fill="#60A5FA" opacity="0.5"/>
                <circle cx="580" cy="430" r="4" fill="#3B82F6" opacity="0.4"/>
                <circle cx="640" cy="410" r="6" fill="white" opacity="0.2"/>
                <circle cx="540" cy="450" r="3" fill="#60A5FA" opacity="0.35"/>
                <circle cx="600" cy="440" r="4" fill="#1E40AF" opacity="0.5"/>
                <circle cx="520" cy="400" r="2.5" fill="white" opacity="0.25"/>
                <circle cx="680" cy="380" r="4" fill="#93C5FD" opacity="0.3"/>
              </g>
            </svg>
          </div>

          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-1/2 h-2/3 bg-teal-100/30 blur-[90px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-2/5 h-1/2 bg-blue-100/20 blur-[70px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="hidden xl:flex absolute -top-1 left-4 flex-col items-start z-20 select-none pointer-events-none">
              <div className="relative inline-block px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold -rotate-2 border border-teal-200 shadow-sm">
                <span className="font-hand text-lg">Teams work better together</span>
                <PartyPopper className="w-4 h-4 ml-1 inline-block" />
                <ScribbleUnderline className="absolute -bottom-1 left-2 w-[90%] h-2 text-teal-400" />
              </div>
              <CurvedArrowDown className="w-10 h-10 text-teal-400 mt-1 ml-10 rotate-[-15deg]" />
            </div>

            <div className="hidden xl:block absolute top-6 right-[18%] z-20 select-none pointer-events-none text-right">
              <p className="font-hand text-xl font-bold text-slate-700 dark:text-zinc-300 rotate-3 leading-tight">Brainstorm. Plan. Execute.</p>
              <Arrow2 className="w-20 h-14 text-slate-400 mt-1 ml-auto block" />
            </div>

            <StarSVG className="hidden md:block absolute top-24 left-[42%] w-10 h-10 text-amber-400 rotate-12 z-20 pointer-events-none" />
            <StarSVG className="hidden lg:block absolute bottom-[15%] left-[48%] w-5 h-5 text-slate-700 dark:text-white opacity-40 z-20 pointer-events-none -rotate-6" />
            <SparkBurst className="hidden lg:block absolute top-[35%] left-[3%] w-7 h-7 text-teal-400 z-20 pointer-events-none" />
            <div className="hidden lg:block absolute top-[16%] right-[12%] w-2 h-2 bg-teal-500 rounded-full z-20 pointer-events-none" />
            <div className="hidden lg:block absolute top-[12%] right-[9%] w-1.5 h-1.5 bg-blue-400 rounded-full z-20 pointer-events-none" />
            <div className="hidden lg:block absolute bottom-[25%] left-[50%] w-2 h-2 bg-amber-400 rounded-full z-20 pointer-events-none" />
            <div className="hidden lg:block absolute top-[55%] right-[5%] w-1.5 h-1.5 bg-blue-300 rounded-full z-20 pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-6 sm:pt-10 lg:min-h-[82vh]">
              <div className="relative z-20 max-w-2xl">
                <FadeIn>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.04] mb-5 text-slate-900 dark:text-white">
                    Ideas stick.<br />
                    <span className="text-blue-600 relative inline-block">
                      Teams move.
                      <ScribbleUnderlineThick className="absolute -bottom-2 left-0 w-full h-3 text-blue-400" />
                    </span>
                  </h1>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-lg">
                    CollabBoard is your visual workspace for sticky notes, checklists, and real teamwork.
                    Plan, organize, and get things done, together.
                  </p>
                </FadeIn>
                <FadeIn delay={0.2} className="flex flex-wrap gap-3 sm:gap-4">
                  <Button asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
                    <Link href={authCtaHref}>Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="h-12 sm:h-14 px-5 sm:px-7 text-base sm:text-lg rounded-xl border-slate-300 dark:border-zinc-600 bg-white/80 backdrop-blur-sm">
                    <Link href="https://collabboard.mayur.app/public/boards/demo" target="_blank" rel="noopener noreferrer">Open Demo <ArrowUpRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </FadeIn>
                <FadeIn delay={0.3} className="mt-8">
                  <div className="flex items-center gap-4">
                    <AvatarStack imgs={[1, 2, 3, 4]} size="md" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Join our growing community</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">of creators and teams</p>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.4} className="mt-6 hidden lg:block">
                  <div className="flex items-start gap-2">
                    <p className="font-hand text-xl text-slate-700 dark:text-zinc-300 rotate-[-2deg]">
                      Built for<br />modern teams
                    </p>
                    <Arrow1 className="w-12 h-23 text-slate-400 rotate-[0deg] " />
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={0.25} direction="none" className="relative hidden lg:block">
                {/* Logo cube - bottom right, no float animation */}
                <div className="absolute right-2 -bottom-8 z-40">
                  <div className="w-[100px] h-[100px] bg-blue-600 rounded-[22px] shadow-2xl flex items-center justify-center text-white text-4xl font-black rotate-6 select-none" style={{boxShadow:"0 12px 40px 0 rgba(30,64,175,0.5), inset 0 2px 0 rgba(255,255,255,0.2)"}}>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">C</div>
                  </div>
                </div>

                {/* "Let's do this!" bubble - right side of mockup */}
                <div className="absolute -right-16 top-[32%] z-50 rotate-6 select-none pointer-events-none">
                  <div className="relative bg-slate-900 dark:bg-zinc-800 text-white px-4 py-2.5 rounded-2xl shadow-xl font-hand text-lg font-bold flex items-center gap-2 whitespace-nowrap">
                    Let&apos;s do this! <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-900 dark:bg-zinc-800 rotate-45 -translate-y-1/2" />
                  </div>
                </div>

                {/* Squiggle near Website update card */}
                <TealSquiggle className="absolute bottom-[18%] left-[28%] w-6 h-24 text-teal-500 z-30 pointer-events-none opacity-70 rotate-12" />

                {/* Browser window */}
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl shadow-2xl overflow-hidden -rotate-2 hover:rotate-0 transition-all duration-500 relative">
                  <div className="h-11 bg-slate-100/70 dark:bg-zinc-800/70 border-b border-slate-200 dark:border-zinc-700 flex items-center px-3 gap-2">
                    <div className="flex gap-1.5 flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-center justify-center flex-1 mx-2 bg-white dark:bg-zinc-950 px-4 py-1 rounded-md text-xs text-slate-400 font-medium shadow-sm text-center gap-1">
                      Product Launch <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                    <div className="flex -space-x-1.5 flex-shrink-0">
                      {[1,2,3,4].map(i => <img key={i} src={`/avatar/avatar${i}.png`} alt="" className="w-6 h-6 rounded-full border-2 border-white" />)}
                    </div>
                    <div className="ml-1.5 px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg flex-shrink-0">Share</div>
                  </div>
                  <div className="p-5 flex h-[440px]">
                    <div className="w-10 border-r border-slate-100 dark:border-zinc-800 flex flex-col items-center gap-5 py-3 mr-3 text-slate-300">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">C</div>
                      <Home className="w-4 h-4" />
                      <LayoutGrid className="w-4 h-4" />
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <Bell className="w-4 h-4" />
                      <div className="mt-auto w-6 h-6 rounded-full overflow-hidden relative">
                        <img src="/avatar/avatar1.png" alt="" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      {/* Col 1 */}
                      <div className="flex flex-col gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-2xl shadow-sm border border-purple-200/50 relative">
                          <div className="absolute -top-1.5 right-3 w-4 h-4 bg-purple-500 rounded-full" />
                          <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2.5 text-sm">Launch ideas</h4>
                          <div className="space-y-1.5">
                            {[{c:true,t:"Target audience"},{c:true,t:"Value proposition"},{c:false,t:"Messaging"}].map((r,i)=>[
                              <div key={i} className={`flex items-center gap-1.5 text-xs text-purple-800 dark:text-purple-300 ${!r.c?"opacity-55":""}`}>
                                {r.c ? <CheckCircle className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" /> : <div className="w-3.5 h-3.5 border border-purple-400 rounded flex-shrink-0" />}
                                {r.t}
                              </div>
                            ])}
                          </div>
                          <div className="flex items-center gap-1.5 mt-3">
                            <img src="/avatar/avatar1.png" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                            <span className="text-[10px] text-purple-700 font-medium">Emma</span>
                          </div>
                        </div>
                        <div className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-2xl shadow-sm border border-pink-200/50">
                          <h4 className="font-bold text-pink-900 dark:text-pink-200 mb-2.5 text-sm">Website update</h4>
                          <div className="space-y-1.5">
                            {[{c:false,t:"Landing page"},{c:true,t:"Features page"},{c:false,t:"Blog post"}].map((r,i)=>[
                              <div key={i} className={`flex items-center gap-1.5 text-xs text-pink-800 dark:text-pink-300 ${!r.c?"opacity-55":""}`}>
                                {r.c ? <CheckCircle className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" /> : <div className="w-3.5 h-3.5 border border-pink-400 rounded flex-shrink-0" />}
                                {r.t}
                              </div>
                            ])}
                          </div>
                          <div className="flex items-center gap-1.5 mt-3">
                            <img src="/avatar/avatar3.png" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                            <span className="text-[10px] text-pink-700 font-medium">Noah</span>
                          </div>
                        </div>
                      </div>
                      {/* Col 2 */}
                      <div className="flex flex-col gap-3 mt-4">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-2xl shadow-sm border border-yellow-200/50">
                          <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2.5 text-sm">Design roadmap</h4>
                          <div className="space-y-1.5">
                            {[{c:false,t:"Wireframes"},{c:false,t:"Brand assets"},{c:true,t:"User feedback"}].map((r,i)=>[
                              <div key={i} className={`flex items-center gap-1.5 text-xs text-yellow-800 dark:text-yellow-300 ${!r.c?"opacity-55":""}`}>
                                {r.c ? <CheckCircle className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" /> : <div className="w-3.5 h-3.5 border border-yellow-500 rounded flex-shrink-0" />}
                                {r.t}
                              </div>
                            ])}
                          </div>
                          <div className="flex items-center gap-1.5 mt-3">
                            <img src="/avatar/avatar4.png" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                            <span className="text-[10px] text-yellow-800 font-medium">Liam</span>
                          </div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl shadow-sm border border-green-200/50">
                          <h4 className="font-bold text-green-900 dark:text-green-200 mb-2.5 text-sm">Release checklist</h4>
                          <div className="space-y-1.5">
                            {[{c:false,t:"QA testing"},{c:false,t:"Bug fixes"},{c:true,t:"Final review"},{c:false,t:"Go live"}].map((r,i)=>[
                              <div key={i} className={`flex items-center gap-1.5 text-xs text-green-800 dark:text-green-300 ${!r.c?"opacity-55":""}`}>
                                {r.c ? <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" /> : <div className="w-3.5 h-3.5 border border-green-500 rounded flex-shrink-0" />}
                                {r.t} {r.t==="Go live" && <Rocket className="w-3 h-3" />}
                              </div>
                            ])}
                          </div>
                          <div className="flex items-center gap-1.5 mt-3">
                            <img src="/avatar/avatar5.png" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                            <span className="text-[10px] text-green-800 font-medium">Ava</span>
                          </div>
                        </div>
                      </div>
                      {/* Col 3 */}
                      <div className="flex flex-col gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl shadow-sm border border-blue-200/50">
                          <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2.5 text-sm">Marketing plan</h4>
                          <div className="space-y-1.5">
                            {[{c:true,t:"Social campaign"},{c:false,t:"Email outreach"},{c:false,t:"Partnerships"}].map((r,i)=>[
                              <div key={i} className={`flex items-center gap-1.5 text-xs text-blue-800 dark:text-blue-300 ${!r.c?"opacity-55":""}`}>
                                {r.c ? <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> : <div className="w-3.5 h-3.5 border border-blue-400 rounded flex-shrink-0" />}
                                {r.t}
                              </div>
                            ])}
                          </div>
                          <div className="flex items-center gap-1.5 mt-3">
                            <img src="/avatar/avatar6.png" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                            <span className="text-[10px] text-blue-700 font-medium">Olivia</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Update card - positioned below the browser window */}
                <div className="absolute -bottom-4 left-[15%] z-50 select-none">
                  <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-700 rotate-1 flex items-center gap-3 w-60">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">Team update</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">We&apos;re on track for an amazing launch!</p>
                    </div>
                  </div>
                </div>

                {/* Spark lines near logo */}
                <div className="absolute -right-2 bottom-[15%] z-50 pointer-events-none">
                  <SparkBurst className="w-8 h-8 text-slate-800 dark:text-white" />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SECTION 2 — Work your way */}
        <section id="features" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-white dark:bg-zinc-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="hidden lg:flex absolute top-10 right-[18%] flex-col items-center z-10 select-none pointer-events-none">
            <p className="font-hand text-lg font-semibold text-slate-700 dark:text-zinc-300 -rotate-2 text-center">
              Organize your projects{" "}
              <span className="relative inline-block px-2">
                visually
                <CircleScribble className="absolute -inset-x-2 -inset-y-1 text-teal-600 w-[calc(100%+16px)] h-[200%]" />
              </span>
            </p>
            <Arrow2 className="w-16 h-10 text-slate-400 mt-1 rotate-[25deg]" />
          </div>
          <StarSVG className="hidden lg:block absolute top-16 left-[44%] w-6 h-6 text-slate-800 dark:text-white opacity-40 stroke-2 z-10 pointer-events-none" />

          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
            <div>
              <FadeIn>
                <div className="inline-block px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold tracking-widest rounded-full mb-5 -rotate-1 relative border border-teal-200">
                  SIMPLE, FLEXIBLE, POWERFUL
                  <ScribbleUnderline className="absolute -bottom-2 left-0 w-full h-2.5 text-teal-400" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black leading-[1.08] mb-5 text-slate-900 dark:text-white">
                  Work your way.<br />
                  Visual. <span className="text-blue-600">Simple.</span><br />
                  <span className="text-teal-600">Flexible.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 mb-8 max-w-md">
                  From big ideas to daily tasks. Capture everything with sticky notes and checklists that fit the way your team works.
                </p>
              </FadeIn>
              <FadeIn delay={0.2} className="space-y-6 max-w-md">
                {[
                  { title: "Sticky notes for ideas & tasks", desc: "Capture anything in a snap.", color: "bg-teal-100 text-teal-600", icon: FileText },
                  { title: "Checklists for clear action", desc: "Break it down. Get it done.", color: "bg-blue-100 text-blue-600", icon: CheckCircle },
                  { title: "Boards for every project", desc: "Organize, focus, ship faster.", color: "bg-emerald-100 text-emerald-600", icon: Users },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </FadeIn>
              <FadeIn delay={0.3} className="mt-8 inline-block">
                <div className="px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl rotate-2 relative shadow-md max-w-xs">
                  <Star className="absolute -top-3 -left-3 w-6 h-6 text-amber-500 fill-amber-400" />
                  <p className="text-amber-900 dark:text-amber-200 font-medium text-sm">
                    Built for teams that move fast and{" "}
                    <span className="font-bold text-blue-700 dark:text-blue-400 relative inline-block">
                      think big.
                      <ScribbleUnderlineThick className="absolute -bottom-1 left-0 w-full h-2.5 text-blue-400" />
                    </span>
                  </p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} direction="right" className="relative hidden md:block">
              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/50 dark:border-zinc-800/50 shadow-2xl p-6">
                <div className="flex items-center justify-end gap-2 mb-6">
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-zinc-700">
                    <div className="flex -space-x-2">
                      {[5,6,7,8].map(i => <img key={i} src={`/avatar/avatar${i}.png`} alt="" className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-800" />)}
                    </div>
                    <span className="text-xs font-bold text-teal-600 border border-teal-200 bg-teal-50 px-2.5 py-0.5 rounded-full">+ Invite</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <MockCard borderColor="border-t-blue-400" className="-rotate-1 -mt-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Research</h4>
                    <div className="space-y-2">
                      {[{c:true,t:"Market analysis"},{c:true,t:"User interviews"},{c:false,t:"Competitor scan"}].map((r,i)=>[
                        <div key={i} className={`flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 ${!r.c?"opacity-55":""}`}>
                          {r.c ? <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0"/> : <div className="w-4 h-4 border-2 border-slate-300 rounded flex-shrink-0"/>}
                          {r.t}
                        </div>
                      ])}
                    </div>
                    <img src="/avatar/avatar3.png" className="w-7 h-7 rounded-full mt-4 border-2 border-white" alt="" />
                  </MockCard>
                  <MockCard borderColor="border-t-teal-400" className="rotate-1 mt-3">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Design</h4>
                    <div className="space-y-2">
                      {[{c:true,t:"Wireframes"},{c:true,t:"UI exploration"},{c:false,t:"Feedback"}].map((r,i)=>[
                        <div key={i} className={`flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 ${!r.c?"opacity-55":""}`}>
                          {r.c ? <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0"/> : <div className="w-4 h-4 border-2 border-slate-300 rounded flex-shrink-0"/>}
                          {r.t}
                        </div>
                      ])}
                    </div>
                  </MockCard>
                  <MockCard borderColor="border-t-amber-400" className="-rotate-1 -mt-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Launch</h4>
                    <div className="space-y-2">
                      {[{c:true,t:"Beta testing"},{c:true,t:"User feedback"},{c:false,t:"Improve"}].map((r,i)=>[
                        <div key={i} className={`flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 ${!r.c?"opacity-55":""}`}>
                          {r.c ? <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0"/> : <div className="w-4 h-4 border-2 border-slate-300 rounded flex-shrink-0"/>}
                          {r.t}
                        </div>
                      ])}
                    </div>
                    <img src="/avatar/avatar6.png" className="w-7 h-7 rounded-full mt-4 border-2 border-white" alt="" />
                  </MockCard>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <MockCard borderColor="border-t-emerald-400" className="rotate-1 mt-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Content Plan</h4>
                    <div className="space-y-2">
                      {[{c:true,t:"Blog post"},{c:false,t:"Social posts"},{c:false,t:"Newsletter"}].map((r,i)=>[
                        <div key={i} className={`flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 ${!r.c?"opacity-55":""}`}>
                          {r.c ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0"/> : <div className="w-4 h-4 border-2 border-slate-300 rounded flex-shrink-0"/>}
                          {r.t}
                        </div>
                      ])}
                    </div>
                    <img src="/avatar/avatar5.png" className="w-7 h-7 rounded-full mt-4 border-2 border-white" alt="" />
                  </MockCard>
                  <MockCard borderColor="border-t-teal-400" className="-rotate-1 mt-5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Product Roadmap</h4>
                    <div className="space-y-2">
                      {[{c:true,t:"New integrations"},{c:false,t:"Mobile app"},{c:false,t:"AI assistant"}].map((r,i)=>[
                        <div key={i} className={`flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 ${!r.c?"opacity-55":""}`}>
                          {r.c ? <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0"/> : <div className="w-4 h-4 border-2 border-slate-300 rounded flex-shrink-0"/>}
                          {r.t}
                        </div>
                      ])}
                    </div>
                    <img src="/avatar/avatar4.png" className="w-7 h-7 rounded-full mt-4 border-2 border-white" alt="" />
                  </MockCard>
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-zinc-700 mt-2">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Team Progress</h4>
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-slate-100 dark:text-zinc-700" strokeWidth="14" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-teal-500" strokeWidth="14" fill="none" strokeDasharray="251.2" strokeDashoffset="60" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-slate-900 dark:text-white">76%</span>
                        <span className="text-[9px] text-slate-500">Completed</span>
                      </div>
                    </div>
                    <div className="space-y-2.5 text-xs font-medium px-1">
                      {[{c:"bg-teal-500",l:"Done",v:"76%"},{c:"bg-blue-300",l:"In Progress",v:"18%"},{c:"bg-slate-200",l:"To Do",v:"6%"}].map(r=>[
                        <div key={r.l} className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${r.c}`}/>{r.l}</div>
                          <span className="text-slate-500">{r.v}</span>
                        </div>
                      ])}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-700 px-5 py-2.5 flex items-center gap-5 w-fit mx-auto">
                  <span className="text-slate-400 font-serif text-xl font-bold">T</span>
                  <CheckCircle className="w-4 h-4 text-slate-400" />
                  <LayoutGrid className="w-4 h-4 text-slate-400" />
                  <div className="w-4 h-4 rounded-full border-2 border-teal-500" />
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                </div>

                <div className="mt-3 text-center select-none pointer-events-none">
                  <Arrow2 className="w-8 h-6 text-slate-400 mx-auto" />
                  <p className="font-hand text-base text-slate-600 dark:text-zinc-400 rotate-3">Everything at a glance.</p>
                </div>
              </div>
            </FadeIn>

            <div className="md:hidden grid grid-cols-2 gap-3 mt-4">
              {[
                {bg:"bg-teal-50",title:"Research",color:"text-teal-900"},
                {bg:"bg-blue-50",title:"Design",color:"text-blue-900"},
                {bg:"bg-emerald-50",title:"Content Plan",color:"text-emerald-900"},
                {bg:"bg-amber-50",title:"Roadmap",color:"text-amber-900"},
              ].map((c) => (
                <div key={c.title} className={`${c.bg} p-4 rounded-2xl shadow-sm border border-slate-100`}>
                  <h4 className={`font-bold ${c.color} text-sm mb-2`}>{c.title}</h4>
                  <div className="space-y-1.5">
                    {[1,2,3].map(i=>(
                      <div key={i} className="flex items-center gap-1.5">
                        {i<3 ? <CheckCircle className="w-3.5 h-3.5 text-current opacity-60 flex-shrink-0"/> : <div className="w-3.5 h-3.5 border border-current opacity-40 rounded flex-shrink-0"/>}
                        <div className="h-2 bg-current opacity-20 rounded flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — Open it up */}
        <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-slate-50/70 dark:bg-zinc-900/50 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative z-20">
              <FadeIn>
                <div className="inline-block relative mb-5">
                  <span className="relative z-10 px-4 py-1.5 font-semibold text-slate-800 dark:text-zinc-200 text-sm">Share without limits</span>
                  <div className="absolute inset-0 bg-teal-50 dark:bg-teal-900/20 rounded-full rotate-1 -z-10 border border-teal-200" />
                  <ScribbleUnderline className="absolute -bottom-1 right-2 w-2/3 h-2 text-teal-400" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black leading-[1.08] mb-5 text-slate-900 dark:text-white">
                  Open it up.<br />
                  <span className="text-blue-600">Keep it clear.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 mb-8 max-w-md">
                  Share boards with anyone. No sign-ups, no friction, just a clean, read-only view that keeps everyone in the loop.
                </p>
              </FadeIn>
              <FadeIn delay={0.2} className="space-y-6 max-w-md">
                {[
                  { title: "Public read-only boards", desc: "Share progress with clients, partners, or the world.", color: "bg-blue-100 text-blue-600", icon: Globe },
                  { title: "No login required", desc: "Anyone with the link can view.", color: "bg-teal-100 text-teal-600", icon: Lock },
                  { title: "Always up to date", desc: "Real-time updates, always.", color: "bg-emerald-100 text-emerald-600", icon: Eye },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </FadeIn>
              <FadeIn delay={0.3} className="mt-8">
                <div className="inline-flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <p className="text-sm text-slate-800 dark:text-zinc-200 font-medium">Your privacy. Your control.<br /><span className="text-slate-500 text-xs">You decide what&apos;s public.</span></p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} direction="right" className="relative hidden md:block">
              <div className="absolute -top-6 right-14 z-20 select-none pointer-events-none text-right">
                <p className="font-hand text-lg font-semibold text-slate-700 dark:text-zinc-300 -rotate-2 leading-tight">
                  <span className="relative inline-block">One link.<ScribbleUnderline className="absolute -bottom-1 left-0 w-full h-2 text-teal-500" /></span><br />Everyone aligned.
                </p>
                <Arrow2 className="w-12 h-8 text-slate-400 mt-1 ml-auto" />
              </div>
              <CrownSVG className="absolute -top-1 right-1 w-8 h-8 text-amber-400 rotate-12 opacity-60 z-20 pointer-events-none" />

              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden mt-8">
                <div className="bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 px-4 py-2.5 flex items-center gap-3">
                  <div className="flex gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-zinc-600" />
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-zinc-600" />
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-zinc-600" />
                  </div>
                  <div className="flex-1 bg-white dark:bg-zinc-900 rounded-lg py-1 px-3 text-xs text-slate-500 flex items-center justify-center gap-1.5 border border-slate-200 dark:border-zinc-700">
                    <Lock className="w-3 h-3 flex-shrink-0" /> collabboard.com/public/product-roadmap
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                    <Globe className="w-3 h-3" /> Public Board
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      Product Roadmap <StarSVG className="w-4 h-4 text-slate-400" />
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">See what we&apos;re building, next.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Now", labelColor: "bg-teal-100 text-teal-700", barColor: "bg-teal-500", barBg: "bg-teal-200", cardBg: "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800/50", items: ["Mobile app","Performance improvements","Analytics dashboard"] },
                      { label: "Next", labelColor: "bg-amber-100 text-amber-700", barColor: "bg-amber-500", barBg: "bg-amber-200", cardBg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50", items: ["AI assistant","Integrations","Custom views"] },
                      { label: "Later", labelColor: "bg-emerald-100 text-emerald-700", barColor: "bg-emerald-500", barBg: "bg-emerald-200", cardBg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50", items: ["Advanced permissions","Team workload insights","API v2"] },
                    ].map((col, ci) => (
                      <div key={ci} className="space-y-2">
                        <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${col.labelColor}`}>{col.label}</div>
                        {col.items.map((item, ii) => (
                          <div key={ii} className={`p-3 rounded-xl border shadow-sm ${col.cardBg}`}>
                            <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 mb-2.5">{item}</p>
                            <div className="flex items-center gap-2">
                              <img src={`/avatar/avatar${((ci*3+ii)%8)+1}.png`} className="w-5 h-5 rounded-full flex-shrink-0" alt="" />
                              <div className={`flex-1 h-1.5 ${col.barBg} rounded-full overflow-hidden`}>
                                <div className={`h-full ${col.barColor} rounded-full`} style={{ width: `${[70,45,15][ii]||0}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-center select-none pointer-events-none">
                <div className="flex flex-col items-center">
                  <Arrow2 className="w-10 h-7 text-slate-400 rotate-180" />
                  <p className="font-hand text-base text-slate-600 dark:text-zinc-400 rotate-2 text-center">
                    Transparent progress.<br />
                    <span className="relative inline-block">Stronger trust.<ScribbleUnderline className="absolute -bottom-0.5 left-0 w-full h-2 text-teal-500" /></span>
                  </p>
                </div>
              </div>

              <Float delay={1} y={6} className="absolute -bottom-4 -right-4 z-20">
                <PaperAirplane className="w-12 h-12 text-teal-500 rotate-[-15deg]" />
              </Float>
            </FadeIn>
          </div>
        </section>

        {/* SECTION 4 — Stay in the loop */}
        <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-white dark:bg-zinc-950 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <FadeIn direction="left" className="relative hidden md:flex items-start justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-8 left-10 z-20 select-none pointer-events-none">
                  <p className="font-hand text-lg font-semibold text-slate-700 dark:text-zinc-300 -rotate-2 leading-tight">
                    Everything you need,{" "}
                    <span className="relative inline-block">as it happens.<ScribbleUnderline className="absolute -bottom-1 left-0 w-full h-2 text-teal-400" /></span>
                  </p>
                  <Arrow1 className="w-10 h-10 text-slate-400 mt-0.5 ml-6 rotate-12" />
                </div>

                <Float delay={0.3} y={8} className="absolute -top-4 right-0 z-30">
                  <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl shadow-lg rotate-3 w-40">
                    <p className="font-bold text-teal-900 text-xs mb-2">Product Launch</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[10px] text-teal-800"><CheckCircle className="w-3 h-3 text-teal-500"/> Finalize copy</div>
                      <div className="flex items-center gap-1 text-[10px] text-teal-800"><CheckCircle className="w-3 h-3 text-teal-500"/> Design review</div>
                      <div className="flex items-center gap-1 text-[10px] text-teal-800 opacity-60"><div className="w-3 h-3 border border-teal-400 rounded"/> Ship it! <Rocket className="w-3 h-3"/></div>
                    </div>
                  </div>
                </Float>

                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-zinc-800 p-6 mt-10">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-600/30">C</div>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">Activity <Activity className="w-4 h-4 text-blue-500" /></h3>
                  </div>
                  <div className="flex gap-2.5 mb-4 text-sm font-medium overflow-x-auto pb-1">
                    {["All","Notes","Tasks","Boards","Users"].map((t,i)=>(
                      <div key={t} className={`px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${i===0?"bg-blue-600 text-white":"text-slate-500"}`}>{t}</div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-400">Today</p>
                    {[
                      {img:9,name:"Emma",action:"completed the checklist",detail:'"Design MVP" in "Product Launch"',color:"text-green-600",ago:"2m ago",dot:"bg-teal-500"},
                      {img:11,name:"Liam",action:"added a new note",detail:'"API Integration" in "Product Launch"',color:"",ago:"15m ago",dot:"bg-blue-500"},
                      {img:12,name:"Olivia",action:"moved a note to",detail:'"In Progress"',color:"",ago:"1h ago",dot:"bg-amber-500"},
                      {img:13,name:"Noah",action:"commented on",detail:'"Launch Plan"',color:"",ago:"2h ago",dot:"bg-slate-300"},
                    ].map((ev,i)=>(
                      <div key={i} className="flex gap-3 items-start">
                        <img src={`/avatar/avatar${ev.img <= 8 ? ev.img : ((ev.img - 9) % 8) + 1}.png`} className="w-8 h-8 rounded-full flex-shrink-0" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-600 dark:text-zinc-300"><span className="font-bold text-slate-900 dark:text-white">{ev.name}</span> {ev.action}</p>
                          <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">{ev.detail} {ev.color&&<Check className={`inline w-3 h-3 ${ev.color}`}/>}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 flex-shrink-0">
                          {ev.ago} <div className={`w-1.5 h-1.5 rounded-full ${ev.dot}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Float delay={0.5} y={8} className="absolute -bottom-4 -right-28 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-zinc-700/80 p-4 w-[260px] z-30">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">C</div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5 text-slate-900 dark:text-white">
                        CollabBoard <span className="bg-slate-200 dark:bg-zinc-600 text-slate-600 dark:text-zinc-300 text-[10px] px-1.5 py-0.5 rounded">APP</span>
                      </div>
                      <div className="text-[11px] text-slate-500">#product-launch</div>
                    </div>
                    <SlackIcon className="w-5 h-5 ml-auto text-[#E01E5A]" />
                  </div>
                  <div className="space-y-2.5">
                    {[
                      {img:9,name:"Emma",text:"completed",detail:'"Design MVP" checklist',ago:"2m ago"},
                      {img:11,name:"Liam",text:"added a new note",detail:'"API Integration"',ago:"15m ago"},
                      {img:12,name:"Olivia",text:"moved a note to",detail:'"In Progress"',ago:"1h ago"},
                    ].map((n,i)=>(
                      <div key={i} className="flex gap-2 items-center">
                        <img src={`/avatar/avatar${n.img <= 8 ? n.img : ((n.img - 9) % 8) + 1}.png`} className="w-6 h-6 rounded-full flex-shrink-0" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-slate-600 dark:text-zinc-300"><span className="font-bold">{n.name}</span> {n.text}</p>
                          <p className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 truncate">{n.detail}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{n.ago}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-700 text-center text-xs font-bold text-teal-600">See all activity →</div>
                </Float>

                <div className="absolute top-[30%] -right-8 z-40 select-none pointer-events-none text-center">
                  <p className="font-hand text-base font-semibold text-slate-700 dark:text-zinc-300 -rotate-2 leading-tight max-w-[120px]">
                    Get notified<br />where{" "}
                    <span className="relative inline-block">you work<ScribbleUnderline className="absolute -bottom-1 left-0 w-full h-2 text-teal-500" /></span>
                  </p>
                  <Arrow2 className="w-10 h-8 text-slate-400 mt-1 scale-x-[-1] rotate-[45deg] mx-auto" />
                </div>
              </div>
            </FadeIn>

            <div className="relative z-20 order-1 lg:order-2">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-teal-200 dark:border-teal-900/60 rounded-full mb-5 shadow-sm text-teal-600 font-medium text-sm">
                  <Zap className="w-4 h-4" /> Real-time. Always in sync.
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black leading-[1.08] mb-5 text-slate-900 dark:text-white">
                  Stay in the loop.<br />
                  <span className="text-blue-600 relative inline-block">
                    Always.
                    <ScribbleUnderline className="absolute -bottom-2 left-0 w-full h-3 text-blue-300" />
                  </span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 mb-8 max-w-md">
                  From note updates to task completions, CollabBoard keeps everyone aligned with real-time activity and smart notifications.
                </p>
              </FadeIn>
              <FadeIn delay={0.2} className="space-y-6 max-w-md">
                {[
                  { title: "Live activity feed", desc: "See everything as it happens.", color: "bg-teal-100 text-teal-600", icon: Activity },
                  { title: "Smart notifications", desc: "Never miss what matters most.", color: "bg-blue-100 text-blue-600", icon: Bell },
                  { title: "Slack integration", desc: "Get updates where your team already talks.", color: "bg-amber-100 text-amber-600", icon: SlackIcon },
                  { title: "Team transparency", desc: "Build trust with full visibility.", color: "bg-emerald-100 text-emerald-600", icon: Users },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </FadeIn>
              <FadeIn delay={0.4} className="mt-8">
                <p className="text-xs font-semibold text-slate-400 mb-3 tracking-wide uppercase">Works with the tools you love</p>
                <div className="flex items-center gap-3">
                  {[
                    { bg: "bg-white border border-slate-200", node: <SlackIcon className="w-6 h-6" /> },
                    { bg: "bg-[#EA4335]", node: <Mail className="w-5 h-5 text-white" /> },
                    { bg: "bg-[#4285F4]", node: <Calendar className="w-5 h-5 text-white" /> },
                    { bg: "bg-[#6264A7]", node: <Users className="w-5 h-5 text-white" /> },
                  ].map((t, i) => (
                    <div key={i} className={`w-10 h-10 ${t.bg} rounded-xl flex items-center justify-center shadow-sm`}>{t.node}</div>
                  ))}
                  <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                    <span className="text-slate-500 font-bold text-sm">+</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Final CTA */}
        <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f8fafc 0%,#ffffff 50%,#f0fdfa 100%)" }}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 w-1/2 h-3/5 bg-teal-100/40 blur-[90px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-2/5 h-1/2 bg-blue-100/30 blur-[70px] rounded-full" />
          </div>

          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
            <div>
              <FadeIn>
                <p className="text-sm font-medium text-slate-500 mb-3">Work together. Move forward.</p>
                <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black leading-[1.08] mb-5 text-slate-900 dark:text-white">
                  Ideas start here.<br />
                  <span className="text-teal-600">Impact happens<br className="sm:hidden" /> together.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 mb-8 max-w-md">
                  CollabBoard brings your team, tasks, and ideas into one shared space so you can focus on what matters and ship more, together.
                </p>
              </FadeIn>
              <FadeIn delay={0.2} className="mb-7">
                <Button asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
                  <Link href={authCtaHref}>Get started for free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </FadeIn>
              <FadeIn delay={0.3} className="flex flex-wrap gap-3 sm:gap-5 mb-8 text-sm text-slate-500">
                {[
                  {icon:<Ban className="w-3.5 h-3.5"/>,text:"No credit card required"},
                  {icon:<Users className="w-3.5 h-3.5"/>,text:"Invite your team in seconds"},
                  {icon:<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>,text:"Loved by early users"},
                ].map((t)=>[
                  <span key={t.text} className="flex items-center gap-1.5 font-medium">{t.icon}{t.text}</span>
                ])}
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl p-5 max-w-sm shadow-sm mb-6">
                  <p className="text-slate-600 dark:text-zinc-300 font-medium mb-4 text-sm italic">&ldquo;CollabBoard is the glue that keeps our projects and people aligned.&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <img src="/avatar/avatar7.png" className="w-9 h-9 rounded-full" alt="" />
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">Arjun Mehta</p>
                      <p className="text-xs text-slate-500">CTO, Brightly</p>
                    </div>
                  </div>
                </div>
                <div className="select-none pointer-events-none">
                  <p className="font-hand text-xl text-slate-700 dark:text-zinc-300 leading-tight">
                    More clarity. More velocity. More impact.<br />
                    That&apos;s{" "}
                    <span className="text-blue-600 font-bold relative inline-block">
                      CollabBoard.
                      <ScribbleUnderline className="absolute -bottom-1 left-0 w-full h-2 text-blue-400" />
                    </span>
                  </p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} direction="right" className="relative hidden md:block">
              <div className="absolute -top-6 left-[30%] z-20 select-none pointer-events-none text-center">
                <p className="font-hand text-lg font-semibold text-slate-700 dark:text-zinc-300 -rotate-1 leading-tight">
                  Big ideas. Small steps.<br />
                  <span className="relative inline-block">Real progress.<ScribbleUnderline className="absolute -bottom-0.5 left-0 w-full h-2 text-teal-400" /></span>
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-5 mt-8">
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { label:"To do", labelColor:"text-slate-600 bg-slate-100", notes:[
                      {bg:"bg-teal-50 dark:bg-teal-900/20 border border-teal-100",title:"Design landing page",avatar:9},
                      {bg:"bg-blue-50 dark:bg-blue-900/20 border border-blue-100",title:"User research",checks:["Survey","Interviews"]},
                    ]},
                    { label:"In progress", labelColor:"text-amber-700 bg-amber-100", notes:[
                      {bg:"bg-amber-50 dark:bg-amber-900/20 border border-amber-100",title:"Build mobile app",detail:"60%",avatar:11},
                      {bg:"bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100",title:"API integration",detail:"3/5"},
                    ]},
                    { label:"Review", labelColor:"text-blue-700 bg-blue-100", notes:[
                      {bg:"bg-rose-50 dark:bg-rose-900/20 border border-rose-100",title:"Brand guidelines",avatar:12},
                      {bg:"bg-orange-50 dark:bg-orange-900/20 border border-orange-100",title:"Marketing plan",checks:["Outline","Brief","Review"]},
                    ]},
                    { label:"Done", labelColor:"text-emerald-700 bg-emerald-100", trophy:true, notes:[
                      {bg:"bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100",title:"Launch v1.0",avatar:13},
                      {bg:"bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100",title:"Analytics dashboard",avatar:14},
                    ]},
                  ].map((col) => (
                    <div key={col.label} className="space-y-2">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${col.labelColor}`}>
                        {col.label} {col.trophy && <Trophy className="w-3 h-3 ml-0.5" />}
                      </div>
                      {col.notes.map((note,ni)=>(
                        <div key={ni} className={`${note.bg} p-3 rounded-xl shadow-sm`}>
                          <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 mb-2">{note.title}</p>
                          {"checks" in note && note.checks && (
                            <div className="space-y-1">
                              {note.checks.map((c,ci)=>(
                                <div key={ci} className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                                  {ci<2 ? <CheckCircle className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0"/> : <div className="w-2.5 h-2.5 border border-slate-400 rounded flex-shrink-0"/>}
                                  {c}
                                </div>
                              ))}
                            </div>
                          )}
                          {"detail" in note && note.detail && (
                            <p className="text-[10px] text-slate-500 font-bold">{note.detail}</p>
                          )}
                          {"avatar" in note && note.avatar && (
                            <img src={`/avatar/avatar${note.avatar <= 8 ? note.avatar : ((note.avatar - 9) % 8) + 1}.png`} className="w-5 h-5 rounded-full mt-2 border-2 border-white" alt="" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-2 -right-2 select-none pointer-events-none z-10">
                <p className="font-hand text-base text-slate-600 dark:text-zinc-400 -rotate-2 text-center max-w-[110px] leading-tight mb-1">Celebrate every win. Together.</p>
                <Arrow1 className="w-8 h-8 text-slate-400 rotate-[60deg] mx-auto" />
              </div>

              <div className="absolute -bottom-3 left-[35%] z-20 select-none pointer-events-none -rotate-2">
                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-2xl px-3 py-2 shadow-lg text-sm font-bold text-slate-800 dark:text-white">
                  <Rocket className="w-4 h-4 text-blue-600" /> Ship it!
                </div>
              </div>
            </FadeIn>

            <div className="md:hidden grid grid-cols-2 gap-3">
              {[
                {label:"To do",lc:"bg-slate-100 text-slate-600",bg:"bg-teal-50 border border-teal-100",title:"Design landing page"},
                {label:"In progress",lc:"bg-amber-100 text-amber-700",bg:"bg-amber-50 border border-amber-100",title:"Build mobile app"},
                {label:"Review",lc:"bg-blue-100 text-blue-700",bg:"bg-rose-50 border border-rose-100",title:"Brand guidelines"},
                {label:"Done",lc:"bg-emerald-100 text-emerald-700",bg:"bg-emerald-50 border border-emerald-100",title:"Launch v1.0"},
              ].map((c)=>(
                <div key={c.label} className="space-y-2">
                  <div className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${c.lc}`}>{c.label}</div>
                  <div className={`${c.bg} p-3 rounded-xl`}>
                    <p className="font-semibold text-xs text-slate-800">{c.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
