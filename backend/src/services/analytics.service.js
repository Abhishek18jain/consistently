import DailyStats from "../models/daily.model.js";
import User from "../models/user.model.js";

export const getMonthlyHeatmap = async (userId, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const stats = await DailyStats.find({
    user: userId,
    date: { $gte: start, $lte: end },
  }).lean();

  return stats.map((d) => ({
    date: d.date,
    completionPercent: d.completionPercent,
    status: d.status,
  }));
};

export const getStreakSummary = async (userId) => {
  const user = await User.findById(userId).select(
    "currentStreak bestStreak"
  );

  return {
    currentStreak: user.currentStreak,
    bestStreak: user.bestStreak,
  };
};
export const getConsistencyScore = async (userId) => {
  const stats = await DailyStats.find({ user: userId })
    .sort({ date: -1 })
    .limit(30)
    .lean();

  if (!stats.length) return 0;

  const successDays = stats.filter((d) => d.status === "success").length;
  return Math.round((successDays / stats.length) * 100);
};
export const getWeakDays = async (userId) => {
  const stats = await DailyStats.find({ user: userId }).lean();

  const map = {};

  stats.forEach((d) => {
    const day = new Date(d.date).toLocaleString("en-US", {
      weekday: "long",
    });

    if (!map[day]) {
      map[day] = { total: 0, fails: 0 };
    }

    map[day].total += 1;
    if (d.status === "fail") map[day].fails += 1;
  });

  return Object.entries(map).map(([day, v]) => ({
    day,
    failureRate: Math.round((v.fails / v.total) * 100),
  }));
};
