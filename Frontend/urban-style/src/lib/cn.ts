import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

/**
 * `cn` (Class Name) is a composition utility that intelligently combines
 * multiple CSS classes, especially useful in projects with Tailwind CSS.
 *
 * This function processes inputs using `clsx` to handle conditional classes
 * (e.g., objects where keys are classes and values are booleans)
 * and `tailwind-merge` to automatically resolve any conflicts between
 * Tailwind CSS classes (e.g., `p-4` and `p-6` would merge to `p-6`).
 *
 * @function
 * @param {...(string|object|Array<string|object>)} input - A list of arguments that can be:
 * - Strings: Individual or multiple CSS classes separated by spaces.
 * - Objects: Where keys are class names and values are booleans
 * (the class is included if the value is `true`).
 * - Arrays: Containing any combination of the above types.
 *
 * @returns {string} A single string containing all combined, clean, and conflict-resolved
 * CSS classes, ready to be used in the `className` attribute.
 *
 * @example
 * // Basic usage
 * cn('text-red-500', 'font-bold'); // -> "text-red-500 font-bold"
 *
 * @example
 * // With conditionals
 * const isActive = true;
 * cn('p-4', isActive && 'bg-blue-500', !isActive && 'bg-gray-200'); // -> "p-4 bg-blue-500"
 *
 * @example
 * // Resolving Tailwind conflicts
 * cn('p-4', 'p-6', 'text-sm', 'text-base'); // -> "p-6 text-base"
 *
 * @example
 * // With nested arrays and objects
 * cn('flex', { 'items-center': true }, ['justify-between', isActive && 'gap-2']);
 * // -> "flex items-center justify-between gap-2"
 */
export function cn(...input: any[]): string {
	return twMerge(clsx(input))
}
