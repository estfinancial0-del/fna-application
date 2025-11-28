import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar, datetime, decimal, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Main FNA submission table - one record per client submission
 */
export const fnaSubmissions = mysqlTable("fna_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Links to users table
  status: mysqlEnum("status", ["draft", "submitted", "reviewed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  submittedAt: timestamp("submittedAt"),
});

export type FnaSubmission = typeof fnaSubmissions.$inferSelect;
export type InsertFnaSubmission = typeof fnaSubmissions.$inferInsert;

/**
 * Client Details & Appointment Information
 */
export const clientDetails = mysqlTable("client_details", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  clientName: varchar("clientName", { length: 255 }),
  clientManager: varchar("clientManager", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  appointmentDate: datetime("appointmentDate"),
  appointmentTime: varchar("appointmentTime", { length: 20 }),
  appointmentLocation: text("appointmentLocation"),
});

export type ClientDetails = typeof clientDetails.$inferSelect;
export type InsertClientDetails = typeof clientDetails.$inferInsert;

/**
 * Payment & Agreement Information
 */
export const paymentAgreement = mysqlTable("payment_agreement", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "cheque", "credit_card", "eftpos"]),
  fullName: varchar("fullName", { length: 255 }),
  paymentDescription: varchar("paymentDescription", { length: 255 }),
  cardHolderName: varchar("cardHolderName", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  cardType: varchar("cardType", { length: 50 }),
  cardNumber: varchar("cardNumber", { length: 19 }),
  cardExpiry: varchar("cardExpiry", { length: 5 }),
  agree290Payment: boolean("agree290Payment").default(false),
  agreeRefundPolicy: boolean("agreeRefundPolicy").default(false),
  agreeBringDocuments: boolean("agreeBringDocuments").default(false),
  agree2Hours: boolean("agree2Hours").default(false),
  clientName1: varchar("clientName1", { length: 255 }),
  clientSignature1: text("clientSignature1"),
  clientDate1: date("clientDate1"),
  clientName2: varchar("clientName2", { length: 255 }),
  clientSignature2: text("clientSignature2"),
  clientDate2: date("clientDate2"),
});

export type PaymentAgreement = typeof paymentAgreement.$inferSelect;
export type InsertPaymentAgreement = typeof paymentAgreement.$inferInsert;

/**
 * Financial Goals - Wealth Creation (Important/Interested/Not Important)
 */
export const wealthCreationGoals = mysqlTable("wealth_creation_goals", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  saveForGoal: mysqlEnum("saveForGoal", ["important", "interested", "not_important"]),
  payOffDebt: mysqlEnum("payOffDebt", ["important", "interested", "not_important"]),
  reduceTax: mysqlEnum("reduceTax", ["important", "interested", "not_important"]),
  salaryPackaging: mysqlEnum("salaryPackaging", ["important", "interested", "not_important"]),
  superControl: mysqlEnum("superControl", ["important", "interested", "not_important"]),
  investMoney: mysqlEnum("investMoney", ["important", "interested", "not_important"]),
  investShares: mysqlEnum("investShares", ["important", "interested", "not_important"]),
  investProperty: mysqlEnum("investProperty", ["important", "interested", "not_important"]),
  retirementPlanning: mysqlEnum("retirementPlanning", ["important", "interested", "not_important"]),
  centrelinkBenefits: mysqlEnum("centrelinkBenefits", ["important", "interested", "not_important"]),
  moneyLastLonger: mysqlEnum("moneyLastLonger", ["important", "interested", "not_important"]),
});

export type WealthCreationGoals = typeof wealthCreationGoals.$inferSelect;
export type InsertWealthCreationGoals = typeof wealthCreationGoals.$inferInsert;

/**
 * Financial Goals - Wealth Protection
 */
export const wealthProtectionGoals = mysqlTable("wealth_protection_goals", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  familySecure: mysqlEnum("familySecure", ["important", "interested", "not_important"]),
  manageSickness: mysqlEnum("manageSickness", ["important", "interested", "not_important"]),
  inheritance: mysqlEnum("inheritance", ["important", "interested", "not_important"]),
  employmentChange: mysqlEnum("employmentChange", ["important", "interested", "not_important"]),
  recentEvent: mysqlEnum("recentEvent", ["important", "interested", "not_important"]),
  familyChange: mysqlEnum("familyChange", ["important", "interested", "not_important"]),
});

export type WealthProtectionGoals = typeof wealthProtectionGoals.$inferSelect;
export type InsertWealthProtectionGoals = typeof wealthProtectionGoals.$inferInsert;

/**
 * Lifestyle & Aspirations (open-ended text fields)
 */
export const lifestyleAspirations = mysqlTable("lifestyle_aspirations", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  importantThings: text("importantThings"),
  whyImportant: text("whyImportant"),
  currentConcerns: text("currentConcerns"),
  mustChange: text("mustChange"),
  wantToChange: text("wantToChange"),
  financialDreams: text("financialDreams"),
  hobbiesActivities: text("hobbiesActivities"),
});

export type LifestyleAspirations = typeof lifestyleAspirations.$inferSelect;
export type InsertLifestyleAspirations = typeof lifestyleAspirations.$inferInsert;

/**
 * Retirement Planning
 */
export const retirementPlanning = mysqlTable("retirement_planning", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  estimatedRetirementAge: int("estimatedRetirementAge"),
  currentAge: int("currentAge"),
  yearsBeforeRetirement: int("yearsBeforeRetirement"),
  yearsInRetirement: int("yearsInRetirement"),
  desiredYearlyIncome: int("desiredYearlyIncome"),
  totalAmountRequired: int("totalAmountRequired"),
  superannuation: int("superannuation"),
  savings: int("savings"),
  sharesBonds: int("sharesBonds"),
  equityNotHome: int("equityNotHome"),
  otherAssets: int("otherAssets"),
  totalProvisions: int("totalProvisions"),
  retirementShortfall: int("retirementShortfall"),
  amountNeededYearly: int("amountNeededYearly"),
  amountNeededWeekly: int("amountNeededWeekly"),
});

export type RetirementPlanning = typeof retirementPlanning.$inferSelect;
export type InsertRetirementPlanning = typeof retirementPlanning.$inferInsert;

/**
 * Personal Details - supports 2 clients
 */
export const personalDetails = mysqlTable("personal_details", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  clientNumber: int("clientNumber").notNull(), // 1 or 2
  title: varchar("title", { length: 20 }),
  surname: varchar("surname", { length: 100 }),
  givenNames: varchar("givenNames", { length: 100 }),
  dateOfBirth: datetime("dateOfBirth"),
  homeAddress: text("homeAddress"),
  postcode: varchar("postcode", { length: 10 }),
  yearMovedIn: int("yearMovedIn"),
  livingStatus: varchar("livingStatus", { length: 50 }),
  livingStatusValue: int("livingStatusValue"),
  previousAddress: text("previousAddress"),
  previousPostcode: varchar("previousPostcode", { length: 10 }),
  previousYearMovedIn: int("previousYearMovedIn"),
  bestContactNumber: varchar("bestContactNumber", { length: 50 }),
  emailAddress: varchar("emailAddress", { length: 320 }),
  maritalStatus: varchar("maritalStatus", { length: 50 }),
  typeOfEmployment: varchar("typeOfEmployment", { length: 50 }),
  employer: varchar("employer", { length: 255 }),
  dateStarted: datetime("dateStarted"),
  positionOccupation: varchar("positionOccupation", { length: 255 }),
  previousEmployer: varchar("previousEmployer", { length: 255 }),
  previousPosition: varchar("previousPosition", { length: 255 }),
  lengthOfEmployment: varchar("lengthOfEmployment", { length: 100 }),
  taxableIncome: int("taxableIncome"),
  lessSalarySacrifice: varchar("lessSalarySacrifice", { length: 100 }),
  additionalBenefits: text("additionalBenefits"),
  familyBenefits: text("familyBenefits"),
});

export type PersonalDetails = typeof personalDetails.$inferSelect;
export type InsertPersonalDetails = typeof personalDetails.$inferInsert;

/**
 * Financial Dependents
 */
export const financialDependents = mysqlTable("financial_dependents", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  name: varchar("name", { length: 255 }),
  dateOfBirth: datetime("dateOfBirth"),
  relationship: varchar("relationship", { length: 100 }),
  financiallyDependent: boolean("financiallyDependent"),
  untilAge: int("untilAge"),
  sex: varchar("sex", { length: 10 }),
});

export type FinancialDependents = typeof financialDependents.$inferSelect;
export type InsertFinancialDependents = typeof financialDependents.$inferInsert;

/**
 * Assets and Liabilities
 */
export const assetsLiabilities = mysqlTable("assets_liabilities", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  assetType: varchar("assetType", { length: 100 }).notNull(),
  valueOfAsset: int("valueOfAsset"),
  amountOwing: int("amountOwing"),
  repayment: int("repayment"),
  frequency: varchar("frequency", { length: 50 }),
  lender: varchar("lender", { length: 255 }),
  rentAmount: int("rentAmount"), // For investment properties
});

export type AssetsLiabilities = typeof assetsLiabilities.$inferSelect;
export type InsertAssetsLiabilities = typeof assetsLiabilities.$inferInsert;

/**
 * Risk Management / Insurance
 */
export const riskManagement = mysqlTable("risk_management", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  clientNumber: int("clientNumber").notNull(), // 1 or 2
  lifeInsurance: boolean("lifeInsurance"),
  lifeInsuranceAmount: int("lifeInsuranceAmount"),
  tpdInsurance: boolean("tpdInsurance"),
  tpdInsuranceAmount: int("tpdInsuranceAmount"),
  incomeProtection: boolean("incomeProtection"),
  incomeProtectionAmount: int("incomeProtectionAmount"),
  traumaCover: boolean("traumaCover"),
  traumaCoverAmount: int("traumaCoverAmount"),
  smoker: boolean("smoker"),
  smokerAmount: int("smokerAmount"),
  riskManagementImportant: boolean("riskManagementImportant"),
  riskManagementAmount: int("riskManagementAmount"),
});

export type RiskManagement = typeof riskManagement.$inferSelect;
export type InsertRiskManagement = typeof riskManagement.$inferInsert;

/**
 * Investment Assets (shares, collectables, etc.)
 */
export const investmentAssets = mysqlTable("investment_assets", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  description: text("description"),
  owner: varchar("owner", { length: 255 }),
  amount: int("amount"),
});

export type InvestmentAssets = typeof investmentAssets.$inferSelect;
export type InsertInvestmentAssets = typeof investmentAssets.$inferInsert;

/**
 * Superannuation Accumulation Assets
 */
export const superannuationAssets = mysqlTable("superannuation_assets", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  description: text("description"),
  owner: varchar("owner", { length: 255 }),
  amount: int("amount"),
});

export type SuperannuationAssets = typeof superannuationAssets.$inferSelect;
export type InsertSuperannuationAssets = typeof superannuationAssets.$inferInsert;

/**
 * Pension and Annuity Assets
 */
export const pensionAnnuityAssets = mysqlTable("pension_annuity_assets", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  description: text("description"),
  owner: varchar("owner", { length: 255 }),
  amount: int("amount"),
});

export type PensionAnnuityAssets = typeof pensionAnnuityAssets.$inferSelect;
export type InsertPensionAnnuityAssets = typeof pensionAnnuityAssets.$inferInsert;

/**
 * Property Details
 */
export const propertyDetails = mysqlTable("property_details", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  propertyType: varchar("propertyType", { length: 100 }).notNull(), // Home, Investment Property 1, 2, 3
  yearPurchased: int("yearPurchased"),
  purchaseValue: int("purchaseValue"),
  loanType: varchar("loanType", { length: 100 }),
  fixedOrVariable: varchar("fixedOrVariable", { length: 50 }),
  interestRate: varchar("interestRate", { length: 20 }),
  titleNamePercentage: varchar("titleNamePercentage", { length: 100 }),
  suburb: varchar("suburb", { length: 255 }),
});

export type PropertyDetails = typeof propertyDetails.$inferSelect;
export type InsertPropertyDetails = typeof propertyDetails.$inferInsert;

/**
 * General Insurance
 */
export const generalInsurance = mysqlTable("general_insurance", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  insuranceType: varchar("insuranceType", { length: 100 }).notNull(), // Home and Contents, Car/Boat, Landlord
  hasInsurance: boolean("hasInsurance"),
  insuranceProvider: varchar("insuranceProvider", { length: 255 }),
  notes: text("notes"),
});

export type GeneralInsurance = typeof generalInsurance.$inferSelect;
export type InsertGeneralInsurance = typeof generalInsurance.$inferInsert;

/**
 * Credit Impairments
 */
export const creditImpairments = mysqlTable("credit_impairments", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  details: text("details"),
});

export type CreditImpairments = typeof creditImpairments.$inferSelect;
export type InsertCreditImpairments = typeof creditImpairments.$inferInsert;

/**
 * Self-Employment Information
 */
export const selfEmploymentInfo = mysqlTable("self_employment_info", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  businessStructure: varchar("businessStructure", { length: 100 }), // Sole Trader, Partnership, Company, Trust
  businessName: varchar("businessName", { length: 255 }),
  abn: varchar("abn", { length: 50 }),
  taxYear1: varchar("taxYear1", { length: 20 }),
  taxYear1Completed: boolean("taxYear1Completed"),
  taxYear2: varchar("taxYear2", { length: 20 }),
  taxYear2Completed: boolean("taxYear2Completed"),
  furtherInfo: text("furtherInfo"),
  grossTurnover1: int("grossTurnover1"),
  grossTurnover2: int("grossTurnover2"),
  lessExpenses1: int("lessExpenses1"),
  lessExpenses2: int("lessExpenses2"),
  netProfitLoss1: int("netProfitLoss1"),
  netProfitLoss2: int("netProfitLoss2"),
  taxableIncome1: int("taxableIncome1"),
  taxableIncome2: int("taxableIncome2"),
  interest1: int("interest1"),
  interest2: int("interest2"),
  depreciation1: int("depreciation1"),
  depreciation2: int("depreciation2"),
  superannuation1: int("superannuation1"),
  superannuation2: int("superannuation2"),
  accountantName: varchar("accountantName", { length: 255 }),
  accountantPhone: varchar("accountantPhone", { length: 50 }),
  accountantFirm: varchar("accountantFirm", { length: 255 }),
  accountantEmail: varchar("accountantEmail", { length: 320 }),
});

export type SelfEmploymentInfo = typeof selfEmploymentInfo.$inferSelect;
export type InsertSelfEmploymentInfo = typeof selfEmploymentInfo.$inferInsert;

/**
 * Annual Expenses - Major Costs Per Year
 */
export const annualExpenses = mysqlTable("annual_expenses", {
  id: int("id").autoincrement().primaryKey(),
  fnaSubmissionId: int("fnaSubmissionId").notNull(),
  expenseCategory: varchar("expenseCategory", { length: 100 }).notNull(),
  expenseItem: varchar("expenseItem", { length: 255 }).notNull(),
  perWeek: int("perWeek"),
  perMonth: int("perMonth"),
  perYear: int("perYear"),
});

export type AnnualExpenses = typeof annualExpenses.$inferSelect;
export type InsertAnnualExpenses = typeof annualExpenses.$inferInsert;
