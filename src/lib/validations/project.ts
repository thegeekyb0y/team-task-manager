import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name is required."),
  description: z.string().trim().max(280, "Description is too long.").optional(),
});

export const addMemberSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, "Task title is required."),
  description: z.string().trim().max(500, "Description is too long.").optional(),
  assignedToId: z.string().trim().min(1, "Select an assignee."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.string().optional(),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().trim().min(1),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});
