import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMonthlyHeatmap,
  getStreakSummary,
  getConsistencyScore,
  getWeakDays,
} from "../controllers/analytics.controller.js";

const router = express.Router();
console.log({
  getMonthlyHeatmap,
  getStreakSummary,
  getConsistencyScore,
  getWeakDays,
});


router.get("/heatmap",protect, getMonthlyHeatmap);
router.get("/streak",protect, getStreakSummary);
router.get("/score",protect, getConsistencyScore);
router.get("/weak-days",protect, getWeakDays);

export default router;
