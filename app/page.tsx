import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Layout, Users, Zap } from "lucide-react";
import { StickyNotesDemo } from "@/components/sticky-notes-demo";
import { StatsSection } from "@/components/stats-section";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { BetaBadge } from "@/components/ui/beta-badge";

const features = [
  {
    icon: Layout,
    title: "Visual Workspace",
    description:
      "Create dynamic boards with smart notes, checklists, and visual elements that bring your ideas to life.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Collaborate in real-time with your team. Share ideas, assign tasks, and watch progress unfold together.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: Zap,
    title: "Smart Organization",
    description:
      "Organize projects with intelligent boards, team permissions, and workflow automation that scales with you.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
];

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-12 bg-white dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20 xl:gap-28">
              <div className="flex flex-col justify-center space-y-8">
                {/* Logo and Brand */}
                <div className="flex items-center gap-3">
                  <Link href="https://github.com/mayurbijarniya/collabboard" passHref>
                    <Image src="/logo/collabboard.svg" alt="CollabBoard" width={50} height={50} />
                  </Link>
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    CollabBoard
                  </span>
                  <BetaBadge />
                </div>

                {/* Hero Content */}
                <div className="space-y-6">
                  <h1 className="text-5xl font-bold tracking-tight sm:text-6xl xl:text-7xl/none text-slate-900 dark:text-white">
                    Transform ideas into
                    <span className="text-blue-600 dark:text-blue-400"> action together</span>
                  </h1>
                  <p className="max-w-[600px] text-xl text-slate-600 dark:text-zinc-300 leading-relaxed">
                    CollabBoard is your team's visual workspace where creativity meets productivity.
                    Brainstorm, plan, and execute projects with intuitive boards that adapt to your
                    workflow.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg"
                  >
                    <Link href="/auth/signin">Get started - it&apos;s free</Link>
                  </Button>
                </div>
              </div>

              {/* Demo Section */}
              <div>
                <StickyNotesDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Built for modern teams
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto dark:text-zinc-300">
                CollabBoard combines simplicity with powerful features to help teams turn their best
                ideas into reality.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="text-center dark:bg-zinc-900 dark:border-zinc-800"
                  >
                    <CardContent>
                      <div
                        className={`w-12 h-12 mx-auto mb-4 ${feature.bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="mb-2">{feature.title}</CardTitle>
                      <CardDescription className="dark:text-zinc-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <StatsSection />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-6 dark:border-zinc-800">
        <div className="container mx-auto text-center text-sm text-slate-600 dark:text-zinc-400">
          A project by{" "}
          <Link
            href="https://mayur.app"
            className="underline hover:text-slate-900 dark:hover:text-zinc-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mayur
          </Link>
          {" • "}
          <Link
            href="https://github.com/mayurbijarniya/collabboard"
            className="underline hover:text-slate-900 dark:hover:text-zinc-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </Link>
        </div>
      </footer>
    </div>
  );
}
