"use client";

/**
 * Utility function to merge class names
 * This is needed by the UI components
 */
export function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Utility function to format date
 */
export function formatDate(date: string | number | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Utility function to format number
 */
export function formatNumber(number: number) {
  return new Intl.NumberFormat("en-US").format(number);
}
