/**
 * FNA Form Configuration
 * Toggle sections on/off to control form complexity
 */

export interface FnaConfig {
  // Step 5: Personal Details modules
  personalDetails: {
    basic: boolean; // Title, name, DOB, address
    previousAddress: boolean; // Previous address history
    employment: boolean; // Current employer details
    previousEmployment: boolean; // Previous employer
    salaryDetails: boolean; // Salary sacrifice, benefits
    livingStatus: boolean; // Owned/Mortgage/Renting with value
  };
  
  // Financial Dependents (separate step or part of Step 5)
  financialDependents: {
    enabled: boolean;
  };
  
  // Step 6: Assets & Liabilities modules
  assetsLiabilities: {
    basic: boolean; // Simple asset/liability table
    riskManagement: boolean; // Insurance details (Life, TPD, Income Protection, Trauma)
    investmentAssets: boolean; // Shares, collectables
    superannuationDetailed: boolean; // Fund name, member number, type
    pensionAnnuity: boolean; // Pension and annuity assets
    propertyDetailed: boolean; // Year purchased, loan type, interest rate, title %
    generalInsurance: boolean; // Home & Contents, Car, Landlord
    creditImpairments: boolean; // Known credit issues
  };
  
  // Step 7: Self-Employment modules
  selfEmployment: {
    basic: boolean; // Business name, ABN, structure
    taxReturns: boolean; // Last 2 years tax returns with breakdown
    accountantDetails: boolean; // Accountant contact info
  };
  
  // Step 8: Annual Expenses modules
  annualExpenses: {
    simplified: boolean; // Basic expense categories (10-15 items)
    comprehensive: boolean; // Full PDF version (100+ items with per week/month/year)
  };
}

/**
 * Default configuration - Start with essential fields only
 * Enable more modules as needed
 */
export const defaultFnaConfig: FnaConfig = {
  personalDetails: {
    basic: true,
    previousAddress: false, // Disable for simplicity
    employment: true,
    previousEmployment: false, // Disable for simplicity
    salaryDetails: false, // Disable for simplicity
    livingStatus: true,
  },
  
  financialDependents: {
    enabled: true, // Important section
  },
  
  assetsLiabilities: {
    basic: true,
    riskManagement: true, // Important for financial planning
    investmentAssets: true,
    superannuationDetailed: false, // Can add later
    pensionAnnuity: false, // Less common
    propertyDetailed: false, // Can use basic for now
    generalInsurance: false, // Can add later
    creditImpairments: false, // Optional
  },
  
  selfEmployment: {
    basic: true,
    taxReturns: false, // Complex, can add later
    accountantDetails: false, // Optional
  },
  
  annualExpenses: {
    simplified: true, // Start with simplified version
    comprehensive: false, // Can enable for full PDF match
  },
};

/**
 * Full configuration - Matches complete PDF
 * Enable this to get 100% PDF coverage
 */
export const fullFnaConfig: FnaConfig = {
  personalDetails: {
    basic: true,
    previousAddress: true,
    employment: true,
    previousEmployment: true,
    salaryDetails: true,
    livingStatus: true,
  },
  
  financialDependents: {
    enabled: true,
  },
  
  assetsLiabilities: {
    basic: true,
    riskManagement: true,
    investmentAssets: true,
    superannuationDetailed: true,
    pensionAnnuity: true,
    propertyDetailed: true,
    generalInsurance: true,
    creditImpairments: true,
  },
  
  selfEmployment: {
    basic: true,
    taxReturns: true,
    accountantDetails: true,
  },
  
  annualExpenses: {
    simplified: false,
    comprehensive: true,
  },
};

// Export the active configuration
// Change this to switch between simplified and full versions
export const activeFnaConfig: FnaConfig = defaultFnaConfig;
