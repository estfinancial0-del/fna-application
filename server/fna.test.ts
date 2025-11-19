import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-fna",
    email: "fna-test@example.com",
    name: "FNA Test User",
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

describe("FNA Procedures", () => {
  let submissionId: number;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
    
    // Create a test submission
    const submission = await caller.fna.createSubmission();
    submissionId = submission.id;
  });

  it("creates a new FNA submission", async () => {
    const { ctx } = createAuthContext();
    const testCaller = appRouter.createCaller(ctx);
    
    const submission = await testCaller.fna.createSubmission();
    
    expect(submission).toBeDefined();
    expect(submission.id).toBeTypeOf("number");
    expect(submission.status).toBe("draft");
    expect(submission.userId).toBe(ctx.user!.id);
  });

  it("saves and retrieves client details", async () => {
    const clientData = {
      fnaSubmissionId: submissionId,
      clientName: "John Doe",
      clientManager: "Jane Smith",
      phone: "0412345678",
      email: "john.doe@example.com",
      appointmentDate: new Date("2025-12-01"),
      appointmentTime: "10:00 AM",
      appointmentLocation: "Sydney Office",
    };

    await caller.fna.saveClientDetails(clientData);
    const retrieved = await caller.fna.getClientDetails({ fnaSubmissionId: submissionId });

    expect(retrieved).toBeDefined();
    expect(retrieved?.clientName).toBe("John Doe");
    expect(retrieved?.clientManager).toBe("Jane Smith");
    expect(retrieved?.phone).toBe("0412345678");
    expect(retrieved?.email).toBe("john.doe@example.com");
  });

  it("saves and retrieves wealth creation goals", async () => {
    const goalsData = {
      fnaSubmissionId: submissionId,
      saveForGoal: "important" as const,
      payOffDebt: "interested" as const,
      reduceTax: "not_important" as const,
      retirementPlanning: "important" as const,
    };

    await caller.fna.saveWealthCreationGoals(goalsData);
    const retrieved = await caller.fna.getWealthCreationGoals({ fnaSubmissionId: submissionId });

    expect(retrieved).toBeDefined();
    expect(retrieved?.saveForGoal).toBe("important");
    expect(retrieved?.payOffDebt).toBe("interested");
    expect(retrieved?.reduceTax).toBe("not_important");
    expect(retrieved?.retirementPlanning).toBe("important");
  });

  it("saves and retrieves wealth protection goals", async () => {
    const protectionData = {
      fnaSubmissionId: submissionId,
      familySecure: "important" as const,
      manageSickness: "interested" as const,
      inheritance: "important" as const,
    };

    await caller.fna.saveWealthProtectionGoals(protectionData);
    const retrieved = await caller.fna.getWealthProtectionGoals({ fnaSubmissionId: submissionId });

    expect(retrieved).toBeDefined();
    expect(retrieved?.familySecure).toBe("important");
    expect(retrieved?.manageSickness).toBe("interested");
    expect(retrieved?.inheritance).toBe("important");
  });

  it("saves and retrieves lifestyle aspirations", async () => {
    const lifestyleData = {
      fnaSubmissionId: submissionId,
      importantThings: "Family and financial security",
      whyImportant: "To provide for my children's education",
      currentConcerns: "Rising cost of living",
      financialDreams: "Early retirement and travel",
    };

    await caller.fna.saveLifestyleAspirations(lifestyleData);
    const retrieved = await caller.fna.getLifestyleAspirations({ fnaSubmissionId: submissionId });

    expect(retrieved).toBeDefined();
    expect(retrieved?.importantThings).toBe("Family and financial security");
    expect(retrieved?.financialDreams).toBe("Early retirement and travel");
  });

  it("calculates retirement metrics correctly", async () => {
    const retirementData = {
      fnaSubmissionId: submissionId,
      currentAge: 35,
      estimatedRetirementAge: 65,
      desiredYearlyIncome: 80000,
      superannuation: 150000,
      savings: 50000,
      sharesBonds: 30000,
      equityNotHome: 0,
      otherAssets: 20000,
    };

    const result = await caller.fna.saveRetirementPlanning(retirementData);
    const retrieved = await caller.fna.getRetirementPlanning({ fnaSubmissionId: submissionId });

    expect(retrieved).toBeDefined();
    expect(retrieved?.currentAge).toBe(35);
    expect(retrieved?.estimatedRetirementAge).toBe(65);
    
    // Check calculated fields
    expect(retrieved?.yearsBeforeRetirement).toBe(30); // 65 - 35
    expect(retrieved?.yearsInRetirement).toBe(20); // 85 - 65
    expect(retrieved?.totalAmountRequired).toBe(1600000); // 80000 * 20
    expect(retrieved?.totalProvisions).toBe(250000); // Sum of all assets
    expect(retrieved?.retirementShortfall).toBe(1350000); // 1600000 - 250000
    expect(retrieved?.amountNeededYearly).toBe(45000); // 1350000 / 30
    expect(retrieved?.amountNeededWeekly).toBe(865); // 45000 / 52 (rounded)
  });

  it("saves and retrieves personal details for multiple clients", async () => {
    const client1Data = {
      fnaSubmissionId: submissionId,
      clientNumber: 1,
      surname: "Doe",
      givenNames: "John",
      dateOfBirth: new Date("1990-01-15"),
      email: "john@example.com",
      maritalStatus: "Married",
      employer: "ABC Corp",
    };

    const client2Data = {
      fnaSubmissionId: submissionId,
      clientNumber: 2,
      surname: "Doe",
      givenNames: "Jane",
      dateOfBirth: new Date("1992-03-20"),
      emailAddress: "jane@example.com",
      maritalStatus: "Married",
      employer: "XYZ Ltd",
    };

    await caller.fna.savePersonalDetails(client1Data);
    await caller.fna.savePersonalDetails(client2Data);

    const client1 = await caller.fna.getPersonalDetails({ 
      fnaSubmissionId: submissionId, 
      clientNumber: 1 
    });
    const client2 = await caller.fna.getPersonalDetails({ 
      fnaSubmissionId: submissionId, 
      clientNumber: 2 
    });

    expect(client1).toBeDefined();
    expect(client1?.surname).toBe("Doe");
    expect(client1?.givenNames).toBe("John");
    
    expect(client2).toBeDefined();
    expect(client2?.surname).toBe("Doe");
    expect(client2?.givenNames).toBe("Jane");
  });

  it("adds and retrieves financial dependents", async () => {
    const dependent1 = {
      fnaSubmissionId: submissionId,
      name: "Alice Doe",
      dateOfBirth: new Date("2015-06-10"),
      relationship: "Daughter",
      financiallyDependent: true,
      untilAge: 18,
      sex: "Female",
    };

    const dependent2 = {
      fnaSubmissionId: submissionId,
      name: "Bob Doe",
      dateOfBirth: new Date("2018-09-15"),
      relationship: "Son",
      financiallyDependent: true,
      untilAge: 18,
      sex: "Male",
    };

    await caller.fna.addFinancialDependent(dependent1);
    await caller.fna.addFinancialDependent(dependent2);

    const dependents = await caller.fna.getFinancialDependents({ fnaSubmissionId: submissionId });

    expect(dependents).toBeDefined();
    expect(dependents.length).toBeGreaterThanOrEqual(2);
    
    const alice = dependents.find(d => d.name === "Alice Doe");
    const bob = dependents.find(d => d.name === "Bob Doe");
    
    expect(alice).toBeDefined();
    expect(alice?.relationship).toBe("Daughter");
    expect(bob).toBeDefined();
    expect(bob?.relationship).toBe("Son");
  });

  it("submits FNA and updates status", async () => {
    const result = await caller.fna.submitFna({ submissionId });
    
    expect(result.success).toBe(true);
    
    const submission = await caller.fna.getSubmission({ submissionId });
    expect(submission?.status).toBe("submitted");
    expect(submission?.submittedAt).toBeDefined();
  });

  it("retrieves all user submissions", async () => {
    const submissions = await caller.fna.getMySubmissions();
    
    expect(submissions).toBeDefined();
    expect(Array.isArray(submissions)).toBe(true);
    expect(submissions.length).toBeGreaterThan(0);
    
    const testSubmission = submissions.find(s => s.id === submissionId);
    expect(testSubmission).toBeDefined();
  });
});
