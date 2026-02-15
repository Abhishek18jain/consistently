import { forgotPassword, login, register, resetPassword, verifyEmail } from "../controllers/auth.controller.js";
import express from "express";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/signup", register);
router.post("/verify-Email", verifyEmail);
router.post("/forgot-Password", forgotPassword);
router.post("/reset-Password", resetPassword);
export default router;