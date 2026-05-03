import Link from "next/link";
import {
  ArrowSquareOut,
  Plus,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import type { ProjectRole, TaskPriority, TaskStatus } from "@prisma/client";
import {
  addMemberToProject,
  createProject,
  createTask,
  updateTaskStatus,
} from "@/app/projects/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate, isOverdue } from "@/lib/utils";

export function CreateProjectPanel() {
  return (
    <section className="surface rounded-xl border border-white/10 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Create a project
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start a workspace, then add members and assign the first task.
          </p>
        </div>
        <div className="hidden rounded-2xl bg-primary-soft p-3 text-primary dark:text-indigo-200 sm:flex">
          <Plus size={18} weight="bold" />
        </div>
      </div>

      <form
        action={createProject}
        className="grid gap-4 lg:grid-cols-[1fr_260px]"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </label>
            <Input name="name" placeholder="Q3 Product Launch" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Description
            </label>
            <Textarea
              name="description"
              placeholder="Key goals, scope, launch milestones, and the team involved."
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/3 p-4 dark:bg-white/3">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            What happens next
          </p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            <li>You become the initial project admin.</li>
            <li>Add existing teammates by email.</li>
            <li>Create tasks and assign them immediately.</li>
          </ul>
          <Button className="mt-5 w-full" type="submit">
            Create project
          </Button>
        </div>
      </form>
    </section>
  );
}

export function ProjectsGrid({
  projects,
}: {
  projects: Array<{
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    _count: { members: number; tasks: number };
    members: Array<{ role: ProjectRole }>;
    tasks: Array<{ status: TaskStatus }>;
  }>;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {projects.map((project) => {
        const doneCount = project.tasks.filter(
          (task) => task.status === "DONE",
        ).length;
        const role = project.members[0]?.role ?? "MEMBER";

        return (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="surface group rounded-xl border border-white/10 p-5 hover:-translate-y-0.5 hover:border-primary/25"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={role === "ADMIN" ? "primary" : "neutral"}>
                    {role}
                  </Badge>
                  <Badge tone="neutral">{project._count.members} members</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 group-hover:text-primary dark:text-white dark:group-hover:text-indigo-200">
                    {project.name}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {project.description || "No project description yet."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/5 p-2 text-slate-400 group-hover:bg-primary-soft group-hover:text-primary dark:bg-white/8 dark:group-hover:text-indigo-200">
                <ArrowSquareOut size={18} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="Tasks" value={String(project._count.tasks)} />
              <Stat label="Done" value={String(doneCount)} />
              <Stat
                label="Created"
                value={formatDate(project.createdAt)}
                compact
              />
            </div>
          </Link>
        );
      })}
    </section>
  );
}

export function AddMemberPanel({ projectId }: { projectId: string }) {
  return (
    <section className="surface rounded-[28px] border border-white/10 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-primary-soft p-2 text-primary dark:text-indigo-200">
          <UsersThree size={18} weight="duotone" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Add member
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add existing users by email and assign their role.
          </p>
        </div>
      </div>

      <form
        action={addMemberToProject}
        className="grid gap-3 sm:grid-cols-[1fr_160px_auto]"
      >
        <input type="hidden" name="projectId" value={projectId} />
        <Input name="email" placeholder="member@example.com" required />
        <Select name="role" defaultValue="MEMBER">
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </Select>
        <Button type="submit">Invite</Button>
      </form>
    </section>
  );
}

export function CreateTaskPanel({
  projectId,
  members,
}: {
  projectId: string;
  members: Array<{
    userId: string;
    name: string | null;
    email: string;
    role: ProjectRole;
  }>;
}) {
  return (
    <section className="surface rounded-[28px] border border-white/10 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
          Create task
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keep assignments visible and due dates explicit.
        </p>
      </div>

      <form
        action={createTask}
        className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <input type="hidden" name="projectId" value={projectId} />
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Title
            </label>
            <Input
              name="title"
              placeholder="Finalize dashboard metrics copy"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Description
            </label>
            <Textarea
              name="description"
              placeholder="What done looks like, blockers, and any details the assignee needs."
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Assignee
            </label>
            <Select name="assignedToId" defaultValue={members[0]?.userId}>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name || member.email} ({member.role})
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Priority
            </label>
            <Select name="priority" defaultValue="MEDIUM">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Due date
            </label>
            <Input name="dueDate" type="date" />
          </div>
          <Button className="w-full" type="submit">
            Create task
          </Button>
        </div>
      </form>
    </section>
  );
}

export function TaskTable({
  tasks,
  projectId,
  canManage,
}: {
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date | null;
    assignedTo: { name: string | null; email: string } | null;
  }>;
  projectId: string;
  canManage: boolean;
}) {
  return (
    <section className="surface overflow-hidden rounded-[28px] border border-white/10">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Task list
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Compact enough for scanning, detailed enough for real project
              work.
            </p>
          </div>
          <Link
            href={`/projects/${projectId}/board`}
            className="text-sm font-medium text-primary hover:text-primary-strong"
          >
            Open board
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-950/3 text-xs uppercase tracking-[0.16em] text-slate-400 dark:bg-white/3">
            <tr>
              <th className="px-5 py-4 sm:px-6">Task</th>
              <th className="px-5 py-4">Assignee</th>
              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Due</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-white/10 align-top">
                <td className="px-5 py-4 sm:px-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-950 dark:text-white">
                      {task.title}
                    </p>
                    <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {task.description || "No extra notes."}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {task.assignedTo?.name ||
                    task.assignedTo?.email ||
                    "Unassigned"}
                </td>
                <td className="px-5 py-4">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-5 py-4">
                  <Badge
                    tone={
                      isOverdue(task.dueDate, task.status)
                        ? "danger"
                        : "neutral"
                    }
                  >
                    {formatDate(task.dueDate)}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <form
                    action={updateTaskStatus}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="projectId" value={projectId} />
                    <Select
                      className={cn(
                        "min-w-37.5",
                        !canManage ? "opacity-80" : "",
                      )}
                      defaultValue={task.status}
                      name="status"
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="DONE">Done</option>
                    </Select>
                    <Button type="submit" variant="secondary">
                      Save
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function TaskBoard({
  columns,
  projectId,
}: {
  columns: Array<{
    key: TaskStatus;
    label: string;
    tasks: Array<{
      id: string;
      title: string;
      description: string | null;
      priority: TaskPriority;
      dueDate: Date | null;
      assignedTo: { name: string | null; email: string } | null;
      status: TaskStatus;
    }>;
  }>;
  projectId: string;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column.key}
          className="surface rounded-[28px] border border-white/10 p-4"
        >
          <div className="mb-4 flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {column.label}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {column.tasks.length} tasks
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-3xl border border-white/10 bg-white/70 p-4 dark:bg-slate-950/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-slate-950 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {task.description || "No extra details yet."}
                    </p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge
                    tone={
                      isOverdue(task.dueDate, task.status)
                        ? "danger"
                        : "neutral"
                    }
                  >
                    {formatDate(task.dueDate)}
                  </Badge>
                  <Badge tone="neutral">
                    {task.assignedTo?.name ||
                      task.assignedTo?.email ||
                      "Unassigned"}
                  </Badge>
                </div>

                <form action={updateTaskStatus} className="mt-4 flex gap-2">
                  <input type="hidden" name="taskId" value={task.id} />
                  <input type="hidden" name="projectId" value={projectId} />
                  <Select
                    className="flex-1"
                    defaultValue={task.status}
                    name="status"
                  >
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="DONE">Done</option>
                  </Select>
                  <Button type="submit" variant="secondary">
                    Save
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Stat({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/3 p-3 dark:bg-white/3">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-semibold text-slate-950 dark:text-white",
          compact ? "text-sm" : "text-xl",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const tone =
    priority === "HIGH"
      ? "danger"
      : priority === "MEDIUM"
        ? "warning"
        : "success";

  return <Badge tone={tone}>{priority.toLowerCase()}</Badge>;
}
