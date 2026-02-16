import { Router } from "express";
import { z } from "zod";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const kidsRoutes = Router();
const kidProfileSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().optional(),
  schoolName: z.string().optional(),
  grade: z.string().optional(),
});

const homeworkSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string(),
});

kidsRoutes.use(authMiddleware);

// ============ KID PROFILES ============

kidsRoutes.get("/profiles", async (req: AuthRequest, res) => {
  const profiles = await prisma.kidProfile.findMany({
    where: { parentId: req.userId! },
    include: {
      _count: { select: { homework: true } },
    },
  });
  res.json(profiles);
});

kidsRoutes.post("/profiles", async (req: AuthRequest, res) => {
  try {
    const data = kidProfileSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    const profile = await prisma.kidProfile.create({
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        parentId: req.userId!,
        familyId: user?.familyId ?? undefined,
      },
    });
    res.status(201).json(profile);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    res.status(500).json({ error: "Failed to create profile" });
  }
});

kidsRoutes.patch("/profiles/:id", async (req: AuthRequest, res) => {
  const id = String(req.params.id);
  const profile = await prisma.kidProfile.findFirst({
    where: { id, parentId: req.userId! },
  });
  if (!profile) return res.status(404).json({ error: "Profile not found" });

  const data = req.body;
  const updated = await prisma.kidProfile.update({
    where: { id: profile.id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.birthDate !== undefined && { birthDate: data.birthDate ? new Date(data.birthDate) : null }),
      ...(data.schoolName !== undefined && { schoolName: data.schoolName }),
      ...(data.grade !== undefined && { grade: data.grade }),
    },
  });
  res.json(updated);
});

kidsRoutes.delete("/profiles/:id", async (req: AuthRequest, res) => {
  const id = String(req.params.id);
  const profile = await prisma.kidProfile.findFirst({
    where: { id, parentId: req.userId! },
  });
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  await prisma.kidProfile.delete({ where: { id: profile.id } });
  res.status(204).send();
});

// ============ HOMEWORK ============

kidsRoutes.get("/homework", async (req: AuthRequest, res) => {
  const profiles = await prisma.kidProfile.findMany({
    where: { parentId: req.userId! },
    select: { id: true },
  });
  const kidIds = profiles.map((p) => p.id);
  const homework = await prisma.homework.findMany({
    where: { kidId: { in: kidIds } },
    include: { kid: { select: { id: true, name: true } } },
    orderBy: { dueDate: "asc" },
  });
  res.json(homework);
});

kidsRoutes.get("/profiles/:kidId/homework", async (req: AuthRequest, res) => {
  const kidId = String(req.params.kidId);
  const kid = await prisma.kidProfile.findFirst({
    where: { id: kidId, parentId: req.userId! },
  });
  if (!kid) return res.status(404).json({ error: "Profile not found" });

  const homework = await prisma.homework.findMany({
    where: { kidId: kid.id },
    orderBy: { dueDate: "asc" },
  });
  res.json(homework);
});

kidsRoutes.post("/profiles/:kidId/homework", async (req: AuthRequest, res) => {
  try {
    const kidId = String(req.params.kidId);
    const kid = await prisma.kidProfile.findFirst({
      where: { id: kidId, parentId: req.userId! },
    });
    if (!kid) return res.status(404).json({ error: "Profile not found" });

    const data = homeworkSchema.parse(req.body);
    const hw = await prisma.homework.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate),
        kidId: kid.id,
      },
    });
    res.status(201).json(hw);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    res.status(500).json({ error: "Failed to create homework" });
  }
});

kidsRoutes.patch("/homework/:id", async (req: AuthRequest, res) => {
  const id = String(req.params.id);
  const hw = await prisma.homework.findFirst({
    where: { id },
    include: { kid: true },
  });
  if (!hw || hw.kid.parentId !== req.userId!) return res.status(404).json({ error: "Homework not found" });

  const data = req.body;
  const updated = await prisma.homework.update({
    where: { id: hw.id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
    },
  });
  res.json(updated);
});

kidsRoutes.delete("/homework/:id", async (req: AuthRequest, res) => {
  const id = String(req.params.id);
  const hw = await prisma.homework.findFirst({
    where: { id },
    include: { kid: true },
  });
  if (!hw || hw.kid.parentId !== req.userId!) return res.status(404).json({ error: "Homework not found" });
  await prisma.homework.delete({ where: { id: hw.id } });
  res.status(204).send();
});
