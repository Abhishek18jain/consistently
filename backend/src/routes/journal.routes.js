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


router.post("/book",protect, createBook);
router.get("/books",protect, getBooks);
router.get("/book/:bookId",protect, openBook);
router.post("/book/:bookId/page/today",protect, addTodayPage);
router.get("/book/:bookId/pages",protect, getBookPages);

export default router;
