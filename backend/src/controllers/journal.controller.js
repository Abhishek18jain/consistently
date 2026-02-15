import {
  createBook,
  getUserBooks,
  getBookById,
  getLatestPageForBook
} from "../services/journal.service.js";

/**
 * POST /journals
 */
export async function createJournal(req, res, next) {
  console.log("REQ.USER:", req.user); // ADD THIS
  try {
    const book = await createBook(req.user.userId, req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
}
/**
 * GET /journals
 */
export async function listJournals(req, res, next) {
  try {
    const books = await getUserBooks(req.user.userId);
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /journals/:id
 */
export async function openJournal(req, res, next) {
  try {
    const book = await getBookById(req.user.userId, req.params.id);
    const latestPage = await getLatestPageForBook(book._id);

    res.status(200).json({ book, latestPage });
  } catch (err) {
    next(err);
  }
}
