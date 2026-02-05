import Page from "../models/page.model.js";
import Book from "../models/book.model.js";
import { calculateCompletion } from "../utlis/completion.utlis.js";
import { evaluateDay } from "./streak.service.js";


export const updatePageContent = async (
  userId,
  pageId,
  newContent
) => {
  const page = await Page.findOne({ _id: pageId, user: userId });
  if (!page) throw new Error("Page not found");

  if (page.isLocked) {
    throw new Error("This page is locked");
  }

  page.content = newContent;

  const completion = calculateCompletion(
    page.templateType,
    newContent
  );

  page.completionPercent = completion;

  await page.save();
if (page.contributesToStreak) {
  await evaluateDay({
    userId,
    date: page.date,
    completionPercent: page.completionPercent,
    bookId: page.book,
    pageId: page._id,
  });
}

  // update book timestamp
  await Book.findByIdAndUpdate(page.book, {
    updatedAt: new Date(),
  });

  return page;
};
