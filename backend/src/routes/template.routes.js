import express from "express";
import {
  listTemplates,
  createFromTemplate,
  getTemplateById
} from "../controllers/template.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, listTemplates);

/* ⭐ NEW ROUTE */
router.get("/:id", requireAuth, getTemplateById);

router.post(
  "/:journalId/from-template/:templateId",
  requireAuth,
  createFromTemplate
);

export default router;