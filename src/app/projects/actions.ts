"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectRole, TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  addMemberSchema,
  createProjectSchema,
  createTaskSchema,
  updateTaskStatusSchema,
} from "@/lib/validations/project";

export async function createProject(formData: FormData) {
  const user = await requireUser();
  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid project data.");
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      createdById: user.id,
      members: {
        create: {
          userId: user.id,
          role: ProjectRole.ADMIN,
        },
      },
    },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function addMemberToProject(formData: FormData) {
  const user = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  const parsed = addMemberSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid member data.");
  }

  const membership = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: user.id,
      role: ProjectRole.ADMIN,
    },
  });

  if (!membership) {
    throw new Error("Only project admins can add members.");
  }

  const invitedUser = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (!invitedUser) {
    throw new Error("That user does not have an account yet.");
  }

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: {
        projectId,
        userId: invitedUser.id,
      },
    },
    update: {
      role: parsed.data.role,
    },
    create: {
      projectId,
      userId: invitedUser.id,
      role: parsed.data.role,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/board`);
}

export async function createTask(formData: FormData) {
  const user = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    assignedToId: formData.get("assignedToId"),
    priority: formData.get("priority") || TaskPriority.MEDIUM,
    dueDate: formData.get("dueDate") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid task data.");
  }

  const adminMembership = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: user.id,
      role: ProjectRole.ADMIN,
    },
  });

  if (!adminMembership) {
    throw new Error("Only project admins can create tasks.");
  }

  const assigneeMembership = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: parsed.data.assignedToId,
    },
  });

  if (!assigneeMembership) {
    throw new Error("Assignee must be a member of this project.");
  }

  await prisma.task.create({
    data: {
      projectId,
      title: parsed.data.title,
      description: parsed.data.description,
      assignedToId: parsed.data.assignedToId,
      createdById: user.id,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/board`);
  revalidatePath("/dashboard");
}

export async function updateTaskStatus(formData: FormData) {
  const user = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  const parsed = updateTaskStatusSchema.safeParse({
    taskId: formData.get("taskId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error("Invalid task update.");
  }

  const task = await prisma.task.findUnique({
    where: { id: parsed.data.taskId },
    include: {
      project: true,
    },
  });

  if (!task || task.projectId !== projectId) {
    throw new Error("Task not found.");
  }

  const membership = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: user.id,
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this project.");
  }

  const canUpdate =
    membership.role === ProjectRole.ADMIN || task.assignedToId === user.id;

  if (!canUpdate) {
    throw new Error("Only admins or assignees can update this task.");
  }

  await prisma.task.update({
    where: { id: parsed.data.taskId },
    data: { status: parsed.data.status as TaskStatus },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/board`);
  revalidatePath("/dashboard");
}
