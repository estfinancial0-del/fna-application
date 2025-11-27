import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export function registerSimpleAuthRoutes(app: Express) {
  // Simple login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    // Get credentials from environment variables
    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Simple credential check
    if (username !== validUsername || password !== validPassword) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    try {
      // Create a simple user ID based on username
      const openId = `simple-auth-${username}`;

      // Upsert user in database
      await db.upsertUser({
        openId,
        name: username,
        email: null,
        loginMethod: "simple",
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await sdk.createSessionToken(openId, {
        name: username,
        expiresInMs: ONE_YEAR_MS,
      });

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true });
    } catch (error) {
      console.error("[SimpleAuth] Login failed", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
}
