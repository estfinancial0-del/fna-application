# FNA Application TODO

## Phase 1: Planning & Schema Design
- [x] Initialize project with web-db-user features
- [x] Analyze PDF and extract all data fields
- [x] Design database schema for all FNA sections
- [x] Create data contract (JSON structure) documentation

## Phase 2: Backend Development
- [x] Create database tables for Client Details
- [x] Create database tables for Financial Goals (Wealth Creation/Protection)
- [x] Create database tables for Lifestyle & Aspirations
- [x] Create database tables for Retirement Planning
- [x] Create database tables for Personal Details
- [x] Create database tables for Assets & Liabilities
- [x] Create database tables for Self-Employment Details
- [x] Create database tables for Annual Costs/Expenses
- [x] Build tRPC procedures for saving FNA data
- [x] Build tRPC procedures for retrieving FNA data
- [x] Implement retirement shortfall calculation logic
-- [x] Write vitest tests for all procedures

## Phase 3: Frontend Development
- [x] Design color scheme and typography
- [x] Create multi-step wizard component
- [x] Build Step 1: Client Details form
- [x] Build Step 2: Financial Goals form (radio buttons)
- [x] Build Step 3: Lifestyle & Aspirations form (textareas)
- [x] Build Step 4: Retirement Planning form (with calculations)
- [x] Build Step 5: Personal Details form (2 clients)
- [x] Build Step 6: Assets & Liabilities form (dynamic tables)
- [x] Build Step 7: Self-Employment form
- [x] Build Step 8: Annual Expenses form
- [x] Implement form validation
- [x] Implement responsive design (mobile-first)
- [ ] Test all forms on mobile devicesesktop)
- [ ] Implement save-and-continue functionality

## Phase 4: GoHighLevel Integration
- [ ] Request GoHighLevel API key from user
- [ ] Create backend procedure for GoHighLevel contact upsert
- [ ] Test contact synchronization
- [ ] Handle API errors gracefully

## Phase 5: Testing & Polish
- [ ] Test complete user flow end-to-end
- [ ] Verify data persistence
- [ ] Test responsive design on multiple devices
- [ ] Fix any UI/UX issues
- [ ] Create project checkpoint

## Phase 6: Deployment
- [ ] Save final checkpoint
- [ ] Guide user to publish via UI
- [ ] Provide DNS configuration instructions for est.com.au
- [ ] Document GoHighLevel setup steps

## Bug Fixes
- [x] Fix tRPC queries returning undefined instead of null when no data exists

- [x] Replace logo with EST Capital branding

## Phase 4: GoHighLevel Integration
- [x] Request GoHighLevel API credentials from user
- [x] Create GoHighLevel API client helper
- [x] Build contact sync function
- [x] Integrate with FNA submission flow
- [x] Test GoHighLevel integration with real credentials
- [x] Write vitest tests for GoHighLevel integration

## Phase 5: Admin Dashboard
- [x] Create admin-only route protection
- [x] Build FNA submissions list page with table
- [x] Add filters (by date, status, client name)
- [ ] Create detailed FNA view page
- [ ] Add export to PDF functionality
- [x] Implement search functionality
- [x] Add submission statistics/overview cards

## Phase 5: Expand Form to Match Complete PDF

### Step 5: Personal Details - Add Missing Fields
- [ ] Add previous address history fields
- [ ] Add living status dropdown (Owned/Mortgage/Renting)
- [ ] Expand marital status options (Single/Divorced/Life Partner/Married/De Facto/Separated/Widowed)
- [ ] Add employment type dropdown (Full Time/Part Time/Casual/Self-Employed)
- [ ] Add current employer details (name, position, length of employment)
- [ ] Add previous employer details
- [ ] Add salary sacrifice field
- [ ] Add additional benefits field
- [ ] Add family benefits field

### Step 5B: Financial Dependents (NEW)
- [ ] Create Financial Dependents section with dynamic table
- [ ] Add dependent name, age, relationship fields
- [ ] Add add/remove dependent functionality

### Step 6: Assets & Liabilities - Expand Significantly
- [ ] Add Risk Management section (Life Insurance, TPD, Income Protection, Trauma Cover)
- [ ] Add smoker status field
- [ ] Add Investment Assets section (Shares, Collectables)
- [ ] Expand Superannuation section (Fund name, Member number, Balance, Type)
- [ ] Add Pension/Annuity Assets section
- [ ] Expand Property Details (Year Purchased, Purchase Value, Loan Type, Fixed/Variable, Interest Rate, Title ownership %)
- [ ] Add General Insurance section (Home & Contents, Car/Boat, Landlord)
- [ ] Add Credit Impairments field

### Step 7: Self-Employment - Add Detailed Fields
- [ ] Add business structure dropdown (Sole Trader/Partnership/Company/Trust)
- [ ] Add business name and ABN fields
- [ ] Add tax returns for last 2 years with breakdown
- [ ] Add Gross Turnover, Less Expenses, Net Profit/Loss fields
- [ ] Add Taxable Income field
- [ ] Add Add-backs section (Interest, Depreciation, Superannuation)
- [ ] Add Accountant Details (Name, Phone, Email)
- [ ] Add permission signature field

### Step 8: Annual Expenses - Expand to Match PDF
- [ ] Expand to 100+ expense line items across 20+ categories
- [ ] Add Per Week / Per Month / Per Year columns for each item
- [ ] Categories: House, Utilities, Food, Health, Personal, Clothing, Recreation, Hobbies, Education, Gifts, Holidays, Insurance, Investments, Transportation, Children, Pets, Regular Payments, Other
- [ ] Add auto-calculation for totals

### Database Schema Updates
- [ ] Update personal_details table with new fields
- [ ] Create financial_dependents table (already exists, verify structure)
- [ ] Update risk_management table with insurance details
- [ ] Update investment_assets table
- [ ] Update superannuation_assets table with detailed fields
- [ ] Create pension_annuity_assets table
- [ ] Update property_details table with comprehensive fields
- [ ] Create general_insurance table
- [ ] Update self_employment_details table with all fields
- [ ] Expand annual_expenses table to support 100+ line items

### Backend Updates
- [ ] Update tRPC procedures for all new fields
- [ ] Update database helper functions
- [ ] Write vitest tests for new procedures

## Modular Form Architecture
- [x] Create fnaConfig.ts with toggleable sections
- [x] Break Step 5 into modular sub-components
- [x] Break Step 6 into modular sub-components  
- [ ] Break Step 7 into modular sub-components
- [ ] Break Step 8 into modular sub-components
- [x] Add Financial Dependents as optional module
- [x] Add Risk Management as optional module
- [ ] Add comprehensive Expenses as optional module

## Comprehensive Expense Module
- [x] Create ComprehensiveExpensesModule component with 100+ line items
- [x] Add 20+ expense categories matching PDF pages 13-15
- [x] Implement Per Week/Month/Year columns with auto-calculation
- [x] Integrate module into Step 8
- [ ] Write tests for comprehensive expenses

## FNA Detail View Page
- [ ] Create /admin/fna/:id route
- [ ] Build FnaDetailView component with all sections
- [ ] Format data for printing/presentation
- [ ] Add navigation from admin dashboard table

## PDF Export
- [ ] Add PDF export button to detail view
- [ ] Implement PDF generation from FNA data
- [ ] Style PDF to match professional report format
- [ ] Test PDF export functionality

## Progress Sidebar
- [x] Create ProgressSidebar component showing all 8 steps
- [x] Add step completion indicators
- [x] Show current step highlight
- [x] Make sidebar sticky on desktop
- [x] Integrate sidebar into FnaWizard

## PDF Export
- [x] Install PDF generation library (jsPDF or react-pdf)
- [x] Create PDF template matching FNA layout
- [x] Implement generateFnaPdf function
- [x] Add PDF export to FnaDetailView
- [ ] Test PDF generation with sample data

## Email Notifications
- [x] Set up email service integration (using built-in notification system)
- [x] Create client confirmation email template (logged to console)
- [x] Create advisor notification email template
- [x] Send email on FNA submission
- [ ] Test email delivery

## Production Deployment
- [ ] Review all features and fix any bugs
- [ ] Run complete end-to-end test
- [ ] Create final checkpoint
- [ ] Document deployment steps
- [ ] Configure custom domain (est.com.au)

## Bug Fixes
- [x] Fix progress sidebar showing steps as complete when no data exists
- [x] Add proper completion check for each step (verify data exists in database)

## Input Formatting & Validation
- [x] Apply currency formatting to Step 1 (Client Details)
- [ ] Apply formatted inputs to Step 4 (Retirement Planning)
- [ ] Apply formatted inputs to Step 5 (Personal Details)
- [ ] Apply formatted inputs to Step 6 (Assets & Liabilities)
- [ ] Apply formatted inputs to Step 7 (Self-Employment)
- [ ] Apply formatted inputs to Step 8 (Expenses)
- [ ] Add required field validation
- [ ] Add email format validation
- [ ] Add helpful error messages

## Optional Self-Employment Section
- [x] Add "Are you self-employed?" yes/no question at start of Step 7
- [x] Show full self-employment form only if "Yes" is selected
- [x] Allow users to skip Step 7 if "No" is selected

## PDF Export Enhancements
- [x] Format currency values in PDF with $ and thousand separators
- [x] Format phone numbers in PDF with Australian format (04) 1234 5678
- [x] Format ABN in PDF with proper spacing
- [x] Format postcodes in PDF
- [x] Create formatting utility functions (formatters.ts)

## GoHighLevel Automation Workflows
- [x] Set up GoHighLevel workflow to send SMS notification to client on FNA submission
- [x] Set up GoHighLevel workflow to send email notification to client on FNA submission
- [x] Add workflow trigger when contact is created/updated in GoHighLevel
- [x] Implement triggerWorkflow function in gohighlevel.ts
- [x] Integrate workflow trigger into FNA submission flow
- [x] Configure GOHIGHLEVEL_WORKFLOW_ID environment variable
- [x] Test workflow trigger functionality

## PDF Enhancements
- [ ] Add Print button to FNA detail view
- [ ] Enhance PDF design to match EST Capital branding
- [ ] Add EST Capital logo to PDF header
- [ ] Match color scheme (red #DC2626) from original document
- [ ] Improve layout and typography to match original PDF
- [ ] Add all missing sections from original PDF

## Outlook Calendar Integration
- [x] Create Outlook calendar helper function
- [ ] Request Microsoft 365 credentials from user (Client ID, Client Secret, Tenant ID)
- [ ] Integrate calendar event creation with FNA submission flow
- [ ] Test calendar integration
- [ ] Write vitest tests for calendar functionality

## Branding Correction
- [x] Update all references from "EST Capital" to "EST Financial"
- [x] Update PDF generator header
- [x] Update email notification templates
- [x] Update GoHighLevel workflow messages (user needs to update manually in GHL)
- [x] Update homepage and UI text
- [x] Update Outlook calendar integration text
- [x] Update CSS comments

## PDF Complete Redesign to Match Original EST Financial Document
- [ ] Create new PDF generator with EST Financial branding
- [ ] Add black cover page with white script title "Financial Needs Analysis"
- [ ] Add EST logo to all content pages (top left, red)
- [ ] Implement styled tables with gray backgrounds and red headers
- [ ] Add page numbers in script font (top right)
- [ ] Add "PRIVATE & CONFIDENTIAL" header to page 2
- [ ] Recreate all form sections matching original layout
- [ ] Add print button to admin FNA detail view
- [ ] Test PDF generation with complete FNA data
- [ ] Verify formatting matches original document
