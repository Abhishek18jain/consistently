import Book from "../models/book.model.js";
import DailyStats from "../models/daily.model.js";
import User from "../models/user.model.js";
import Page from "../models/page.model.js";

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
      latestBookId: null,
    };
  }

  const journalsCount = books.length;
  const latestBook = books[0];
  const latestBookId = latestBook._id;

  /* ================= TODAY'S DATE ================= */
  const todayStr = new Date().toISOString().split("T")[0]; // "2026-03-05"

  /* ================= TODAY'S STATS (try DailyStats first) ================= */
  // Try both: a date string match and a Date object match
  let todayStats = await DailyStats.findOne({
    userId,
    $or: [
      { date: { $eq: todayStr } },
      { date: { $gte: new Date(todayStr + "T00:00:00.000Z"), $lte: new Date(todayStr + "T23:59:59.999Z") } },
    ],
  }).lean();

  // If no DailyStats yet today, check if any page was written today across any journal
  let completionToday = todayStats?.completion || 0;
  let hasPageToday = false;

  if (!todayStats) {
    const pageToday = await Page.findOne({
      journalId: { $in: books.map(b => b._id) },
      $or: [
        { date: todayStr },
        { date: { $gte: new Date(todayStr + "T00:00:00.000Z"), $lte: new Date(todayStr + "T23:59:59.999Z") } },
      ],
    }).lean();
    hasPageToday = !!pageToday;
  } else {
    hasPageToday = true;
    completionToday = todayStats.completion || 0;
  }

  const mode = hasPageToday ? "active" : "no_pages";

  /* ================= HISTORICAL STATS ================= */
  const allStats = await DailyStats.find({ userId }).lean();
  const trackableStats = allStats.filter(s => !s.excluded);

  const totalActiveDays = trackableStats.length;
  const avgCompletion = totalActiveDays > 0
    ? Math.round(trackableStats.reduce((s, d) => s + (d.completion || 0), 0) / totalActiveDays)
    : 0;

  /* ================= RISK ================= */
  let risk = "safe";
  if (!hasPageToday) risk = "danger";
  else if (completionToday < 40) risk = "danger";
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
    latestBookId: latestBookId.toString(),

    completionToday,
    streak,
    bestStreak,
    avgCompletion,
    totalActiveDays,

    risk,
    hoursLeftToday,
  };
}