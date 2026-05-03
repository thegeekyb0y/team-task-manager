import Link from "next/link";
import { ProjectRole } from "@prisma/client";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import {
  AddMemberPanel,
  CreateTaskPanel,
  TaskTable,
} from "@/app/projects/components";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await requireUser();

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: { userId: user.id },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
        orderBy: [{ role: "asc" }, { user: { name: "asc" } }],
      },
      tasks: {
        include: {
          assignedTo: true,
        },
        orderBy: [{ createdAt: "desc" }],
      },
    },
  });

  if (!project) {
    return null;
  }

  const currentMembership = project.members.find((member) => member.userId === user.id);
  const canManage = currentMembership?.role === ProjectRole.ADMIN;

  return (
    <AppShell
      user={{ name: user.name, email: user.email }}
      title={project.name}
      subtitle={project.description || "A focused workspace for project coordination, task assignment, and progress tracking."}
      actions={
        <Link href={`/projects/${project.id}/board`}>
          <Button variant="secondary">
            Open board
            <ArrowSquareOut size={16} />
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <TaskTable
            canManage={canManage || false}
            projectId={project.id}
            tasks={project.tasks}
          />
          {canManage ? (
            <CreateTaskPanel
              projectId={project.id}
              members={project.members.map((member) => ({
                userId: member.userId,
                name: member.user.name,
                email: member.user.email,
                role: member.role,
              }))}
            />
          ) : null}
        </div>

        <div className="space-y-4">
          <section className="surface rounded-[28px] border border-white/10 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Team</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  People with access to this project.
                </p>
              </div>
              <Badge tone={canManage ? "primary" : "neutral"}>
                {canManage ? "Admin view" : "Member view"}
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-[24px] border border-white/10 bg-white/65 p-4 dark:bg-slate-950/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-950 dark:text-white">
                        {member.user.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {member.user.email}
                      </p>
                    </div>
                    <Badge tone={member.role === "ADMIN" ? "primary" : "neutral"}>
                      {member.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {canManage ? <AddMemberPanel projectId={project.id} /> : null}
        </div>
      </div>
    </AppShell>
  );
}
