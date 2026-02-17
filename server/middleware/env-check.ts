import { Request, Response, NextFunction } from "express";

const PLACEHOLDERS = ["HOST", "__PASSWORD__", "__HOST__", "YOUR_", "password@localhost"];

function isInvalidDbUrl(url: string | undefined): boolean {
  if (!url || typeof url !== "string" || url.trim().length === 0) return true;
  const lower = url.toLowerCase();
  return PLACEHOLDERS.some((p) => lower.includes(p.toLowerCase()));
}

export function envCheckMiddleware(_req: Request, res: Response, next: NextFunction) {
  if (!process.env.DATABASE_URL || isInvalidDbUrl(process.env.DATABASE_URL)) {
    return res.status(503).json({
      error: "Server misconfigured",
      hint: "DATABASE_URL is missing or has a placeholder. In Netlify: Site Settings > Environment Variables > Add DATABASE_URL with your Neon PostgreSQL connection string.",
      fix: "Get your connection string from https://console.neon.tech → your project → Connection string",
    });
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
    return res.status(503).json({
      error: "Server misconfigured",
      hint: "JWT_SECRET is missing or too short. In Netlify: Site Settings > Environment Variables > Add JWT_SECRET (run: openssl rand -base64 32)",
    });
  }
  next();
}
