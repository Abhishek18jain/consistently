import * as journalService from "../services/journal.service.js";

export const createBook = async (req, res) => {
  try {
    const book = await journalService.createBook(req.user._id, req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBooks = async (req, res) => {
  const books = await journalService.getBooks(req.user._id);
  res.json(books);
};

export const openBook = async (req, res) => {
  const data = await journalService.openBook(
    req.user._id,
    req.params.bookId
  );
  res.json(data);
};

export const addTodayPage = async (req, res) => {
  try {
    const page = await journalService.addTodayPage(
      req.user._id,
      req.params.bookId,
      req.body.templateType
    );
    res.status(201).json(page);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBookPages = async (req, res) => {
  const pages = await journalService.getBookPages(
    req.user._id,
    req.params.bookId
  );
  res.json(pages);
};
