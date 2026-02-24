import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely — avoids class conflicts.
 * Usage: cn("px-4 py-2", condition && "bg-red", "px-6")
 *   → "py-2 px-6 bg-red"
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
