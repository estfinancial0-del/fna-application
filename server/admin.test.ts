import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createRegularUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Admin Dashboard", () => {
  it("should allow admin to get all submissions", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Should not throw error for admin
    const result = await caller.fna.getAllSubmissions();
    
    expect(Array.isArray(result)).toBe(true);
  });

  it("should prevent non-admin from accessing getAllSubmissions", async () => {
    const { ctx } = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    // Should throw FORBIDDEN error for non-admin
    await expect(caller.fna.getAllSubmissions()).rejects.toThrow("Admin access required");
  });

  it("should create and retrieve FNA submission", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a submission
    const submission = await caller.fna.createSubmission();
    expect(submission.id).toBeDefined();
    expect(submission.status).toBe("draft");

    // Retrieve all submissions
    const allSubmissions = await caller.fna.getAllSubmissions();
    expect(allSubmissions.length).toBeGreaterThan(0);
    
    const found = allSubmissions.find((s: any) => s.id === submission.id);
    expect(found).toBeDefined();
  });
});
