import User from "../models/user.model.js";
import StreakEvent from "../models/streakevent.model.js";
import { checkAndAwardBadges } from "./badge.service.js";
import { normalizeDate, daysBetween } from "../utils/date.util.js";
/**
 * Process streak update for a given DailyStats record
 * @param {Object} dailyStats
 */
export async function processStreak(dailyStats) {
  // console.log("Streak lookup userId:", dailyStats.userId);
  if (dailyStats.excluded === true) {
    return { status: "ignored" };
  }
  const user = await User.findById(dailyStats.userId).select("streak");
  if (!user) throw new Error("User not found for streak processing");

  const today = normalizeDate(dailyStats.date);
  const lastSuccess = user.streak?.lastSuccessDate
    ? normalizeDate(user.streak.lastSuccessDate)
    : null;

  let currentStreak = user.streak?.current || 0;
  let bestStreak = user.streak?.best || 0;

  const isSameDay = lastSuccess && daysBetween(lastSuccess, today) === 0;

  // ❌ FAILED DAY
  if (!dailyStats.success) {
    // If they already succeeded today with another journal, ignore this failure for streak
    if (isSameDay) {
      return { status: "preserved" };
    }

    // BREAK STREAK
    if (currentStreak > 0) {
      await StreakEvent.create({
        userId: user._id,
        eventType: "break",
        date: today,
        streakLength: currentStreak,
        previousStreak: currentStreak,
        completion: dailyStats.completion,
        completionPercent: dailyStats.completion,
        reason: "Completion below 70%"
      });
    }

    user.streak = {
      current: 0,
      best: bestStreak,
      lastSuccessDate: lastSuccess
    };

    await user.save();
    return { status: "broken" };
  }

  // ✅ SUCCESS DAY
  if (isSameDay) {
    // Already succeeded today, just return
    return {
      status: "success",
      currentStreak,
      bestStreak
    };
  }

  const isConsecutive =
    lastSuccess &&
    daysBetween(lastSuccess, today) === 1;

  currentStreak = isConsecutive ? currentStreak + 1 : (currentStreak === 0 ? 1 : 1);
  bestStreak = Math.max(bestStreak, currentStreak);

  // RECOVERY EVENT
  if (!isConsecutive && currentStreak === 1 && lastSuccess) {
    await StreakEvent.create({
      userId: user._id,
      eventType: "recovery",
      date: today,
      streakLength: currentStreak,
      previousStreak: 0,
      completion: dailyStats.completion,
      completionPercent: dailyStats.completion,
      reason: "Streak restarted after break"
    });
  }

  user.streak = {
    current: currentStreak,
    best: bestStreak,
    lastSuccessDate: today
  };

  await user.save();

  // 🎖 Badge check
  await checkAndAwardBadges(user._id, currentStreak);

  return {
    status: "success",
    currentStreak,
    bestStreak
  };
}
