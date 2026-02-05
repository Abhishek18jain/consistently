import express from "express";
import {loginUser ,registerUser,forgotPassword,verifyOTP,verifyForgotPasswordOTP,resetPassword} from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js";
import { Router } from "express";
const router = Router();
console.log("protect =", protect);

router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/login/forget-password", forgotPassword);
router.post("/register/verify", verifyOTP);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);
router.post("/reset-password", resetPassword);

export default router;
