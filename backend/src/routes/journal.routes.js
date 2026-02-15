import express from "express";
import {
  createJournal,
  listJournals,
  openJournal
} from "../controllers/journal.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createJournal);
router.get("/", requireAuth, listJournals);
router.get("/:id", requireAuth, openJournal);

export default router;
