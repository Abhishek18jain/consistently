import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createBook,
  getBooks,
  openBook,
  addTodayPage,
  getBookPages,
} from "../controllers/journal.controller.js";

const router = express.Router();

router.use(protect);

router.post("/book", createBook);
router.get("/books", getBooks);
router.get("/book/:bookId", openBook);
router.post("/book/:bookId/page/today", addTodayPage);
router.get("/book/:bookId/pages", getBookPages);

export default router;
