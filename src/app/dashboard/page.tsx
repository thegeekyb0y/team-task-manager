import type { ElementType } from "react";
import {
  CalendarDots,
  CheckCircle,
  ClockCountdown,
  FolderOpen,
} from "@phosphor-icons/react/dist/ssr";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate, isOverdue } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();

  const [memberships, assignedTasks, recentProjects] = await Promise.all([
    prisma.projectMember.findMany({
      where: { userId: user.id },
      include: {
        project: {
          include: {
            _count: {
              select: { tasks: true, members: true },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    }),
    prisma.task.findMany({
      where: {
        assignedToId: user.id,
      },
      include: {
        project: true,
      },
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
      take: 8,
    }),
    prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
  ]);

  const inProgress = assignedTasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;
  const completed = assignedTasks.filter(
    (task) => task.status === "DONE",
  ).length;
  const overdue = assignedTasks.filter((task) =>
    isOverdue(task.dueDate, task.status),
  ).length;

  return (
    <AppShell
      user={{ name: user.name, email: user.email }}
      title="Dashboard"
      subtitle="A clear overview of your active assignments, project load, and deadlines."
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          icon={FolderOpen}
          label="Projects"
          value={String(memberships.length)}
          tone="primary"
        />
        <MetricCard
          icon={ClockCountdown}
          label="In progress"
          value={String(inProgress)}
          tone="warning"
        />
        <MetricCard
          icon={CheckCircle}
          label="Completed"
          value={String(completed)}
          tone="success"
        />
        <MetricCard
          icon={CalendarDots}
          label="Overdue"
          value={String(overdue)}
          tone="danger"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="surface rounded-xl border hover:bg-gray-950/50 ease-in-out border-white/10">
          <div className="border-b border-white/10 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Assigned to you
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              The current queue, sorted by due date and freshness.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {assignedTasks.length === 0 ? (
              <EmptyState
                title="No assigned work yet"
                description="Once tasks are assigned to you, they'll appear here with priority, due date, and project context."
              />
            ) : (
              assignedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:px-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-950 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {task.project.name}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={task.status} />
                      <Badge
                        tone={
                          isOverdue(task.dueDate, task.status)
                            ? "danger"
                            : "neutral"
                        }
                      >
                        {formatDate(task.dueDate)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {task.description ||
                      "No additional notes on this task yet."}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="surface rounded-xl hover:bg-gray-950/50 ease-in-out border border-white/10 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Recent projects
            </h2>
            <div className="mt-4 space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl hover:bg-gray-950/50 ease-in-out border border-white/10 bg-white/65 p-4 dark:bg-slate-950/40"
                >
                  <p className="text-sm font-medium text-slate-950 dark:text-white">
                    {project.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {project._count.tasks} tasks - {project._count.members}{" "}
                    members
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface rounded-xl hover:bg-gray-950/50 ease-in-out border border-white/10 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Role coverage
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {memberships.map((membership) => (
                <Badge
                  key={membership.id}
                  tone={membership.role === "ADMIN" ? "primary" : "neutral"}
                >
                  {membership.project.name} - {membership.role}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ElementType;
  label: string;
  value: string;
  tone: "primary" | "warning" | "success" | "danger";
}) {
  const classes = {
    primary: "bg-primary-soft text-primary dark:text-indigo-200",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    danger: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  };

  return (
    <div className="surface rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className={`rounded-xl p-2 ${classes[tone]}`}>
          <Icon size={18} weight="duotone" />
        </div>
      </div>
      <p className="mt-5 text-3xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: "TODO" | "IN_PROGRESS" | "DONE" }) {
  if (status === "DONE") {
    return <Badge tone="success">done</Badge>;
  }

  if (status === "IN_PROGRESS") {
    return <Badge tone="warning">in progress</Badge>;
  }

  return <Badge tone="neutral">todo</Badge>;
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-5 py-10 text-center sm:px-6">
      <p className="text-base font-medium text-slate-950 dark:text-white">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
