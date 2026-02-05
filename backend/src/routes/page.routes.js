import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { updatePage } from "../controllers/page.controller.js";

const router = express.Router();

// router.use(protect);

// update page content
router.put("/:pageId",protect, updatePage);

export default router;
