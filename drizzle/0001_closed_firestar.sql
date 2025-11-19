CREATE TABLE `annual_expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`expenseCategory` varchar(100) NOT NULL,
	`expenseItem` varchar(255) NOT NULL,
	`perWeek` int,
	`perMonth` int,
	`perYear` int,
	CONSTRAINT `annual_expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assets_liabilities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`assetType` varchar(100) NOT NULL,
	`valueOfAsset` int,
	`amountOwing` int,
	`repayment` int,
	`frequency` varchar(50),
	`lender` varchar(255),
	`rentAmount` int,
	CONSTRAINT `assets_liabilities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`clientName` varchar(255),
	`clientManager` varchar(255),
	`phone` varchar(50),
	`email` varchar(320),
	`appointmentDate` datetime,
	`appointmentTime` varchar(20),
	`appointmentLocation` text,
	CONSTRAINT `client_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit_impairments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`details` text,
	CONSTRAINT `credit_impairments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_dependents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`name` varchar(255),
	`dateOfBirth` datetime,
	`relationship` varchar(100),
	`financiallyDependent` boolean,
	`untilAge` int,
	`sex` varchar(10),
	CONSTRAINT `financial_dependents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fna_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('draft','submitted','reviewed') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`submittedAt` timestamp,
	CONSTRAINT `fna_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `general_insurance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`insuranceType` varchar(100) NOT NULL,
	`hasInsurance` boolean,
	`insuranceProvider` varchar(255),
	`notes` text,
	CONSTRAINT `general_insurance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investment_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`description` text,
	`owner` varchar(255),
	`amount` int,
	CONSTRAINT `investment_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lifestyle_aspirations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`importantThings` text,
	`whyImportant` text,
	`currentConcerns` text,
	`mustChange` text,
	`wantToChange` text,
	`financialDreams` text,
	`hobbiesActivities` text,
	CONSTRAINT `lifestyle_aspirations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pension_annuity_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`description` text,
	`owner` varchar(255),
	`amount` int,
	CONSTRAINT `pension_annuity_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personal_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`clientNumber` int NOT NULL,
	`title` varchar(20),
	`surname` varchar(100),
	`givenNames` varchar(100),
	`dateOfBirth` datetime,
	`homeAddress` text,
	`postcode` varchar(10),
	`yearMovedIn` int,
	`livingStatus` varchar(50),
	`livingStatusValue` int,
	`previousAddress` text,
	`previousPostcode` varchar(10),
	`previousYearMovedIn` int,
	`bestContactNumber` varchar(50),
	`emailAddress` varchar(320),
	`maritalStatus` varchar(50),
	`typeOfEmployment` varchar(50),
	`employer` varchar(255),
	`dateStarted` datetime,
	`positionOccupation` varchar(255),
	`previousEmployer` varchar(255),
	`previousPosition` varchar(255),
	`lengthOfEmployment` varchar(100),
	`taxableIncome` int,
	`lessSalarySacrifice` varchar(100),
	`additionalBenefits` text,
	`familyBenefits` text,
	CONSTRAINT `personal_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `property_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`propertyType` varchar(100) NOT NULL,
	`yearPurchased` int,
	`purchaseValue` int,
	`loanType` varchar(100),
	`fixedOrVariable` varchar(50),
	`interestRate` varchar(20),
	`titleNamePercentage` varchar(100),
	`suburb` varchar(255),
	CONSTRAINT `property_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retirement_planning` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`estimatedRetirementAge` int,
	`currentAge` int,
	`yearsBeforeRetirement` int,
	`yearsInRetirement` int,
	`desiredYearlyIncome` int,
	`totalAmountRequired` int,
	`superannuation` int,
	`savings` int,
	`sharesBonds` int,
	`equityNotHome` int,
	`otherAssets` int,
	`totalProvisions` int,
	`retirementShortfall` int,
	`amountNeededYearly` int,
	`amountNeededWeekly` int,
	CONSTRAINT `retirement_planning_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `risk_management` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`clientNumber` int NOT NULL,
	`lifeInsurance` boolean,
	`lifeInsuranceAmount` int,
	`tpdInsurance` boolean,
	`tpdInsuranceAmount` int,
	`incomeProtection` boolean,
	`incomeProtectionAmount` int,
	`traumaCover` boolean,
	`traumaCoverAmount` int,
	`smoker` boolean,
	`smokerAmount` int,
	`riskManagementImportant` boolean,
	`riskManagementAmount` int,
	CONSTRAINT `risk_management_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `self_employment_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`businessStructure` varchar(100),
	`businessName` varchar(255),
	`abn` varchar(50),
	`taxYear1` varchar(20),
	`taxYear1Completed` boolean,
	`taxYear2` varchar(20),
	`taxYear2Completed` boolean,
	`furtherInfo` text,
	`grossTurnover1` int,
	`grossTurnover2` int,
	`lessExpenses1` int,
	`lessExpenses2` int,
	`netProfitLoss1` int,
	`netProfitLoss2` int,
	`taxableIncome1` int,
	`taxableIncome2` int,
	`interest1` int,
	`interest2` int,
	`depreciation1` int,
	`depreciation2` int,
	`superannuation1` int,
	`superannuation2` int,
	`accountantName` varchar(255),
	`accountantPhone` varchar(50),
	`accountantFirm` varchar(255),
	`accountantEmail` varchar(320),
	CONSTRAINT `self_employment_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `superannuation_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`description` text,
	`owner` varchar(255),
	`amount` int,
	CONSTRAINT `superannuation_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wealth_creation_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`saveForGoal` enum('important','interested','not_important'),
	`payOffDebt` enum('important','interested','not_important'),
	`reduceTax` enum('important','interested','not_important'),
	`salaryPackaging` enum('important','interested','not_important'),
	`superControl` enum('important','interested','not_important'),
	`investMoney` enum('important','interested','not_important'),
	`investShares` enum('important','interested','not_important'),
	`investProperty` enum('important','interested','not_important'),
	`retirementPlanning` enum('important','interested','not_important'),
	`centrelinkBenefits` enum('important','interested','not_important'),
	`moneyLastLonger` enum('important','interested','not_important'),
	CONSTRAINT `wealth_creation_goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wealth_protection_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fnaSubmissionId` int NOT NULL,
	`familySecure` enum('important','interested','not_important'),
	`manageSickness` enum('important','interested','not_important'),
	`inheritance` enum('important','interested','not_important'),
	`employmentChange` enum('important','interested','not_important'),
	`recentEvent` enum('important','interested','not_important'),
	`familyChange` enum('important','interested','not_important'),
	CONSTRAINT `wealth_protection_goals_id` PRIMARY KEY(`id`)
);
