import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import { generateOTP } from "../utils/otp.utils.js";
import { sendOTPemail } from "../utils/email.utils.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// ================= REGISTER ==================
export const registerUser = async (req, res) => {
  console.log("in registeredUser")
  try {
    const { username, email, password } = req.body;
console.log("taken inputs")
    const exists = await User.findOne({ email });
    console.log("email finnding")
    if (exists) {
      console.log("user already")
      return res.status(400).json({ message: "Email already registered" });
    }
console.log("creating new user")
    const { otp, hash } = generateOTP();
console.log("otp generated")
    const user = await User.create({
      username,
      email,
      password,
      otpHash: hash,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });
console.log("creted user")
    await sendOTPemail(email, otp, "Signup Verification");
    console.log("otp send")

    res.status(201).json({
      message: "OTP sent to email. Please verify.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= LOGIN ==================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= VERIFY OTP ==================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ---- Input validation
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ---- Ensure OTP exists
    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        message: "No OTP request found for this user",
      });
    }

    // ---- Expiry check
    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    if (hashedOtp !== user.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ---- Success: verify + clean
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.status(200).json({
      token: generateToken(user._id),
      message: "Account verified successfully",
    });

  } catch (error) {
    console.error("verifyOTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= FORGOT PASSWORD ==================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { otp, hash } = generateOTP();

    user.otpHash = hash;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendOTPemail(email, otp, "Password Reset");

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= VERIFY FORGOT PASSWORD OTP ==================
export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    if (hashedOtp !== user.otpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    // cleanup OTP
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.status(200).json({
      message: "OTP verified",
      resetToken,
    });

  } catch (error) {
    console.error("verifyForgotPasswordOTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// ================= RESET PASSWORD ==================
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Token and password required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword; // pre-save hook will hash it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
