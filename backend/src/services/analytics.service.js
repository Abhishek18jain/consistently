import DailyStats from "../models/daily.model.js";
import Badge from "../models/badge.model..js";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";

import { buildMonthlyHeatmap } from "../utils/heatmap.utils.js";
import { normalizeDate } from "../utils/date.util.js";

/**
 * Dashboard analytics — REAL DATA
 * Returns:
 *  - streak
 *  - per-journal completion for today
 *  - weekly completion (last 7 days) from DailyStats
 *  - heatmap
 *  - journals with their names
 */
export async function getDashboardAnalytics(userId) {
  const user = await User.findById(userId).select("streak").lean();
  if (!user) throw new Error("User not found");

  const today = normalizeDate(new Date());
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  /* ── All DailyStats (not excluded) ── */
  const allStats = await DailyStats.find({
    userId,
    excluded: false,
  }).lean();

  /* ── Heatmap ── */
  const heatmap = buildMonthlyHeatmap(allStats, year, month);

  /* ── Weekly completion (last 7 days) from REAL data ── */
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const normalizedDay = new Date(dateStr + "T00:00:00.000Z");

    const statsForDay = allStats.filter((s) => {
      const statDate = new Date(s.date).toISOString().split("T")[0];
      return statDate === dateStr;
    });

    const maxCompletionOfDay = statsForDay.length > 0
      ? Math.max(...statsForDay.map(s => s.completion))
      : 0;

    weeklyData.push({
      day: dayNames[d.getDay()],
      date: dateStr,
      value: maxCompletionOfDay,
    });
  }

  /* ── Average completion (all time) ── */
  const avgCompletion =
    allStats.length > 0
      ? Math.round(
        allStats.reduce((sum, d) => sum + d.completion, 0) / allStats.length
      )
      : 0;

  /* ── Today's stats (per journal) ── */
  const todayStr = new Date().toISOString().split("T")[0];
  const todayStats = allStats.filter((s) => {
    const statDate = new Date(s.date).toISOString().split("T")[0];
    return statDate === todayStr;
  });

  /* ── Get journals for name mapping ── */
  const journals = await Book.find({ userId, isArchived: false })
    .select("title journalType totalPages")
    .lean();

  const journalMap = {};
  for (const j of journals) {
    journalMap[j._id.toString()] = {
      title: j.title,
      type: j.journalType,
      totalPages: j.totalPages,
    };
  }

  /* ── Per-journal completion for today ── */
  const journalCompletions = todayStats.map((stat) => {
    const journalInfo = journalMap[stat.bookId?.toString()] || {};
    return {
      journalId: stat.bookId,
      journalName: journalInfo.title || "Unknown",
      journalType: journalInfo.type || "blank",
      completion: stat.completion,
      status: stat.status,
      success: stat.success,
    };
  });

  /* ── Today's overall completion ── */
  const todayOverall =
    todayStats.length > 0
      ? Math.round(
        todayStats.reduce((sum, s) => sum + s.completion, 0) /
        todayStats.length
      )
      : 0;

  /* ── Consistency score (% of tracked days that were successful) ── */
  const successDays = allStats.filter((s) => s.success).length;
  const consistencyScore =
    allStats.length > 0 ? Math.round((successDays / allStats.length) * 100) : 0;

  return {
    streak: user.streak || { current: 0, best: 0 },
    averageCompletion: avgCompletion,
    todayCompletion: todayOverall,
    consistencyScore,
    weeklyData,
    heatmap,
    recentDays: todayStats.length,
    journalCompletions,
    journals: journals.map((j) => ({
      _id: j._id,
      title: j.title,
      type: j.journalType,
    })),
    isFirstTimeUser: journals.length === 0 && allStats.length === 0,
  };
}

/**
 * Monthly heatmap
 */
export async function getMonthlyHeatmap(userId, year, month) {
  const stats = await DailyStats.find({ userId, excluded: false }).lean();
  return buildMonthlyHeatmap(stats, year, month);
}

/**
 * Full profile analytics
 */
export async function getProfileAnalytics(userId) {
  const user = await User.findById(userId).select("streak createdAt").lean();
  if (!user) throw new Error("User not found");

  const stats = await DailyStats.find({ userId, excluded: false }).lean();
  const totalDays = stats.length;
  const successDays = stats.filter((d) => d.success).length;
  const completionAvg =
    stats.reduce((sum, d) => sum + d.completion, 0) / (totalDays || 1);

  const badges = await Badge.find({ userId }).lean();

  return {
    joinedAt: user.createdAt,
    streak: user.streak || { current: 0, best: 0 },
    totalDaysTracked: totalDays,
    successRate: totalDays ? Math.round((successDays / totalDays) * 100) : 0,
    averageCompletion: Math.round(completionAvg),
    badges,
  };
}
