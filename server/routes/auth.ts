import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { generateToken } from "../middleware/auth.js";

export const authRoutes = Router();

const registerSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["WIFE", "HUSBAND", "KID", "SERVICE_PROVIDER", "COMPANY", "ADMIN"]).default("WIFE"),
});

const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(1),
});

authRoutes.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    if (!data.email && !data.phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }

    const existing = data.email
      ? await prisma.user.findUnique({ where: { email: data.email } })
      : await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existing) {
      return res.status(400).json({ error: "User already exists with this email/phone" });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        name: data.name,
        role: data.role,
      },
    });

    const token = generateToken(user.id, user.role);
    res.json({
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name, role: user.role, isVerified: user.isVerified },
      token,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    console.error("Register error:", e);
    const msg = e instanceof Error ? e.message : String(e);
    const hint =
      !process.env.DATABASE_URL
        ? "DATABASE_URL not set in Netlify env"
        : msg.includes("connect") || msg.includes("ECONNREFUSED")
          ? "Database unreachable - check DATABASE_URL"
          : msg.includes("JWT") || msg.includes("secret")
            ? "JWT_SECRET not set in Netlify env"
            : msg.includes("prisma") || msg.includes("Cannot find module")
              ? "Prisma client load failed - check Netlify deploy logs"
              : undefined;
    res.status(500).json({ error: "Registration failed", hint, detail: msg });
  }
});

authRoutes.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    if (!data.email && !data.phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }

    const user = data.email
      ? await prisma.user.findUnique({ where: { email: data.email } })
      : await prisma.user.findUnique({ where: { phone: data.phone } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name, avatar: user.avatar, role: user.role, isVerified: user.isVerified, familyId: user.familyId },
      token,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors[0].message });
    }
    console.error("Login error:", e);
    const msg = e instanceof Error ? e.message : String(e);
    const hint =
      !process.env.DATABASE_URL
        ? "DATABASE_URL not set in Netlify env"
        : msg.includes("connect") || msg.includes("ECONNREFUSED")
          ? "Database unreachable - check DATABASE_URL"
          : msg.includes("JWT") || msg.includes("secret")
            ? "JWT_SECRET not set in Netlify env"
            : msg.includes("prisma") || msg.includes("Cannot find module")
              ? "Prisma client load failed - check Netlify deploy logs"
              : undefined;
    res.status(500).json({ error: "Login failed", hint, detail: msg });
  }
});
