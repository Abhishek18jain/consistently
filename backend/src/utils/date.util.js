/**
 * date.util.js
 * -------------
 * Centralized date helpers for streaks, analytics, and heatmaps.
 * All functions are PURE and timezone-safe.
 */

/**
 * Normalize a date to start of day (00:00:00)
 * IMPORTANT: Always use this before date comparisons
 */
export function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Calculate difference in days between two dates
 * Result is always an integer
 */
export function daysBetween(dateA, dateB) {
  const a = normalizeDate(dateA);
  const b = normalizeDate(dateB);

  const diffMs = b.getTime() - a.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 * Used in Coach weak-day analysis
 */
export function getDayOfWeek(date) {
  return normalizeDate(date).getDay();
}

/**
 * Get month key for grouping (e.g. "2026-02")
 * Used for heatmaps & monthly analytics
 */
export function getMonthKey(date) {
  const d = normalizeDate(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Get all dates for a given month
 * Returns array of normalized Date objects
 */
export function getMonthDateRange(year, month) {
  // month: 1–12
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const dates = [];
  let current = normalizeDate(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
