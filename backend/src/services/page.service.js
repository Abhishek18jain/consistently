import Page from "../models/page.model.js";
import Book from "../models/book.model.js";
import Template from "../models/template.model.js";

import { buildDailyStats } from "./dailyStats.service.js";
import { processStreak } from "./streak.service.js";

/**
 * Create or update a page for a given book & date
 */export async function createOrUpdatePage(userId, payload) {
  const { bookId, date, templateKey, content } = payload;

  if (!bookId || !date || !templateKey) {
    throw new Error("Missing required page data");
  }

  const book = await Book.findOne({ _id: bookId, userId });
  if (!book) {
    throw new Error("Journal not found or access denied");
  }

  const template = await Template.findOne({
    key: templateKey,
    active: true
  });

  if (!template) {
    throw new Error("Invalid or inactive template");
  }

  // Normalize date (UTC)
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);

  let page = await Page.findOne({
    userId,
    bookId,
    date: day
  });

  if (page) {
    page.templateType = template.key;
    page.content = content;
    page.isReflection = !template.affectsStreak;
    page.isLocked = template.category === "reflection";
  } else {
    page = new Page({
      userId,
      bookId,
      date: day,
      templateType: template.key,
      content,
      isReflection: !template.affectsStreak,
      isLocked: template.category === "reflection"
    });
  }

  await page.save();

  // Update last activity
  book.lastPageDate = day;
  await book.save();

  // Analytics layer
  const dailyStats = await buildDailyStats(page, template);

  page.completionPercent = dailyStats.completion;
  await page.save();

  // Streak engine
  await processStreak(dailyStats);

  return page;
}


/**
 * Get page for a specific book & date (read-only)
 */
export async function getPageByDate(userId, bookId, date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const page = await Page.findOne({
    userId,
    bookId,
    date: { $gte: start, $lte: end }
  }).lean();

  return page || null;
}

