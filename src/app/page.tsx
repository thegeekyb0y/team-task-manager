import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Buildings,
  CheckCircle,
  ChartBar,
  Kanban,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";

const metrics = [
  { label: "Projects", value: "12", icon: Buildings },
  { label: "Active tasks", value: "84", icon: Kanban },
  { label: "On-time rate", value: "94%", icon: ChartBar },
  { label: "Members", value: "18", icon: UsersThree },
];

const features = [
  {
    title: "Role-aware projects",
    description: "Create projects, add teammates by email, and keep admin controls precise.",
  },
  {
    title: "Assignment-ready task flows",
    description: "Track status, due dates, priorities, and assignees without losing readability.",
  },
  {
    title: "Dashboard with signal",
    description: "Show metrics, overdue work, and current load in one calm operational view.",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:py-6">
        <header className="surface rounded-[32px] border border-white/10 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary text-white shadow-[0_18px_40px_rgba(79,70,229,0.35)]">
                  <Kanban size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Orbit</p>
                  <p className="text-lg font-semibold text-slate-950 dark:text-white">
                    Team Task Manager
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button variant="secondary">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>
                    Create account
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="space-y-6">
                <Badge tone="primary" className="px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]">
                  Assignment ready foundation
                </Badge>
                <div className="space-y-4">
                  <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                    A polished team task manager built for real project coordination, not just demo screens.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    Clean credentials auth, project roles, task assignment, and a dashboard that gives the
                    assignment exactly what it asks for while still feeling like modern product software.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-[24px] border border-white/10 bg-white/65 p-4 dark:bg-slate-950/35">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{metric.label}</p>
                        <div className="rounded-2xl bg-primary-soft p-2 text-primary dark:text-indigo-200">
                          <Icon size={18} weight="duotone" />
                        </div>
                      </div>
                      <p className="mt-5 text-3xl font-semibold text-slate-950 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="surface rounded-[28px] border border-white/10 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-300">
                  <CheckCircle size={18} weight="fill" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{feature.title}</h2>
                  <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
