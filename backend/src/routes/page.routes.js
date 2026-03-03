// routes/page.routes.js

import express from "express";
import {
  createFromTemplate,
  getPage,
  nextPage,
  previousPage,
  updatePage,
  createBlank
} from "../controllers/page.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/from-template",requireAuth, createFromTemplate);
router.post("/blank",requireAuth,createBlank );

router.get("/:journalId/:date",requireAuth, getPage);

router.get("/:journalId/:date/next",requireAuth, nextPage);

router.get("/:journalId/:date/previous",requireAuth, previousPage);

router.patch("/:pageId",requireAuth, updatePage);

export default router;