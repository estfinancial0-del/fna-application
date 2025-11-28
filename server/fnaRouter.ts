import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { extractContactFromFNA, syncContactToGoHighLevel, triggerWorkflow } from "./gohighlevel";
import { TRPCError } from "@trpc/server";
import { notifyAdvisorOfNewFna, logClientConfirmation } from "./emailNotifications";

/**
 * Retirement calculation helper
 * Ported from the original script.js logic
 */
function calculateRetirementMetrics(data: {
  currentAge?: number;
  estimatedRetirementAge?: number;
  desiredYearlyIncome?: number;
  superannuation?: number;
  savings?: number;
  sharesBonds?: number;
  equityNotHome?: number;
  otherAssets?: number;
}) {
  const currentAge = data.currentAge || 0;
  const retirementAge = data.estimatedRetirementAge || 65;
  const yearlyIncome = data.desiredYearlyIncome || 0;
  
  const yearsBeforeRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, 85 - retirementAge);
  const totalAmountRequired = yearlyIncome * yearsInRetirement;
  
  const totalProvisions = 
    (data.superannuation || 0) +
    (data.savings || 0) +
    (data.sharesBonds || 0) +
    (data.equityNotHome || 0) +
    (data.otherAssets || 0);
  
  const retirementShortfall = Math.max(0, totalAmountRequired - totalProvisions);
  const amountNeededYearly = yearsBeforeRetirement > 0 ? retirementShortfall / yearsBeforeRetirement : 0;
  const amountNeededWeekly = amountNeededYearly / 52;
  
  return {
    yearsBeforeRetirement,
    yearsInRetirement,
    totalAmountRequired,
    totalProvisions,
    retirementShortfall,
    amountNeededYearly: Math.round(amountNeededYearly),
    amountNeededWeekly: Math.round(amountNeededWeekly),
  };
}

/**
 * Admin-only procedure
 */
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const fnaRouter = router({
  // ============================================================================
  // FNA Submission Management
  // ============================================================================
  
  createSubmission: protectedProcedure
    .mutation(async ({ ctx }) => {
      return await db.createFnaSubmission(ctx.user.id);
    }),

  getMySubmissions: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.getUserFnaSubmissions(ctx.user.id);
    }),

  getAllSubmissions: adminProcedure
    .query(async () => {
      return await db.getAllFnaSubmissions();
    }),

  getSubmission: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ input }) => {
      return await db.getFnaSubmissionById(input.submissionId);
    }),

  submitFna: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .mutation(async ({ input }) => {
      await db.updateFnaSubmissionStatus(input.submissionId, "submitted");
      
      // Sync to GoHighLevel CRM
      const clientDetails = await db.getClientDetails(input.submissionId);
      if (clientDetails) {
        const contactData = extractContactFromFNA({
          clientName: clientDetails.clientName || undefined,
          email: clientDetails.email || undefined,
          phone: clientDetails.phone || undefined,
        });
        
        const ghlResult = await syncContactToGoHighLevel(contactData);
        if (ghlResult.success) {
          console.log("[FNA] Contact synced to GoHighLevel:", ghlResult.contactId);
          
          // Trigger GoHighLevel workflow for SMS/email notifications
          if (ghlResult.contactId) {
            const workflowResult = await triggerWorkflow(ghlResult.contactId);
            if (workflowResult.success) {
              console.log("[FNA] GoHighLevel workflow triggered for contact:", ghlResult.contactId);
            } else {
              console.warn("[FNA] Failed to trigger GoHighLevel workflow:", workflowResult.error);
            }
          }
        } else {
          console.warn("[FNA] Failed to sync to GoHighLevel:", ghlResult.error);
        }
        
        // Send email notifications
        const notificationData = {
          clientName: clientDetails.clientName || "Unknown Client",
          email: clientDetails.email || "",
          phone: clientDetails.phone || "",
          clientManager: clientDetails.clientManager || "Unassigned",
          submissionId: input.submissionId,
        };
        
        // Notify advisor
        const advisorNotified = await notifyAdvisorOfNewFna(notificationData);
        if (!advisorNotified) {
          console.warn("[FNA] Failed to send advisor notification");
        }
        
        // Log client confirmation (in production, this would send an actual email)
        logClientConfirmation(notificationData);
      }
      
      return { success: true };
    }),

  // ============================================================================
  // Client Details
  // ============================================================================
  
  saveClientDetails: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      clientName: z.string().optional(),
      clientManager: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional().refine(
        (val) => {
          if (!val || val === "") return true;
          // Split by comma and validate each email
          const emails = val.split(',').map(e => e.trim());
          const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
          return emails.every(email => emailRegex.test(email));
        },
        { message: "Invalid email address(es)" }
      ),
      appointmentDate: z.date().optional(),
      appointmentTime: z.string().optional(),
      appointmentLocation: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.upsertClientDetails(input);
      return { id };
    }),

  getClientDetails: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      const result = await db.getClientDetails(input.fnaSubmissionId);
      return result ?? null;
    }),

  // ============================================================================
  // Financial Goals
  // ============================================================================
  
  saveWealthCreationGoals: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      saveForGoal: z.enum(["important", "interested", "not_important"]).optional(),
      payOffDebt: z.enum(["important", "interested", "not_important"]).optional(),
      reduceTax: z.enum(["important", "interested", "not_important"]).optional(),
      salaryPackaging: z.enum(["important", "interested", "not_important"]).optional(),
      superControl: z.enum(["important", "interested", "not_important"]).optional(),
      investMoney: z.enum(["important", "interested", "not_important"]).optional(),
      investShares: z.enum(["important", "interested", "not_important"]).optional(),
      investProperty: z.enum(["important", "interested", "not_important"]).optional(),
      retirementPlanning: z.enum(["important", "interested", "not_important"]).optional(),
      centrelinkBenefits: z.enum(["important", "interested", "not_important"]).optional(),
      moneyLastLonger: z.enum(["important", "interested", "not_important"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.upsertWealthCreationGoals(input);
      return { id };
    }),

  getWealthCreationGoals: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      const result = await db.getWealthCreationGoals(input.fnaSubmissionId);
      return result ?? null;
    }),

  saveWealthProtectionGoals: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      familySecure: z.enum(["important", "interested", "not_important"]).optional(),
      manageSickness: z.enum(["important", "interested", "not_important"]).optional(),
      inheritance: z.enum(["important", "interested", "not_important"]).optional(),
      employmentChange: z.enum(["important", "interested", "not_important"]).optional(),
      recentEvent: z.enum(["important", "interested", "not_important"]).optional(),
      familyChange: z.enum(["important", "interested", "not_important"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.upsertWealthProtectionGoals(input);
      return { id };
    }),

  getWealthProtectionGoals: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      const result = await db.getWealthProtectionGoals(input.fnaSubmissionId);
      return result ?? null;
    }),

  // ============================================================================
  // Lifestyle & Aspirations
  // ============================================================================
  
  saveLifestyleAspirations: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      importantThings: z.string().optional(),
      whyImportant: z.string().optional(),
      currentConcerns: z.string().optional(),
      mustChange: z.string().optional(),
      wantToChange: z.string().optional(),
      financialDreams: z.string().optional(),
      hobbiesActivities: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.upsertLifestyleAspirations(input);
      return { id };
    }),

  getLifestyleAspirations: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      const result = await db.getLifestyleAspirations(input.fnaSubmissionId);
      return result ?? null;
    }),

  // ============================================================================
  // Retirement Planning (with calculations)
  // ============================================================================
  
  saveRetirementPlanning: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      estimatedRetirementAge: z.number().optional(),
      currentAge: z.number().optional(),
      desiredYearlyIncome: z.number().optional(),
      superannuation: z.number().optional(),
      savings: z.number().optional(),
      sharesBonds: z.number().optional(),
      equityNotHome: z.number().optional(),
      otherAssets: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      // Calculate all derived fields
      const calculated = calculateRetirementMetrics(input);
      
      const dataToSave = {
        ...input,
        ...calculated,
      };
      
      const id = await db.upsertRetirementPlanning(dataToSave);
      return { id, calculated };
    }),

  getRetirementPlanning: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      const result = await db.getRetirementPlanning(input.fnaSubmissionId);
      return result ?? null;
    }),

  // ============================================================================
  // Personal Details (supports 2 clients)
  // ============================================================================
  
  savePersonalDetails: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      clientNumber: z.number().min(1).max(2),
      title: z.string().optional(),
      surname: z.string().optional(),
      givenNames: z.string().optional(),
      dateOfBirth: z.date().optional(),
      homeAddress: z.string().optional(),
      postcode: z.string().optional(),
      yearMovedIn: z.number().optional(),
      livingStatus: z.string().optional(),
      livingStatusValue: z.number().optional(),
      previousAddress: z.string().optional(),
      previousPostcode: z.string().optional(),
      previousYearMovedIn: z.number().optional(),
      bestContactNumber: z.string().optional(),
      emailAddress: z.string().optional(),
      maritalStatus: z.string().optional(),
      typeOfEmployment: z.string().optional(),
      employer: z.string().optional(),
      dateStarted: z.date().optional(),
      positionOccupation: z.string().optional(),
      previousEmployer: z.string().optional(),
      previousPosition: z.string().optional(),
      lengthOfEmployment: z.string().optional(),
      taxableIncome: z.number().optional(),
      lessSalarySacrifice: z.string().optional(),
      additionalBenefits: z.string().optional(),
      familyBenefits: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.upsertPersonalDetails(input);
      return { id };
    }),

  getPersonalDetails: protectedProcedure
    .input(z.object({ 
      fnaSubmissionId: z.number(),
      clientNumber: z.number().min(1).max(2),
    }))
    .query(async ({ input }) => {
      const result = await db.getPersonalDetailsByClient(input.fnaSubmissionId, input.clientNumber);
      return result ?? null;
    }),

  getAllPersonalDetails: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAllPersonalDetails(input.fnaSubmissionId);
    }),

  // ============================================================================
  // Financial Dependents
  // ============================================================================
  
  addFinancialDependent: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      name: z.string().optional(),
      dateOfBirth: z.date().optional(),
      relationship: z.string().optional(),
      financiallyDependent: z.boolean().optional(),
      untilAge: z.number().optional(),
      sex: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.addFinancialDependent(input);
      return { id };
    }),

  getFinancialDependents: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      return await db.getFinancialDependents(input.fnaSubmissionId);
    }),

  deleteFinancialDependent: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteFinancialDependent(input.id);
      return { success: true };
    }),

  // ============================================================================
  // Assets & Liabilities
  // ============================================================================
  
  addAssetLiability: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      assetType: z.string(),
      valueOfAsset: z.number().optional(),
      amountOwing: z.number().optional(),
      repayment: z.number().optional(),
      frequency: z.string().optional(),
      lender: z.string().optional(),
      rentAmount: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.addAssetLiability(input);
      return { id };
    }),

  getAssetsLiabilities: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAssetsLiabilities(input.fnaSubmissionId);
    }),

  deleteAssetLiability: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteAssetLiability(input.id);
      return { success: true };
    }),

  // ============================================================================
  // Self-Employment Information
  // ============================================================================
  
  saveSelfEmploymentInfo: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      businessStructure: z.string().optional(),
      businessName: z.string().optional(),
      abn: z.string().optional(),
      taxYear1: z.string().optional(),
      taxYear1Completed: z.boolean().optional(),
      taxYear2: z.string().optional(),
      taxYear2Completed: z.boolean().optional(),
      furtherInfo: z.string().optional(),
      grossTurnover1: z.number().optional(),
      grossTurnover2: z.number().optional(),
      lessExpenses1: z.number().optional(),
      lessExpenses2: z.number().optional(),
      netProfitLoss1: z.number().optional(),
      netProfitLoss2: z.number().optional(),
      taxableIncome1: z.number().optional(),
      taxableIncome2: z.number().optional(),
      interest1: z.number().optional(),
      interest2: z.number().optional(),
      depreciation1: z.number().optional(),
      depreciation2: z.number().optional(),
      superannuation1: z.number().optional(),
      superannuation2: z.number().optional(),
      accountantName: z.string().optional(),
      accountantPhone: z.string().optional(),
      accountantFirm: z.string().optional(),
      accountantEmail: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.upsertSelfEmploymentInfo(input);
      return { id };
    }),

  getSelfEmploymentInfo: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      const result = await db.getSelfEmploymentInfo(input.fnaSubmissionId);
      return result ?? null;
    }),

  // ============================================================================
  // Annual Expenses
  // ============================================================================
  
  addAnnualExpense: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      expenseCategory: z.string(),
      expenseItem: z.string(),
      perWeek: z.number().optional(),
      perMonth: z.number().optional(),
      perYear: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = await db.addAnnualExpense(input);
      return { id };
    }),

  getAnnualExpenses: protectedProcedure
    .input(z.object({ fnaSubmissionId: z.number() }))
    .query(async ({ input }) => {
      return await db.getAnnualExpenses(input.fnaSubmissionId);
    }),

  deleteAnnualExpense: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteAnnualExpense(input.id);
      return { success: true };
    }),

  // ============================================================================
  // Risk Management / Insurance
  // ============================================================================

  saveRiskManagement: protectedProcedure
    .input(z.object({
      fnaSubmissionId: z.number(),
      clientNumber: z.number(),
      lifeInsurance: z.boolean().optional(),
      lifeInsuranceAmount: z.number().optional(),
      tpdInsurance: z.boolean().optional(),
      tpdInsuranceAmount: z.number().optional(),
      incomeProtection: z.boolean().optional(),
      incomeProtectionAmount: z.number().optional(),
      traumaCover: z.boolean().optional(),
      traumaCoverAmount: z.number().optional(),
      smoker: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return await db.upsertRiskManagement(input);
    }),

  getRiskManagement: protectedProcedure
    .input(z.object({ 
      fnaSubmissionId: z.number(),
      clientNumber: z.number(),
    }))
    .query(async ({ input }) => {
      return await db.getRiskManagement(input.fnaSubmissionId, input.clientNumber) || null;
    }),
});
