
import express from "express";
import {
  savePage,
  fetchPage
} from "../controllers/page.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, savePage);
router.get("/:bookId/:date", requireAuth, fetchPage);

export default router;

