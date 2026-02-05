import DailyStats from "../models/DailyStats.model.js";
import StreakEvent from "../models/streakevent.model.js";
import Page from "../models/page.model.js";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
export const getRiskStatus = async (userId) => {
  const stats = await DailyStats.find({ user: userId })
    .sort({ date: -1 })
    .limit(3)
    .lean();

  if (!stats.length) {
    return { status: "safe", message: "No recent data yet." };
  }

  const nearMisses = stats.filter((s) => s.status === "near-miss").length;
  const failures = stats.filter((s) => s.status === "fail").length;

  if (failures > 0) {
    return {
      status: "critical",
      reason: "Recent failure detected",
      suggestion: "Review today's plan and focus on finishing item.",
    };
  }

  if (nearMisses >= 2) {
    return {
      status: "warning",
      reason: "Multiple near-miss days",
      suggestion: "Consider reducing load or rebalancing today.",
    };
  }

  return {
    status: "safe",
    message: "You are on track today.",
  };
};
export const getStreakBreakReason = async (userId) => {
  const event = await StreakEvent.findOne({ user: userId })
    .sort({ date: -1 })
    .lean();

  if (!event) {
    return { message: "No streak breaks recorded." };
  }

  return {
    date: event.date,
    previousStreak: event.previousStreak,
    reason: event.reason,
    completionPercent: event.completionPercent,
    explanation:
      "Your completion dropped below the 70% threshold on this day.",
  };
};
export const getTomorrowAdvice = async (userId) => {
  const stats = await DailyStats.find({ user: userId })
    .sort({ date: -1 })
    .limit(7)
    .lean();

  if (!stats.length) {
    return { message: "Not enough data yet." };
  }

  const avg =
    stats.reduce((sum, s) => sum + s.completionPercent, 0) /
    stats.length;

  if (avg < 70) {
    return {
      suggestion:
        "Your recent average is low. You may want to review tomorrow’s plan and keep it lighter.",
    };
  }

  return {
    suggestion:
      "Your recent consistency is good. Keep tomorrow’s plan similar.",
  };
};
export const getWeakDaysCoach = async (userId) => {
  const stats = await DailyStats.find({ user: userId }).lean();

  const map = {};

  stats.forEach((d) => {
    const day = new Date(d.date).toLocaleString("en-US", {
      weekday: "long",
    });

    if (!map[day]) map[day] = { total: 0, fails: 0 };
    map[day].total += 1;
    if (d.status === "fail") map[day].fails += 1;
  });

  const result = Object.entries(map).map(([day, v]) => ({
    day,
    failureRate: Math.round((v.fails / v.total) * 100),
  }));

  result.sort((a, b) => b.failureRate - a.failureRate);

  return result.slice(0, 3);
};
export const getTodaySummary = async (userId) => {
  const today = startOfToday();

  const page = await Page.findOne({
    user: userId,
    date: today,
    contributesToStreak: true,
  }).lean();

  if (!page) {
    return { message: "No page created for today yet." };
  }

  return {
    templateType: page.templateType,
    completionPercent: page.completionPercent,
    contentSummary: page.content,
  };
};
