import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

// Parse users from environment variable
// Format: username1:password1,username2:password2,username3:password3
function getValidUsers(): Map<string, string> {
  const users = new Map<string, string>();
  
  const usersEnv = process.env.AUTH_USERS || "admin:admin123,user1:password1,user2:password2";
  
  const userPairs = usersEnv.split(',');
  for (const pair of userPairs) {
    const [username, password] = pair.split(':');
    if (username && password) {
      users.set(username.trim(), password.trim());
    }
  }
  
  return users;
}

export function registerSimpleAuthRoutes(app: Express) {
  // Simple login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    // Get valid users
    const validUsers = getValidUsers();

    // Check if username exists and password matches
    if (!validUsers.has(username) || validUsers.get(username) !== password) {
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
