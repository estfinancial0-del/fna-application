/**
 * Vercel serverless function entry point
 * This file creates an Express app for API routes only
 * Static files are served by Vercel's CDN from .vercel/output/static/
 */

import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerSimpleAuthRoutes } from "./simpleAuth";
import { appRouter } from "../routers";
import { createContext } from "./context";

// Create Express app for API routes only
const app = express();

// Configure body parser with larger size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// OAuth callback under /api/oauth/callback
registerOAuthRoutes(app);

// Simple username/password authentication
registerSimpleAuthRoutes(app);

// tRPC API under /api/trpc
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export the Express app for Vercel
export default app;
