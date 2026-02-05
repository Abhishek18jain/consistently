import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMonthlyHeatmap,
  getStreakSummary,
  getConsistencyScore,
  getWeakDays,
} from "../controllers/analytics.controller.js";

const router = express.Router();
router.use(protect);

router.get("/heatmap", getMonthlyHeatmap);
router.get("/streak", getStreakSummary);
router.get("/score", getConsistencyScore);
router.get("/weak-days", getWeakDays);

export default router;
