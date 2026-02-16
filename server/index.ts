import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/users.js";
import { familyRoutes } from "./routes/family.js";
import { servicesRoutes } from "./routes/services.js";
import { providersRoutes } from "./routes/providers.js";
import { bookingsRoutes } from "./routes/bookings.js";
import { ordersRoutes } from "./routes/orders.js";
import { tasksRoutes } from "./routes/tasks.js";
import { expensesRoutes } from "./routes/expenses.js";
import { shoppingRoutes } from "./routes/shopping.js";
import { notificationsRoutes } from "./routes/notifications.js";
import { kidsRoutes } from "./routes/kids.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** API-only app for Netlify serverless (no static files) */
export function createApiApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  // Netlify: basePath strips /.netlify/functions/server, so path is /auth/register → /api/auth/register
  app.use((req, _res, next) => {
    if (!req.path.startsWith("/api/")) {
      req.url = "/api" + (req.path.startsWith("/") ? req.path : "/" + req.path);
    }
    next();
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/family", familyRoutes);
  app.use("/api/services", servicesRoutes);
  app.use("/api/providers", providersRoutes);
  app.use("/api/bookings", bookingsRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/tasks", tasksRoutes);
  app.use("/api/expenses", expensesRoutes);
  app.use("/api/shopping", shoppingRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/kids", kidsRoutes);
  app.get("/api/ping", (_req, res) => res.json({ status: "ok", ts: Date.now() }));
  app.get("/api/health", async (_req, res) => {
    try {
      const { prisma } = await import("./lib/prisma.js");
      await prisma.$queryRaw`SELECT 1`;
      res.json({ ok: true, db: "connected" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      res.status(500).json({ ok: false, db: "error", error: msg });
    }
  });

  return app;
}

/** Full app with static files for self-hosted / local */
export function createServer() {
  const app = createApiApp();
  if (process.env.NODE_ENV === "production" && !process.env.NETLIFY) {
    const distPath = path.join(__dirname, "../dist/client");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  return app;
}

// Only listen when run directly (not as Netlify function)
if (!process.env.NETLIFY) {
  const app = createServer();
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Home Queen API running on http://localhost:${PORT}`);
  });
}
