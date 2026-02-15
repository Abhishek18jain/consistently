import express from "express";

import authRoutes from "./auth.routes.js";
import pageRoutes from "./page.routes.js";
import journalRoutes from "./journal.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import coachRoutes from "./coach.routes.js";
import settingsRoutes from "./settings.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/pages", pageRoutes);
router.use("/journals", journalRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/coach", coachRoutes);
router.use("/settings", settingsRoutes);

export default router;
