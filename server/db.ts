import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  InsertUser,
  users,
  fnaSubmissions,
  InsertFnaSubmission,
  FnaSubmission,
  clientDetails,
  InsertClientDetails,
  paymentAgreement,
  InsertPaymentAgreement,
  wealthCreationGoals,
  InsertWealthCreationGoals,
  wealthProtectionGoals,
  InsertWealthProtectionGoals,
  lifestyleAspirations,
  InsertLifestyleAspirations,
  retirementPlanning,
  InsertRetirementPlanning,
  personalDetails,
  InsertPersonalDetails,
  financialDependents,
  InsertFinancialDependents,
  assetsLiabilities,
  InsertAssetsLiabilities,
  riskManagement,
  InsertRiskManagement,
  investmentAssets,
  InsertInvestmentAssets,
  superannuationAssets,
  InsertSuperannuationAssets,
  pensionAnnuityAssets,
  InsertPensionAnnuityAssets,
  propertyDetails,
  InsertPropertyDetails,
  generalInsurance,
  InsertGeneralInsurance,
  creditImpairments,
  InsertCreditImpairments,
  selfEmploymentInfo,
  InsertSelfEmploymentInfo,
  annualExpenses,
  InsertAnnualExpenses,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Create connection pool with SSL enabled for TiDB Cloud
      const pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: true
        }
      });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function makeUserAdmin(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.update(users)
    .set({ role: "admin" })
    .where(eq(users.email, email));

  return { success: true, message: "User is now an admin" };
}

// ============================================================================
// FNA Submission Functions
// ============================================================================

/**
 * Create a new FNA submission (draft)
 */
export async function createFnaSubmission(userId: number): Promise<FnaSubmission> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(fnaSubmissions).values({
    userId,
    status: "draft",
  });

  const insertedId = Number(result[0].insertId);
  const submissions = await db.select().from(fnaSubmissions).where(eq(fnaSubmissions.id, insertedId)).limit(1);
  
  if (submissions.length === 0) {
    throw new Error("Failed to create FNA submission");
  }

  return submissions[0];
}

/**
 * Get all FNA submissions for a user
 */
export async function getUserFnaSubmissions(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(fnaSubmissions).where(eq(fnaSubmissions.userId, userId));
}

/**
 * Get all FNA submissions (admin only)
 */
export async function getAllFnaSubmissions() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  // Join with client details to get client name, email, phone
  const submissions = await db
    .select({
      id: fnaSubmissions.id,
      userId: fnaSubmissions.userId,
      status: fnaSubmissions.status,
      createdAt: fnaSubmissions.createdAt,
      submittedAt: fnaSubmissions.submittedAt,
      clientName: clientDetails.clientName,
      email: clientDetails.email,
      phone: clientDetails.phone,
    })
    .from(fnaSubmissions)
    .leftJoin(clientDetails, eq(fnaSubmissions.id, clientDetails.fnaSubmissionId))
    .orderBy(desc(fnaSubmissions.createdAt));

  return submissions;
}

/**
 * Get a specific FNA submission by ID
 */
export async function getFnaSubmissionById(submissionId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(fnaSubmissions).where(eq(fnaSubmissions.id, submissionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update FNA submission status
 */
export async function updateFnaSubmissionStatus(submissionId: number, status: "draft" | "submitted" | "reviewed") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const updateData: any = { status };
  if (status === "submitted") {
    updateData.submittedAt = new Date();
  }

  await db.update(fnaSubmissions).set(updateData).where(eq(fnaSubmissions.id, submissionId));
}

// ============================================================================
// Client Details Functions
// ============================================================================

export async function upsertClientDetails(data: InsertClientDetails) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(clientDetails)
    .where(eq(clientDetails.fnaSubmissionId, data.fnaSubmissionId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(clientDetails).set(data).where(eq(clientDetails.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(clientDetails).values(data);
    return Number(result[0].insertId);
  }
}

export async function getClientDetails(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(clientDetails)
    .where(eq(clientDetails.fnaSubmissionId, fnaSubmissionId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// Payment & Agreement Functions
// ============================================================================

export async function upsertPaymentAgreement(data: InsertPaymentAgreement) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(paymentAgreement)
    .where(eq(paymentAgreement.fnaSubmissionId, data.fnaSubmissionId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(paymentAgreement).set(data).where(eq(paymentAgreement.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(paymentAgreement).values(data);
    return Number(result[0].insertId);
  }
}

export async function getPaymentAgreement(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(paymentAgreement)
    .where(eq(paymentAgreement.fnaSubmissionId, fnaSubmissionId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// Wealth Creation Goals Functions
// ============================================================================

export async function upsertWealthCreationGoals(data: InsertWealthCreationGoals) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(wealthCreationGoals)
    .where(eq(wealthCreationGoals.fnaSubmissionId, data.fnaSubmissionId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(wealthCreationGoals).set(data).where(eq(wealthCreationGoals.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(wealthCreationGoals).values(data);
    return Number(result[0].insertId);
  }
}

export async function getWealthCreationGoals(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(wealthCreationGoals)
    .where(eq(wealthCreationGoals.fnaSubmissionId, fnaSubmissionId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// Wealth Protection Goals Functions
// ============================================================================

export async function upsertWealthProtectionGoals(data: InsertWealthProtectionGoals) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(wealthProtectionGoals)
    .where(eq(wealthProtectionGoals.fnaSubmissionId, data.fnaSubmissionId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(wealthProtectionGoals).set(data).where(eq(wealthProtectionGoals.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(wealthProtectionGoals).values(data);
    return Number(result[0].insertId);
  }
}

export async function getWealthProtectionGoals(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(wealthProtectionGoals)
    .where(eq(wealthProtectionGoals.fnaSubmissionId, fnaSubmissionId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// Lifestyle Aspirations Functions
// ============================================================================

export async function upsertLifestyleAspirations(data: InsertLifestyleAspirations) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(lifestyleAspirations)
    .where(eq(lifestyleAspirations.fnaSubmissionId, data.fnaSubmissionId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(lifestyleAspirations).set(data).where(eq(lifestyleAspirations.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(lifestyleAspirations).values(data);
    return Number(result[0].insertId);
  }
}

export async function getLifestyleAspirations(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(lifestyleAspirations)
    .where(eq(lifestyleAspirations.fnaSubmissionId, fnaSubmissionId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// Retirement Planning Functions
// ============================================================================

export async function upsertRetirementPlanning(data: InsertRetirementPlanning) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(retirementPlanning)
    .where(eq(retirementPlanning.fnaSubmissionId, data.fnaSubmissionId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(retirementPlanning).set(data).where(eq(retirementPlanning.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(retirementPlanning).values(data);
    return Number(result[0].insertId);
  }
}

export async function getRetirementPlanning(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(retirementPlanning)
    .where(eq(retirementPlanning.fnaSubmissionId, fnaSubmissionId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// Personal Details Functions (supports 2 clients)
// ============================================================================

export async function upsertPersonalDetails(data: InsertPersonalDetails) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(personalDetails)
    .where(and(
      eq(personalDetails.fnaSubmissionId, data.fnaSubmissionId),
      eq(personalDetails.clientNumber, data.clientNumber)
    ))
    .limit(1);

  if (existing.length > 0) {
    await db.update(personalDetails).set(data).where(eq(personalDetails.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(personalDetails).values(data);
    return Number(result[0].insertId);
  }
}

export async function getPersonalDetailsByClient(fnaSubmissionId: number, clientNumber: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(personalDetails)
    .where(and(
      eq(personalDetails.fnaSubmissionId, fnaSubmissionId),
      eq(personalDetails.clientNumber, clientNumber)
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllPersonalDetails(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(personalDetails)
    .where(eq(personalDetails.fnaSubmissionId, fnaSubmissionId));
}

// ============================================================================
// Financial Dependents Functions
// ============================================================================

export async function addFinancialDependent(data: InsertFinancialDependents) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(financialDependents).values(data);
  return Number(result[0].insertId);
}

export async function getFinancialDependents(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(financialDependents)
    .where(eq(financialDependents.fnaSubmissionId, fnaSubmissionId));
}

export async function deleteFinancialDependent(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(financialDependents).where(eq(financialDependents.id, id));
}

// ============================================================================
// Assets & Liabilities Functions
// ============================================================================

export async function addAssetLiability(data: InsertAssetsLiabilities) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(assetsLiabilities).values(data);
  return Number(result[0].insertId);
}

export async function getAssetsLiabilities(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(assetsLiabilities)
    .where(eq(assetsLiabilities.fnaSubmissionId, fnaSubmissionId));
}

export async function deleteAssetLiability(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(assetsLiabilities).where(eq(assetsLiabilities.id, id));
}

// Similar pattern functions for other tables...
// (Risk Management, Investment Assets, Superannuation, Pension, Property, Insurance, etc.)
// These follow the same add/get/delete pattern as above

export async function upsertSelfEmploymentInfo(data: InsertSelfEmploymentInfo) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(selfEmploymentInfo)
    .where(eq(selfEmploymentInfo.fnaSubmissionId, data.fnaSubmissionId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(selfEmploymentInfo).set(data).where(eq(selfEmploymentInfo.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(selfEmploymentInfo).values(data);
    return Number(result[0].insertId);
  }
}

export async function getSelfEmploymentInfo(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(selfEmploymentInfo)
    .where(eq(selfEmploymentInfo.fnaSubmissionId, fnaSubmissionId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function addAnnualExpense(data: InsertAnnualExpenses) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(annualExpenses).values(data);
  return Number(result[0].insertId);
}

export async function getAnnualExpenses(fnaSubmissionId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(annualExpenses)
    .where(eq(annualExpenses.fnaSubmissionId, fnaSubmissionId));
}

export async function deleteAnnualExpense(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(annualExpenses).where(eq(annualExpenses.id, id));
}

// ============================================================================
// Risk Management / Insurance
// ============================================================================

export async function upsertRiskManagement(data: {
  fnaSubmissionId: number;
  clientNumber: number;
  lifeInsurance?: boolean;
  lifeInsuranceAmount?: number;
  tpdInsurance?: boolean;
  tpdInsuranceAmount?: number;
  incomeProtection?: boolean;
  incomeProtectionAmount?: number;
  traumaCover?: boolean;
  traumaCoverAmount?: number;
  smoker?: boolean;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existing = await db.select().from(riskManagement)
    .where(and(
      eq(riskManagement.fnaSubmissionId, data.fnaSubmissionId),
      eq(riskManagement.clientNumber, data.clientNumber)
    ))
    .limit(1);

  if (existing.length > 0) {
    await db.update(riskManagement).set(data).where(eq(riskManagement.id, existing[0].id));
    return { id: existing[0].id };
  } else {
    const result = await db.insert(riskManagement).values(data);
    return { id: Number(result[0].insertId) };
  }
}

export async function getRiskManagement(fnaSubmissionId: number, clientNumber: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(riskManagement)
    .where(and(
      eq(riskManagement.fnaSubmissionId, fnaSubmissionId),
      eq(riskManagement.clientNumber, clientNumber)
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}
