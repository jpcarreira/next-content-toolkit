/**
 * Format a date to a readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
declare function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Format a date to a short string (e.g., "Jan 1, 2025")
 */
declare function formatDateShort(date: Date | string): string;
/**
 * Get relative time string (e.g., "2 days ago")
 */
declare function getRelativeTime(date: Date | string): string;

export { formatDate, formatDateShort, getRelativeTime };
