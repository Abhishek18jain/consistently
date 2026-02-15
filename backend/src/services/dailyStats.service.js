import DailyStats from "../models/daily.model.js";
import { calculateCompletion } from "../utils/completion.utlis.js";

/**
 * Build or update DailyStats for a given page
 * @param {Object} page - Saved Page mongoose document
 * @param {Object} template - Template mongoose document
 * @returns {Object} dailyStats
 **/
export async function buildDailyStats(page, template) {
  let {
    completion,
    success,
    nearMiss,
    excluded
  } = calculateCompletion(template, page.content);

  
  // 🔥 Streak participation logic lives HERE
  if (!template.affectsStreak) {
    excluded = true;
    success = false;
  }

  const statsData = {
    userId: page.userId,
    bookId: page.bookId,
    pageId: page._id,
    date: page.date,
    completion,
    success,
    nearMiss,
    excluded
  };

  const dailyStats = await DailyStats.findOneAndUpdate(
    {
      userId: page.userId,
      bookId: page.bookId,
      date: page.date
    },
    statsData,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );
console.log("Excluded:", dailyStats.excluded);

  return dailyStats;
}
