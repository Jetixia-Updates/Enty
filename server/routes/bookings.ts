import { Router } from "express";
import { z } from "zod";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const bookingsRoutes = Router();
const bookingSchema = z.object({
  providerId: z.string(),
  scheduledAt: z.string().datetime(),
  address: z.string().min(1),
  notes: z.string().optional(),
  price: z.number().positive().optional(),
});

bookingsRoutes.use(authMiddleware);

bookingsRoutes.get("/", async (req: AuthRequest, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.userId! },
    include: {
      provider: { include: { user: true, service: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
  res.json(bookings);
});

bookingsRoutes.post("/", async (req: AuthRequest, res) => {
  try {
    const data = bookingSchema.parse(req.body);
    const provider = await prisma.provider.findFirst({
      where: { id: data.providerId, isApproved: true, isAvailable: true },
      include: { service: true },
    });
    if (!provider) return res.status(400).json({ error: "Provider not available" });

    const booking = await prisma.booking.create({
      data: {
        providerId: data.providerId,
        userId: req.userId!,
        scheduledAt: new Date(data.scheduledAt),
        address: data.address,
        notes: data.notes,
        price: data.price ?? provider.service.basePrice,
      },
      include: {
        provider: { include: { user: true, service: true } },
      },
    });
    res.status(201).json(booking);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    res.status(500).json({ error: "Failed to create booking" });
  }
});
