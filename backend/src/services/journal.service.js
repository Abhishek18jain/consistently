import Book from "../models/book.model.js";
import Page from "../models/page.model.js";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// 1️⃣ Create Book
export const createBook = async (userId, data) => {
  const { title, bookType, allowedTemplates = [] } = data;

  return await Book.create({
    user: userId,
    title,
    bookType,
    allowedTemplates,
  });
};

// 2️⃣ List Books
export const getBooks = async (userId) => {
  return await Book.find({ user: userId, isArchived: false })
    .sort({ updatedAt: -1 })
    .lean();
};

// 3️⃣ Open Book → latest page
export const openBook = async (userId, bookId) => {
  const book = await Book.findOne({ _id: bookId, user: userId });
  if (!book) throw new Error("Book not found");

  const latestPage = await Page.findOne({ book: bookId })
    .sort({ date: -1 })
    .lean();

  return { book, latestPage };
};

// 4️⃣ Add Today’s Page
export const addTodayPage = async (userId, bookId, templateType) => {
  const book = await Book.findOne({ _id: bookId, user: userId });
  if (!book) throw new Error("Book not found");

  if (
    book.allowedTemplates.length &&
    !book.allowedTemplates.includes(templateType)
  ) {
    throw new Error("Template not allowed for this book");
  }

  const today = startOfToday();

  const exists = await Page.findOne({ book: bookId, date: today });
  if (exists) throw new Error("Today's page already exists");

  const isReflection = templateType === "reflection";

  const page = await Page.create({
    user: userId,
    book: bookId,
    date: today,
    templateType,
    isLocked: isReflection,
    contributesToStreak: !isReflection,
  });

  book.totalPages += 1;
  book.lastPageDate = today;
  await book.save();

  return page;
};

// 5️⃣ Get all pages of book
export const getBookPages = async (userId, bookId) => {
  const book = await Book.findOne({ _id: bookId, user: userId });
  if (!book) throw new Error("Book not found");

  return await Page.find({ book: bookId })
    .sort({ date: 1 })
    .lean();
};
