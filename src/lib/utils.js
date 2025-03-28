"use client";

import { cn } from "@/lib/utils";

/**
 * Utility function to merge class names
 * This is needed by the UI components
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Utility function to format date
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Utility function to format number
 */
export function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number);
}
