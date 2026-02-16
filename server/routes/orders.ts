import { Router } from "express";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const ordersRoutes = Router();

ordersRoutes.use(authMiddleware);

ordersRoutes.get("/", async (req: AuthRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId! },
    include: { booking: { include: { provider: { include: { user: true, service: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});
