import { Router } from "express";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/me", async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { id: true, email: true, phone: true, name: true, avatar: true, role: true, isVerified: true, familyId: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

userRoutes.patch("/me", async (req: AuthRequest, res) => {
  const { name, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: req.userId! },
    data: { ...(name && { name }), ...(avatar !== undefined && { avatar }) },
    select: { id: true, email: true, phone: true, name: true, avatar: true, role: true, isVerified: true, familyId: true },
  });
  res.json(user);
});
