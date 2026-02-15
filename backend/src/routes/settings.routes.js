import express from "express";
import {
  updateSettings,
  updatePin
} from "../controllers/setting.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.patch("/", requireAuth, updateSettings);
router.patch("/pin", requireAuth, updatePin);

export default router;
