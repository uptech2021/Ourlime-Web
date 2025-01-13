import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * This function is a wrapper around tailwind-merge's `twMerge` and clsx
 * It allows us to pass in multiple class names, and it will merge them
 * together into a single class string. This is useful for when we want to
 * conditionally add a class to a component, or when we want to add a class
 * to a component that already has a class.
 *
 * @example
 * cn('bg-red-500', 'text-2xl') // -> "bg-red-500 text-2xl"
 * cn('bg-red-500', { 'text-2xl': condition }) // -> "bg-red-500 text-2xl" only if condition is true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
