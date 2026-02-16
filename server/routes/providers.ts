import { Router } from "express";
import { optionalAuth, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const providersRoutes = Router();

providersRoutes.get("/", optionalAuth, async (req: AuthRequest, res) => {
  const { serviceId, category } = req.query;
  const where: Record<string, unknown> = { isApproved: true };
  if (serviceId) where.serviceId = serviceId;
  if (category) {
    const service = await prisma.service.findFirst({ where: { category: category as string } });
    if (service) where.serviceId = service.id;
  }

  const providers = await prisma.provider.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      service: { select: { id: true, name: true, category: true, basePrice: true } },
    },
  });
  res.json(providers);
});

providersRoutes.get("/:id", optionalAuth, async (req, res) => {
  const provider = await prisma.provider.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      service: true,
      reviews: {
        include: { user: { select: { name: true } } },
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!provider) return res.status(404).json({ error: "Provider not found" });
  res.json(provider);
});
