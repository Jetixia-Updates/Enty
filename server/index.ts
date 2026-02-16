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
import { notificationsRoutes } from "./routes/notifications.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createServer() {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/family", familyRoutes);
  app.use("/api/services", servicesRoutes);
  app.use("/api/providers", providersRoutes);
  app.use("/api/bookings", bookingsRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/tasks", tasksRoutes);
  app.use("/api/expenses", expensesRoutes);
  app.use("/api/notifications", notificationsRoutes);

  // Health check
  app.get("/api/ping", (_req, res) => res.json({ status: "ok", ts: Date.now() }));

  // Vite dev server handles static in development
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "../dist/client");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

const app = createServer();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Home Queen API running on http://localhost:${PORT}`);
});
