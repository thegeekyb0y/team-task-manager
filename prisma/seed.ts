import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ProjectRole, TaskPriority, TaskStatus } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@example.com";
  const memberEmail = "member@example.com";
  const passwordHash = await bcrypt.hash("password123", 10);

  const [admin, member] = await Promise.all([
    prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        name: "Demo Admin",
        email: adminEmail,
        passwordHash,
      },
    }),
    prisma.user.upsert({
      where: { email: memberEmail },
      update: {},
      create: {
        name: "Demo Member",
        email: memberEmail,
        passwordHash,
      },
    }),
  ]);

  const project = await prisma.project.upsert({
    where: { id: "demo-project" },
    update: {},
    create: {
      id: "demo-project",
      name: "Launch Sprint",
      description: "Seeded project for local development.",
      createdById: admin.id,
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: admin.id,
      },
    },
    update: { role: ProjectRole.ADMIN },
    create: {
      projectId: project.id,
      userId: admin.id,
      role: ProjectRole.ADMIN,
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId: project.id,
        userId: member.id,
      },
    },
    update: { role: ProjectRole.MEMBER },
    create: {
      projectId: project.id,
      userId: member.id,
      role: ProjectRole.MEMBER,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Set up database schema",
        description: "Create the initial Prisma migration.",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        projectId: project.id,
        assignedToId: admin.id,
        createdById: admin.id,
      },
      {
        title: "Build dashboard widgets",
        description: "Show status counts and overdue tasks.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        projectId: project.id,
        assignedToId: member.id,
        createdById: admin.id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
