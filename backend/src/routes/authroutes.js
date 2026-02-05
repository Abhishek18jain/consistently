import express from "express";
import {login ,registerUser,forgotPassword,verifyOTP} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/login/forget-password", forgotPassword);
router.post("/register/verify", verifyOTP);

export default router;
