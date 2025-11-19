import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Risk Management", () => {
  it("should save and retrieve risk management data for client 1", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create submission
    const submission = await caller.fna.createSubmission();

    // Save risk management data
    const riskData = {
      fnaSubmissionId: submission.id,
      clientNumber: 1,
      lifeInsurance: true,
      lifeInsuranceAmount: 500000,
      tpdInsurance: true,
      tpdInsuranceAmount: 300000,
      incomeProtection: true,
      incomeProtectionAmount: 5000,
      traumaCover: false,
      traumaCoverAmount: 0,
      smoker: false,
    };

    const saved = await caller.fna.saveRiskManagement(riskData);
    expect(saved).toHaveProperty("id");

    // Retrieve and verify
    const retrieved = await caller.fna.getRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 1,
    });

    expect(retrieved).toBeDefined();
    expect(retrieved?.lifeInsurance).toBe(true);
    expect(retrieved?.lifeInsuranceAmount).toBe(500000);
    expect(retrieved?.tpdInsurance).toBe(true);
    expect(retrieved?.incomeProtection).toBe(true);
    expect(retrieved?.smoker).toBe(false);
  });

  it("should handle separate risk management data for client 2", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const submission = await caller.fna.createSubmission();

    // Save for client 1
    await caller.fna.saveRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 1,
      lifeInsurance: true,
      lifeInsuranceAmount: 500000,
      smoker: false,
    });

    // Save for client 2
    await caller.fna.saveRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 2,
      lifeInsurance: true,
      lifeInsuranceAmount: 400000,
      smoker: true,
    });

    // Retrieve both
    const client1 = await caller.fna.getRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 1,
    });

    const client2 = await caller.fna.getRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 2,
    });

    expect(client1?.lifeInsuranceAmount).toBe(500000);
    expect(client1?.smoker).toBe(false);
    expect(client2?.lifeInsuranceAmount).toBe(400000);
    expect(client2?.smoker).toBe(true);
  });

  it("should update existing risk management data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const submission = await caller.fna.createSubmission();

    // Initial save
    await caller.fna.saveRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 1,
      lifeInsurance: false,
      lifeInsuranceAmount: 0,
    });

    // Update
    await caller.fna.saveRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 1,
      lifeInsurance: true,
      lifeInsuranceAmount: 750000,
      traumaCover: true,
      traumaCoverAmount: 100000,
    });

    const retrieved = await caller.fna.getRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 1,
    });

    expect(retrieved?.lifeInsurance).toBe(true);
    expect(retrieved?.lifeInsuranceAmount).toBe(750000);
    expect(retrieved?.traumaCover).toBe(true);
    expect(retrieved?.traumaCoverAmount).toBe(100000);
  });

  it("should return null for non-existent risk management data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const submission = await caller.fna.createSubmission();

    const retrieved = await caller.fna.getRiskManagement({
      fnaSubmissionId: submission.id,
      clientNumber: 1,
    });

    expect(retrieved).toBeNull();
  });
});
