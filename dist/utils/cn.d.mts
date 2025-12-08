import { ClassValue } from 'clsx';

/**
 * Merge Tailwind CSS classes with proper precedence
 * @param inputs - Class names to merge
 * @returns Merged class string
 */
declare function cn(...inputs: ClassValue[]): string;

export { cn };
