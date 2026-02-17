import { Router } from "express";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const notificationsRoutes = Router();

notificationsRoutes.use(authMiddleware);

notificationsRoutes.get("/", async (req: AuthRequest, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(notifications);
});

notificationsRoutes.patch("/:id/read", async (req: AuthRequest, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await prisma.notification.updateMany({
    where: { id, userId: req.userId! },
    data: { isRead: true },
  });
  res.json({ ok: true });
});

notificationsRoutes.patch("/read-all", async (req: AuthRequest, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.userId! },
    data: { isRead: true },
  });
  res.json({ ok: true });
});
