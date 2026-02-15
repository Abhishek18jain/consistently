import express from "express";
import { coachQuery } from "../controllers/coach.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:questionKey", requireAuth, coachQuery);

export default router;
