import { Router } from "express";
import { z } from "zod";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const tasksRoutes = Router();
const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.number().optional(),
  dueDate: z.string().datetime().optional(),
});

tasksRoutes.use(authMiddleware);

tasksRoutes.get("/", async (req: AuthRequest, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId! },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });
  res.json(tasks);
});

tasksRoutes.post("/", async (req: AuthRequest, res) => {
  try {
    const data = taskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        userId: req.userId!,
      },
    });
    res.status(201).json(task);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    res.status(500).json({ error: "Failed to create task" });
  }
});

tasksRoutes.patch("/:id", async (req: AuthRequest, res) => {
  const task = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!task) return res.status(404).json({ error: "Task not found" });

  const data = req.body;
  const updated = await prisma.task.update({
    where: { id: task.id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      ...(data.status === "COMPLETED" && { completedAt: new Date() }),
    },
  });
  res.json(updated);
});

tasksRoutes.delete("/:id", async (req: AuthRequest, res) => {
  const task = await prisma.task.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!task) return res.status(404).json({ error: "Task not found" });
  await prisma.task.delete({ where: { id: task.id } });
  res.status(204).send();
});
