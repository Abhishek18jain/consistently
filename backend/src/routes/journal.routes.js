import express from "express";
import {
  createJournal,
  selectTemplate,   // 🔥 NEW
  listJournals,
  getJournal,
  openJournal,
  archiveJournal,
  getTemplatesForJournal, resolveJournalEntry
} from "../controllers/journal.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * 📘 JOURNAL ROUTES
 * Base: /journals
 */

/* 🆕 Create journal */
router.post("/", requireAuth, createJournal);

/* 🎯 Select template for existing journal */
router.put("/:id/template", requireAuth, selectTemplate);

/* 📚 List journals */
router.get("/", requireAuth, listJournals);
router.get("/:id", requireAuth, getJournal);
/* 🚀 Open journal navigation state */
router.get("/:id/open", requireAuth, openJournal);

/* 📂 Archive journal */
router.put("/:id/archive", requireAuth, archiveJournal);
router.get("/:id/templates", requireAuth, getTemplatesForJournal);
router.get(
  "/:id/resolver",
  requireAuth,
  resolveJournalEntry
);

export default router;