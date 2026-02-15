import DailyStats from "../models/daily.model.js";
import Badge from "../models/badge.model..js";
import User from "../models/user.model.js";

import { buildMonthlyHeatmap } from "../utils/heatmap.utils.js";
import { normalizeDate } from "../utils/date.util.js";

/**
 * Dashboard analytics
 * Used for main dashboard screen
 */
export async function getDashboardAnalytics(userId) {
  const user = await User.findById(userId).select("streak").lean();

  if (!user) {
    throw new Error("User not found");
  }

  const today = normalizeDate(new Date());
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const dailyStats = await DailyStats.find({
    userId,
    excluded: false
  }).lean();

  const heatmap = buildMonthlyHeatmap(dailyStats, year, month);

  const recentStats = dailyStats
    .sort((a, b) => b.date - a.date)
    .slice(0, 7);

  const avgCompletion =
    recentStats.reduce((sum, d) => sum + d.completion, 0) /
    (recentStats.length || 1);

  return {
    streak: user.streak || { current: 0, best: 0 },
    averageCompletion: Math.round(avgCompletion),
    heatmap,
    recentDays: recentStats.length
  };
}

/**
 * Monthly heatmap (used in profile / calendar view)
 */
export async function getMonthlyHeatmap(userId, year, month) {
  const stats = await DailyStats.find({
    userId,
    excluded: false
  }).lean();

  return buildMonthlyHeatmap(stats, year, month);
}

/**
 * Full profile analytics
 * Used in profile screen
 */
export async function getProfileAnalytics(userId) {
  const user = await User.findById(userId)
    .select("streak createdAt")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  const stats = await DailyStats.find({
    userId,
    excluded: false
  }).lean();

  const totalDays = stats.length;
  const successDays = stats.filter(d => d.success).length;

  const completionAvg =
    stats.reduce((sum, d) => sum + d.completion, 0) /
    (totalDays || 1);

  const badges = await Badge.find({ userId }).lean();

  return {
    joinedAt: user.createdAt,
    streak: user.streak || { current: 0, best: 0 },
    totalDaysTracked: totalDays,
    successRate: totalDays
      ? Math.round((successDays / totalDays) * 100)
      : 0,
    averageCompletion: Math.round(completionAvg),
    badges
  };
}
