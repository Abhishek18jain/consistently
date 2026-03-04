// routes/page.routes.js

import express from "express";
import {
  createFromTemplate,
  getPage,
  nextPage,
  previousPage,
  updatePage,
  createBlank,
  latestPage,
  deletePage,
} from "../controllers/page.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/from-template", requireAuth, createFromTemplate);
router.post("/blank", requireAuth, createBlank);

// ⚠️ IMPORTANT: /latest must come BEFORE /:journalId/:date to avoid conflict
router.get("/:journalId/latest", requireAuth, latestPage);

router.get("/:journalId/:date", requireAuth, getPage);

router.get("/:journalId/:date/next", requireAuth, nextPage);

router.get("/:journalId/:date/previous", requireAuth, previousPage);

router.patch("/:pageId", requireAuth, updatePage);

// 🗑️ Delete a page
router.delete("/:pageId", requireAuth, deletePage);

export default router;