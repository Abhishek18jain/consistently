/**
 * heatmap.util.js
 * ----------------
 * Builds monthly heatmap data from DailyStats.
 * PURE utility – no DB, no side effects.
 */

import { getMonthDateRange, normalizeDate } from "./date.util.js";

/**
 * Build heatmap data for a given month
 * @param {Array} dailyStats - DailyStats documents
 * @param {Number} year
 * @param {Number} month - 1 to 12
 */
export function buildMonthlyHeatmap(dailyStats = [], year, month) {
  const dateRange = getMonthDateRange(year, month);

  // Map stats by normalized date string
  const statsMap = {};
  dailyStats.forEach(stat => {
    const key = normalizeDate(stat.date).toISOString();
    statsMap[key] = stat;
  });

  return dateRange.map(date => {
    const key = normalizeDate(date).toISOString();
    const stat = statsMap[key];

    if (!stat || stat.excluded) {
      return {
        date,
        completion: null,
        intensity: 0,
        success: false
      };
    }

    const completion = stat.completion;

    return {
      date,
      completion,
      intensity: getIntensity(completion),
      success: stat.success
    };
  });
}

/**
 * Convert completion percentage to heatmap intensity
 * 0 = no data
 * 1 = very low
 * 2 = medium
 * 3 = good
 * 4 = excellent
 */
function getIntensity(completion) {
  if (completion === null || completion === undefined) return 0;
  if (completion < 40) return 1;
  if (completion < 60) return 2;
  if (completion < 80) return 3;
  return 4;
}
