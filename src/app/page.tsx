import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";

const features = [
  "Project-level role management",
  "Task assignment & tracking",
  "Real-time status updates",
  "Overdue task monitoring",
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground text-sm font-semibold">
              O
            </div>
            <span className="text-lg font-semibold">Orbit</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>
                Get Started
                <ArrowRight size={16} weight="bold" />
              </Button>
            </Link>
          </div>
        </nav>

        <div className="mx-auto mt-20 max-w-3xl text-center">
          <div className="inline-flex items-center border border-border bg-accent px-3 py-1 text-xs font-medium mb-6">
            Team Task Management
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Manage projects and tasks with your team
          </h1>
          <p className="mt-6 text-lg text-muted">
            A clean, professional task manager with role-based access control,
            project workspaces, and real-time collaboration.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">
                Create Account
                <ArrowRight size={18} weight="bold" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid gap-4 text-left sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle
                  size={20}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
