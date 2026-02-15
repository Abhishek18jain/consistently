import Badge from "../models/badge.model..js";
import DailyStats from "../models/daily.model.js";

/**
 * Check and award badges based on current streak
 * @param {String} userId
 * @param {Number} currentStreak
 */
export async function checkAndAwardBadges(userId, currentStreak) {
  const awarded = [];

  // 🎖 7-day streak
  if (currentStreak === 7) {
    await awardOnce(userId, "7_day_streak");
    awarded.push("7_day_streak");
  }

  // 🎖 30-day streak
  if (currentStreak === 30) {
    await awardOnce(userId, "30_day_streak");
    awarded.push("30_day_streak");
  }

  // 🎖 Perfect week
  if (currentStreak >= 7) {
    const last7 = await DailyStats.find({
      userId,
      success: true,
      excluded: false
    })
      .sort({ date: -1 })
      .limit(7);

    if (last7.length === 7) {
      await awardOnce(userId, "perfect_week", {
        from: last7[6].date,
        to: last7[0].date
      });
      awarded.push("perfect_week");
    }
  }

  return awarded;
}

/**
 * Award badge only if not already earned
 */
async function awardOnce(userId, type, metadata = {}) {
  const exists = await Badge.findOne({ userId, type });
  if (exists) return;

  await Badge.create({
    userId,
    type,
    metadata
  });
}
