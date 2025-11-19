/**
 * Formatting utilities for displaying data in PDFs and UI
 */

/**
 * Format a number as currency with $ prefix and thousand separators
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "$125,000.00")
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return `$${value.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format a phone number in Australian format
 * @param value - The phone number string (may be formatted or unformatted)
 * @returns Formatted phone string (e.g., "(04) 1234 5678")
 */
export function formatPhone(value: string | null | undefined): string {
  if (!value) return "N/A";
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  
  // Format as (04) 1234 5678 for 10-digit Australian mobile numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }
  
  // Return original if not standard format
  return value;
}

/**
 * Format an ABN (Australian Business Number)
 * @param value - The ABN string (may be formatted or unformatted)
 * @returns Formatted ABN string (e.g., "12 345 678 901")
 */
export function formatABN(value: string | null | undefined): string {
  if (!value) return "N/A";
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  
  // Format as XX XXX XXX XXX for 11-digit ABN
  if (digits.length === 11) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  
  // Return original if not standard format
  return value;
}

/**
 * Format a postcode (4 digits)
 * @param value - The postcode string
 * @returns Formatted postcode string
 */
export function formatPostcode(value: string | null | undefined): string {
  if (!value) return "N/A";
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  
  // Return first 4 digits
  if (digits.length >= 4) {
    return digits.slice(0, 4);
  }
  
  return value;
}

/**
 * Format a percentage value
 * @param value - The numeric percentage value
 * @returns Formatted percentage string (e.g., "5.25%")
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(2)}%`;
}

/**
 * Format a date value
 * @param value - The date value (Date object or string)
 * @returns Formatted date string (e.g., "15/03/2024")
 */
export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "N/A";
  
  const date = typeof value === "string" ? new Date(value) : value;
  
  if (isNaN(date.getTime())) return "N/A";
  
  return date.toLocaleDateString("en-AU");
}
