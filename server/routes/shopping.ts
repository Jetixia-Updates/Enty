import { Router } from "express";
import { z } from "zod";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const shoppingRoutes = Router();

shoppingRoutes.use(authMiddleware);

const itemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive().optional(),
  unit: z.string().optional(),
});

shoppingRoutes.get("/lists", async (req: AuthRequest, res) => {
  const lists = await prisma.shoppingList.findMany({
    where: { userId: req.userId! },
    include: {
      items: true,
      _count: { select: { items: true } },
    },
  });
  res.json(lists);
});

shoppingRoutes.post("/lists", async (req: AuthRequest, res) => {
  const { name } = req.body;
  const list = await prisma.shoppingList.create({
    data: { name: name || "قائمة جديدة", userId: req.userId! },
  });
  res.status(201).json(list);
});

shoppingRoutes.get("/lists/:id", async (req: AuthRequest, res) => {
  const list = await prisma.shoppingList.findFirst({
    where: { id: req.params.id, userId: req.userId! },
    include: { items: true },
  });
  if (!list) return res.status(404).json({ error: "List not found" });
  res.json(list);
});

shoppingRoutes.post("/lists/:id/items", async (req: AuthRequest, res) => {
  try {
    const data = itemSchema.parse(req.body);
    const list = await prisma.shoppingList.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    });
    if (!list) return res.status(404).json({ error: "List not found" });
    const item = await prisma.shoppingItem.create({
      data: {
        ...data,
        quantity: data.quantity ?? 1,
        shoppingListId: list.id,
      },
    });
    res.status(201).json(item);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    res.status(500).json({ error: "Failed to add item" });
  }
});

shoppingRoutes.patch("/items/:id", async (req: AuthRequest, res) => {
  const item = await prisma.shoppingItem.findFirst({
    where: {
      id: req.params.id,
      shoppingList: { userId: req.userId! },
    },
  });
  if (!item) return res.status(404).json({ error: "Item not found" });
  const { isPurchased, name, quantity } = req.body;
  const updated = await prisma.shoppingItem.update({
    where: { id: item.id },
    data: {
      ...(isPurchased !== undefined && { isPurchased }),
      ...(name && { name }),
      ...(quantity !== undefined && { quantity }),
    },
  });
  res.json(updated);
});

shoppingRoutes.delete("/items/:id", async (req: AuthRequest, res) => {
  const item = await prisma.shoppingItem.findFirst({
    where: {
      id: req.params.id,
      shoppingList: { userId: req.userId! },
    },
  });
  if (!item) return res.status(404).json({ error: "Item not found" });
  await prisma.shoppingItem.delete({ where: { id: item.id } });
  res.status(204).send();
});
