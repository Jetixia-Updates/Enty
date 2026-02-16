import { Router } from "express";
import { z } from "zod";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const expensesRoutes = Router();
const expenseSchema = z.object({
  amount: z.number().positive(),
  category: z.enum(["FOOD", "BILLS", "EDUCATION", "HEALTH", "TRANSPORT", "SHOPPING", "ENTERTAINMENT", "OTHER"]),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
});

expensesRoutes.use(authMiddleware);

expensesRoutes.get("/", async (req: AuthRequest, res) => {
  const { month, year } = req.query;
  const where: Record<string, unknown> = { userId: req.userId! };
  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
  });
  res.json(expenses);
});

expensesRoutes.get("/summary", async (req: AuthRequest, res) => {
  const month = req.query.month ? Number(req.query.month) : new Date().getMonth() + 1;
  const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const expenses = await prisma.expense.findMany({
    where: {
      userId: req.userId!,
      date: { gte: start, lte: end },
    },
  });

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  res.json({
    total: expenses.reduce((s, e) => s + e.amount, 0),
    byCategory,
    count: expenses.length,
  });
});

expensesRoutes.post("/", async (req: AuthRequest, res) => {
  try {
    const data = expenseSchema.parse(req.body);
    const expense = await prisma.expense.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        userId: req.userId!,
      },
    });
    res.status(201).json(expense);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    res.status(500).json({ error: "Failed to create expense" });
  }
});
