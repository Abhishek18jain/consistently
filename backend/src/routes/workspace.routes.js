import express from "express";
import { workspaceStatus } from "../controllers/workspace.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/status", requireAuth, workspaceStatus);

export default router;
