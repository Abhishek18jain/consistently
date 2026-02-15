import Book from "../models/book.model.js";
import Page from "../models/page.model.js";

/**
 * Create a new journal book
 * @param {String} userId
 * @param {Object} payload { title?, type }
 */
export async function createBook(userId, payload = {}) {
  const { title, type = "blank" } = payload;

  const book = await Book.create({
    userId,
    title: title?.trim() || "My Journal",
    type
  });

  return book;
}

/**
 * Get all books for a user (most recently updated first)
 */
export async function getUserBooks(userId) {
  return Book.find({ userId })
    .sort({ updatedAt: -1 })
    .lean();
}

/**
 * Get a single book by id and ensure ownership
 */
export async function getBookById(userId, bookId) {
  const book = await Book.findOne({
    _id: bookId,
    userId
  });

  if (!book) {
    throw new Error("Journal not found or access denied");
  }

  return book;
}

/**
 * Get latest page of a book (used when opening a journal)
 */
export async function getLatestPageForBook(bookId) {
  return Page.findOne({ bookId })
    .sort({ date: -1 })
    .lean();
}
