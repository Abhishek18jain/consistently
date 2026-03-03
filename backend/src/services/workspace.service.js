import Book from "../models/book.model.js";
import DailyStats from "../models/daily.model.js";
import User from "../models/user.model.js";

export async function getWorkspaceStatus(userId) {

  /* ================= USER ================= */
  const user = await User.findById(userId).select("streak").lean();
  const streak = user?.streak?.current || 0;
  const bestStreak = user?.streak?.best || 0;

  /* ================= JOURNALS ================= */
  const books = await Book.find({ userId, isArchived: false })
    .sort({ updatedAt: -1 })
    .lean();

  if (books.length === 0) {
    return {
      mode: "no_journals",
      journalsCount: 0,
      streak: 0,
      bestStreak: 0,
      completionToday: 0,
      avgCompletion: 0,
      totalActiveDays: 0,
      risk: "safe",
      hoursLeftToday: 24,
    };
  }

  const journalsCount = books.length;
  const latestBookId = books[0]._id;

  /* ================= TODAY'S STATS ================= */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStats = await DailyStats.findOne({
    userId,
    date: today,
    excluded: false,
  }).lean();

  const completionToday = todayStats?.completion || 0;
  const mode = todayStats ? "active" : "no_pages";

  /* ================= HISTORICAL STATS ================= */
  const allStats = await DailyStats.find({
    userId,
    excluded: false,
  }).lean();

  const totalActiveDays = allStats.length;
  const avgCompletion = totalActiveDays > 0
    ? Math.round(allStats.reduce((s, d) => s + d.completion, 0) / totalActiveDays)
    : 0;

  /* ================= RISK ================= */
  let risk = "safe";
  if (completionToday < 40) risk = "danger";
  else if (completionToday < 70) risk = "warning";

  /* ================= TIME LEFT ================= */
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const hoursLeftToday = Math.floor((midnight - now) / 3600000);

  /* ================= FINAL RESPONSE ================= */
  return {
    mode,
    journalsCount,
    latestBookId,

    completionToday,
    streak,
    bestStreak,
    avgCompletion,
    totalActiveDays,

    risk,
    hoursLeftToday,
  };
}