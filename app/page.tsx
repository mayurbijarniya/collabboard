import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { LayoutGrid, Users, Zap, Clock, Search, Activity } from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "Collaborative Boards",
    description: "Create unlimited boards with sticky notes and checklists. Organize tasks visually and intuitively.",
  },
  {
    icon: Users,
    title: "Team Workspaces",
    description: "Invite team members, manage permissions, and collaborate in real-time across projects.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "See changes instantly as your team works. No refresh needed, stay in sync automatically.",
  },
  {
    icon: Clock,
    title: "Due Dates & Reminders",
    description: "Set deadlines on tasks with visual indicators for overdue items. Never miss a deadline.",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description: "Find any note or task instantly with powerful search and filtering capabilities.",
  },
  {
    icon: Activity,
    title: "Activity Timeline",
    description: "Track all changes with a complete audit trail. See who did what and when.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/collabboard.svg"
              alt="CollabBoard"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold">CollabBoard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Organize Your Team&apos;s Tasks in{" "}
              <span className="text-primary">Real-Time</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              CollabBoard is the real-time collaboration platform that helps your team stay
              aligned. Create boards, add tasks, collaborate seamlessly.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signin">Start Collaborating - It&apos;s Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to Stay Organized
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                CollabBoard brings your team together with powerful collaboration tools designed
                for modern workflows.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={feature.title}>
                    <CardContent className="pt-6">
                      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="mb-2 text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join teams around the world using CollabBoard to stay organized and productive.
              </p>
              <Button size="lg" asChild>
                <Link href="/auth/signin">Create Your First Board</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} CollabBoard. Built with ❤️ for teams everywhere.
          </p>
          <p className="mt-2 text-xs">
            Based on Gumboard (MIT License) - Original © 2025 Gumroad, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
