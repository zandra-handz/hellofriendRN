// src/utils/dateUtils.ts

/**
 * Converts an ISO date string like "2026-03-14" into a readable weekday/month/day label.
 * Parses manually to avoid UTC timezone shifting.
 * 
 * Current year:  "Friday, March 14"
 * Other year:    "Friday, March 14, 2025"
 */
export const isoDateToWeekdayMonthDay = (dateStr: string): string => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();

  const isCurrentYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  });
};