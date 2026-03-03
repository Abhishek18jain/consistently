import Book from "../models/book.model.js";
import Page from "../models/page.model.js";

function normalizeDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function getWorkspaceStatus(userId) {

  /* ================= JOURNALS ================= */

  const books = await Book.find({ userId, isArchived: false })
    .sort({ updatedAt: -1 })
    .lean();

  if (books.length === 0) {
    return { mode: "no_journals" };
  }

  const journalsCount = books.length;
  const latestBookId = books[0]._id;

  /* ================= TODAY PAGE ================= */

  const today = normalizeDay(new Date());

  const todayPage = await Page.findOne({
    userId,
    date: today,
  }).lean();

  const completionToday = todayPage?.completionPercent || 0;
  const mode = todayPage ? "active" : "no_pages";

  /* ================= QUICK STATS ================= */

  const stats = await Page.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalActiveDays: { $sum: 1 },
        avgCompletion: { $avg: "$completionPercent" },
        bestCompletion: { $max: "$completionPercent" },
      },
    },
  ]);

  const totalActiveDays = stats[0]?.totalActiveDays || 0;
  const avgCompletion = Math.round(stats[0]?.avgCompletion || 0);

  /* ================= STREAK ================= */

  // Get last pages sorted by date descending
  const recentPages = await Page.find({ userId })
    .sort({ date: -1 })
    .limit(30) // only need recent history
    .lean();

  let streak = 0;

  for (const p of recentPages) {
    if (p.completionPercent >= 70) streak++;
    else break;
  }

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
    avgCompletion,
    totalActiveDays,

    risk,
    hoursLeftToday,
  };
}