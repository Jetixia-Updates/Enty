import { Router } from "express";
import { optionalAuth, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { ServiceCategory } from "@prisma/client";

export const providersRoutes = Router();

const CATEGORIES = Object.values(ServiceCategory);

providersRoutes.get("/", optionalAuth, async (req: AuthRequest, res) => {
  const serviceId = Array.isArray(req.query.serviceId) ? req.query.serviceId[0] : req.query.serviceId;
  const category = Array.isArray(req.query.category) ? req.query.category[0] : req.query.category;
  const where: Record<string, unknown> = { isApproved: true };
  if (serviceId) where.serviceId = serviceId;
  if (category && CATEGORIES.includes(category as ServiceCategory)) {
    const service = await prisma.service.findFirst({ where: { category: category as ServiceCategory } });
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
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const provider = await prisma.provider.findUnique({
    where: { id },
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
