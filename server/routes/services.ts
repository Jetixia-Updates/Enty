import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const servicesRoutes = Router();

servicesRoutes.get("/", async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: { _count: { select: { providers: true } } },
  });
  res.json(services);
});

servicesRoutes.get("/categories", (_req, res) => {
  const categories = [
    { id: "CLEANING", name: "Cleaning", icon: "sparkles" },
    { id: "PLUMBING", name: "Plumbing", icon: "wrench" },
    { id: "ELECTRICAL", name: "Electrical", icon: "zap" },
    { id: "CARPENTRY", name: "Carpentry", icon: "hammer" },
    { id: "CAR_MECHANIC", name: "Car Mechanic", icon: "car" },
    { id: "BABYSITTER", name: "Babysitter", icon: "baby" },
    { id: "DELIVERY", name: "Delivery", icon: "package" },
    { id: "PRIVATE_TUTOR", name: "Private Tutor", icon: "book" },
  ];
  res.json(categories);
});
