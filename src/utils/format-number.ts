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
    return number.toLocaleString("en-US");
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
