/**
 * Formats a number to a human-readable string with comma separators for numbers < 100,000
 * and K (thousands) and M (millions) suffixes for larger numbers.
 * Examples:
 * - 999 remains "999"
 * - 1000 becomes "1,000"
 * - 99999 becomes "99,999"
 * - 100000 becomes "100K"
 * - 1000000 becomes "1M"
 * - 1500000 becomes "1.5M"
 *
 * @param number The number to format
 * @param decimals The number of decimal places to show for K/M formatting (default: 1)
 * @returns Formatted string representation of the number
 */
export function formatNumber(number: number, decimals = 1): string {
  if (isNaN(number) || !isFinite(number)) {
    return "0";
  }

  // For numbers less than 100,000 - use comma formatting
  if (number < 100000) {
    return number.toLocaleString("vi-VN");
  }

  // For numbers in thousands (100K - 999K)
  if (number < 1000000) {
    return (number / 1000).toFixed(decimals).replace(/\.0$/, "") + "K";
  }

  // For numbers in millions (1M and above)
  return (number / 1000000).toFixed(decimals).replace(/\.0$/, "") + "M";
}

/**
 * Formats a count number specifically for display in the UI
 * This is a convenience wrapper around formatNumber
 *
 * @param count The count to format
 * @returns Formatted string representation of the count
 */
export function formatPlayCount(count: number): string {
  return formatNumber(count);
}

/**
 * Formats a price number to Vietnamese format with dot (.) as thousand separator
 * Examples:
 * - 5000 becomes "5.000"
 * - 120000 becomes "120.000"
 * - 1296000 becomes "1.296.000"
 * - 15000000 becomes "15.000.000"
 *
 * @param price The price number to format
 * @returns Formatted string representation of the price in Vietnamese format
 */
export function formatPriceVN(price: number): string {
  if (isNaN(price) || !isFinite(price)) {
    return "0";
  }

  // Round to nearest integer (no decimals for prices)
  const roundedPrice = Math.round(price);

  // Convert to string and add dot separators every 3 digits from right
  return roundedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}