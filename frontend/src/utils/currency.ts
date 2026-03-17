/**
 * Format number to Indonesian Rupiah currency string.
 * @param amount Number to format
 * @returns Formatted string (e.g., Rp 170.000)
 */
export function formatCurrency(amount: number): string {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}
