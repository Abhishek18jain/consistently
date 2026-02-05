import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getRiskStatus,
  getStreakBreakReason,
  getTomorrowAdvice,
  getWeakDaysCoach,
  getTodaySummary,
} from "../controllers/coach.controller.js";

const router = express.Router();
router.use(protect);

router.get("/risk", getRiskStatus);
router.get("/streak-break", getStreakBreakReason);
router.get("/tomorrow", getTomorrowAdvice);
router.get("/weak-days", getWeakDaysCoach);
router.get("/today", getTodaySummary);

export default router;
