import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { TaskStatus } from "@prisma/client";
import { TaskBoard } from "@/app/projects/components";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const columns: Array<{ key: TaskStatus; label: string }> = [
  { key: "TODO", label: "Todo" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "DONE", label: "Done" },
];

export default async function ProjectBoardPage({
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
      tasks: {
        include: {
          assignedTo: true,
        },
        orderBy: [{ updatedAt: "desc" }],
      },
    },
  });

  if (!project) {
    return null;
  }

  return (
    <AppShell
      user={{ name: user.name, email: user.email }}
      title={`${project.name} board`}
      subtitle="A lightweight execution board for seeing task flow by status without leaving the project context."
      actions={
        <Link href={`/projects/${project.id}`}>
          <Button variant="secondary">
            <CaretLeft size={16} />
            Back to project
          </Button>
        </Link>
      }
    >
      <TaskBoard
        projectId={project.id}
        columns={columns.map((column) => ({
          ...column,
          tasks: project.tasks.filter((task) => task.status === column.key),
        }))}
      />
    </AppShell>
  );
}
