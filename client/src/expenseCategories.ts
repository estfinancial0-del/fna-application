/**
 * Comprehensive Expense Categories
 * Matches PDF pages 13-15 with 100+ line items
 */

export interface ExpenseItem {
  id: string;
  label: string;
  category: string;
}

export interface ExpenseCategory {
  title: string;
  items: ExpenseItem[];
}

export const comprehensiveExpenseCategories: ExpenseCategory[] = [
  {
    title: "YOUR HOUSE",
    items: [
      { id: "house_maintenance", label: "Maintenance & Repairs", category: "house" },
      { id: "house_security", label: "Security", category: "house" },
      { id: "house_pool", label: "Swimming Pools & Spas", category: "house" },
      { id: "house_gardens", label: "Gardens & Fences", category: "house" },
      { id: "house_pest", label: "Pest Control", category: "house" },
    ],
  },
  {
    title: "UTILITIES",
    items: [
      { id: "util_rates", label: "Council Rates", category: "utilities" },
      { id: "util_body_corp", label: "Body Corporate", category: "utilities" },
      { id: "util_electricity", label: "Electricity", category: "utilities" },
      { id: "util_gas", label: "Gas", category: "utilities" },
      { id: "util_water", label: "Water", category: "utilities" },
      { id: "util_home_phone", label: "Home Phone", category: "utilities" },
      { id: "util_mobile1", label: "Mobile Phone 1", category: "utilities" },
      { id: "util_mobile2", label: "Mobile Phone 2", category: "utilities" },
      { id: "util_kids_phone", label: "Kids Phone", category: "utilities" },
      { id: "util_internet", label: "Internet", category: "utilities" },
      { id: "util_pay_tv", label: "Pay TV", category: "utilities" },
    ],
  },
  {
    title: "FOOD/GROCERIES",
    items: [
      { id: "food_supermarket", label: "Supermarket", category: "food" },
      { id: "food_convenience", label: "Convenience Items", category: "food" },
    ],
  },
  {
    title: "HEALTH & MEDICAL",
    items: [
      { id: "health_doctor", label: "Doctor", category: "health" },
      { id: "health_dentist", label: "Dentist", category: "health" },
      { id: "health_optometrist", label: "Optometrist", category: "health" },
      { id: "health_other", label: "Other Specialists", category: "health" },
      { id: "health_chemist", label: "Chemist & Health Shop", category: "health" },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      { id: "personal_haircare", label: "Haircare/Make-up/Toiletries", category: "personal" },
      { id: "personal_dry_cleaning", label: "Dry Cleaning", category: "personal" },
    ],
  },
  {
    title: "CLOTHING & FOOTWEAR",
    items: [
      { id: "clothing_work", label: "Work Clothing/Uniform", category: "clothing" },
      { id: "clothing_social", label: "Social Clothing", category: "clothing" },
      { id: "clothing_sports", label: "Sports Clothing", category: "clothing" },
      { id: "clothing_footwear", label: "Footwear", category: "clothing" },
    ],
  },
  {
    title: "RECREATION & ENTERTAINMENT",
    items: [
      { id: "rec_movies", label: "Movies/Concert/Theatre", category: "recreation" },
      { id: "rec_subscriptions", label: "Netflix/Subscriptions", category: "recreation" },
      { id: "rec_takeaway", label: "Takeaway Meals", category: "recreation" },
      { id: "rec_dining", label: "Dining Out", category: "recreation" },
      { id: "rec_pub", label: "Pub/Nightclubbing", category: "recreation" },
      { id: "rec_cigarettes", label: "Cigarettes/Vapes", category: "recreation" },
      { id: "rec_alcohol", label: "Alcohol", category: "recreation" },
    ],
  },
  {
    title: "HOBBIES & SPORTS",
    items: [
      { id: "hobby_equipment", label: "Sports Equipment Hire", category: "hobbies" },
      { id: "hobby_subscriptions", label: "Subscriptions", category: "hobbies" },
      { id: "hobby_club", label: "Club Memberships", category: "hobbies" },
      { id: "hobby_gym", label: "Gym Memberships", category: "hobbies" },
    ],
  },
  {
    title: "EDUCATION",
    items: [
      { id: "edu_fees", label: "School & Course Fees", category: "education" },
      { id: "edu_uniforms", label: "School Uniforms", category: "education" },
      { id: "edu_equipment", label: "Equipment & Books", category: "education" },
    ],
  },
  {
    title: "GIFTS & DONATIONS",
    items: [
      { id: "gift_birthday", label: "Birthday Gifts", category: "gifts" },
      { id: "gift_christmas", label: "Christmas Gifts", category: "gifts" },
      { id: "gift_wedding", label: "Wedding Gifts", category: "gifts" },
      { id: "gift_donations", label: "Donations", category: "gifts" },
    ],
  },
  {
    title: "HOLIDAYS & TRAVEL",
    items: [
      { id: "travel_fare", label: "Travel Fare & Fuel", category: "travel" },
      { id: "travel_hire_car", label: "Hire Car", category: "travel" },
      { id: "travel_accommodation", label: "Accommodation", category: "travel" },
      { id: "travel_meals", label: "Meals", category: "travel" },
      { id: "travel_sightseeing", label: "Sightseeing", category: "travel" },
    ],
  },
  {
    title: "INSURANCE",
    items: [
      { id: "ins_building", label: "Building/House Insurance", category: "insurance" },
      { id: "ins_contents", label: "Contents Insurance", category: "insurance" },
      { id: "ins_health", label: "Private Health Insurance", category: "insurance" },
      { id: "ins_life", label: "Life Insurance", category: "insurance" },
      { id: "ins_income", label: "Income Protection", category: "insurance" },
      { id: "ins_car1", label: "Car Insurance 1", category: "insurance" },
      { id: "ins_car2", label: "Car Insurance 2", category: "insurance" },
    ],
  },
  {
    title: "EXISTING INVESTMENTS",
    items: [
      { id: "invest_funds", label: "Managed Funds/Shares", category: "investments" },
      { id: "invest_super", label: "Additional Superannuation", category: "investments" },
    ],
  },
  {
    title: "TRANSPORTATION",
    items: [
      { id: "transport_petrol", label: "Petrol & Oil", category: "transportation" },
      { id: "transport_maintenance", label: "Car Maintenance & Repairs", category: "transportation" },
      { id: "transport_rego1", label: "Car Registration 1", category: "transportation" },
      { id: "transport_rego2", label: "Car Registration 2", category: "transportation" },
      { id: "transport_public", label: "Public Transport", category: "transportation" },
      { id: "transport_taxi", label: "Taxi/Rideshare", category: "transportation" },
      { id: "transport_parking", label: "Parking Fees/Tolls/Licence", category: "transportation" },
      { id: "transport_caravan", label: "Caravan", category: "transportation" },
      { id: "transport_motorbike", label: "Motorbike", category: "transportation" },
      { id: "transport_boat", label: "Boat", category: "transportation" },
    ],
  },
  {
    title: "CHILDREN",
    items: [
      { id: "children_childcare", label: "Childcare", category: "children" },
      { id: "children_support", label: "Child Support", category: "children" },
      { id: "children_lessons", label: "Music/Dance Lessons", category: "children" },
      { id: "children_other", label: "Other Children Expenses", category: "children" },
    ],
  },
  {
    title: "PETS",
    items: [
      { id: "pets_food", label: "Pet Food", category: "pets" },
      { id: "pets_vet", label: "Vet Expenses", category: "pets" },
    ],
  },
  {
    title: "REGULAR PAYMENTS",
    items: [
      { id: "payment_car_loan", label: "Car Loan", category: "payments" },
      { id: "payment_rent", label: "Rent/Board", category: "payments" },
      { id: "payment_mortgage", label: "Mortgage Repayments", category: "payments" },
      { id: "payment_equipment", label: "Equipment Rentals", category: "payments" },
      { id: "payment_store_cards", label: "Store Cards", category: "payments" },
      { id: "payment_hire_purchase", label: "Hire Purchase", category: "payments" },
      { id: "payment_bank_loan", label: "Personal Bank Loan", category: "payments" },
      { id: "payment_personal_loan", label: "Personal Loan", category: "payments" },
    ],
  },
  {
    title: "OTHER EXPENSES",
    items: [
      { id: "other_appliances", label: "Appliances & Furniture", category: "other" },
      { id: "other_improvements", label: "Major Improvements", category: "other" },
      { id: "other_tools", label: "Tools Purchased", category: "other" },
      { id: "other_misc", label: "Other Miscellaneous", category: "other" },
    ],
  },
];

// Simplified expense categories (for default config)
export const simplifiedExpenseCategories: ExpenseCategory[] = [
  {
    title: "HOUSING",
    items: [
      { id: "housing_mortgage_rent", label: "Mortgage/Rent", category: "housing" },
      { id: "housing_utilities", label: "Utilities (Electricity, Gas, Water)", category: "housing" },
      { id: "housing_maintenance", label: "Maintenance & Repairs", category: "housing" },
    ],
  },
  {
    title: "LIVING EXPENSES",
    items: [
      { id: "living_groceries", label: "Groceries & Food", category: "living" },
      { id: "living_transport", label: "Transportation (Fuel, Public Transport)", category: "living" },
      { id: "living_healthcare", label: "Healthcare & Medical", category: "living" },
    ],
  },
  {
    title: "LIFESTYLE",
    items: [
      { id: "lifestyle_entertainment", label: "Entertainment & Recreation", category: "lifestyle" },
      { id: "lifestyle_dining", label: "Dining Out", category: "lifestyle" },
      { id: "lifestyle_clothing", label: "Clothing & Personal Care", category: "lifestyle" },
    ],
  },
  {
    title: "INSURANCE & DEBT",
    items: [
      { id: "insurance_all", label: "Insurance (Health, Car, Home)", category: "insurance" },
      { id: "debt_loans", label: "Loan Repayments", category: "debt" },
      { id: "debt_credit", label: "Credit Card Payments", category: "debt" },
    ],
  },
  {
    title: "OTHER",
    items: [
      { id: "other_education", label: "Education & Childcare", category: "other" },
      { id: "other_misc", label: "Miscellaneous", category: "other" },
    ],
  },
];
