import DailyStats from "../models/daily.model.js";
import { calculateCompletionFromBlocks } from "../utils/completion.utlis.js";
import { processStreak } from "./streak.service.js";

/**
 * Build or update DailyStats from page blocks.
 * This is the MAIN function called when a user saves a page.
 *
 * @param {Object} params
 * @param {String} params.userId - User ID
 * @param {String} params.journalId - Journal/Book ID
 * @param {String} params.pageId - Page ID
 * @param {String} params.date - Page date (YYYY-MM-DD)
 * @param {Array}  params.blocks - contentJSON blocks
 * @param {String} params.journalType - Journal type (todo, planner, etc.)
 * @returns {Object} { dailyStats, streakResult, completionData }
 */
export async function processPageCompletion({
  userId,
  journalId,
  pageId,
  date,
  blocks,
  journalType,
}) {
  // 1. Calculate completion from blocks
  const completionData = calculateCompletionFromBlocks(blocks, journalType, date);

  // 2. Normalize date for DailyStats
  const normalizedDate = new Date(date + "T00:00:00.000Z");

  // 3. Upsert DailyStats
  const statsData = {
    userId,
    bookId: journalId,
    pageId,
    date: normalizedDate,
    completion: completionData.completion,
    completionPercent: completionData.completion,
    success: completionData.success,
    nearMiss: completionData.nearMiss,
    excluded: completionData.excluded,
    status: completionData.success
      ? "success"
      : completionData.nearMiss
        ? "near-miss"
        : "fail",
  };

  const dailyStats = await DailyStats.findOneAndUpdate(
    {
      userId,
      bookId: journalId,
      date: normalizedDate,
    },
    statsData,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  // 4. Process streak (only if not excluded)
  let streakResult = { status: "ignored" };

  if (!completionData.excluded) {
    try {
      streakResult = await processStreak(dailyStats);
    } catch (err) {
      console.error("Streak processing error:", err);
    }
  }

  return {
    dailyStats,
    streakResult,
    completionData,
  };
}

/**
 * Legacy: Build DailyStats from template-based content
 * (kept for backwards compatibility)
 */
export async function buildDailyStats(page, template) {
  const { calculateCompletion } = await import("../utils/completion.utlis.js");

  let {
    completion,
    success,
    nearMiss,
    excluded
  } = calculateCompletion(template, page.content);

  // Streak participation logic
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
    completionPercent: completion,
    success,
    nearMiss,
    excluded,
    status: success ? "success" : nearMiss ? "near-miss" : "fail",
  };

  const dailyStats = await DailyStats.findOneAndUpdate(
    {
      userId: page.userId,
      date: page.date
    },
    statsData,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  return dailyStats;
}
