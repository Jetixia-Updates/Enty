import { Router } from "express";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const familyRoutes = Router();

familyRoutes.use(authMiddleware);

familyRoutes.get("/", async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    include: { family: { include: { members: { select: { id: true, name: true, avatar: true, role: true } } } } },
  });
  if (!user?.familyId) return res.json(null);
  res.json(user.family);
});

familyRoutes.post("/", async (req: AuthRequest, res) => {
  const { name } = req.body;
  const family = await prisma.family.create({
    data: { name: name || "My Family" },
  });
  await prisma.user.update({
    where: { id: req.userId! },
    data: { familyId: family.id },
  });
  res.json(family);
});
