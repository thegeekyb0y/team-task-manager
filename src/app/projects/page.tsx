import { AppShell } from "@/components/app-shell";
import { CreateProjectPanel, ProjectsGrid } from "@/app/projects/components";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  const user = await requireUser();

  const projects = await prisma.project.findMany({
    where: { members: { some: { userId: user.id } } },
    include: {
      _count: { select: { members: true, tasks: true } },
      members: { where: { userId: user.id }, select: { role: true } },
      tasks: { select: { status: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <AppShell
      user={{ name: user.name, email: user.email }}
      title="Projects"
      subtitle="Create workspaces and manage your team"
    >
      <div className="space-y-6">
        <CreateProjectPanel />
        <ProjectsGrid projects={projects} />
      </div>
    </AppShell>
  );
}
