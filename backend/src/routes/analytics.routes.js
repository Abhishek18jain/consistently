import express from "express";
import {
  dashboardAnalytics,
  monthlyHeatmap,
  profileAnalytics
} from "../controllers/analytics.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", requireAuth, dashboardAnalytics);
router.get("/heatmap/:year/:month", requireAuth, monthlyHeatmap);
router.get("/profile", requireAuth, profileAnalytics);

export default router;
