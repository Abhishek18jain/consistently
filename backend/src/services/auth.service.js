import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateOTP, validateOTP, clearOTP } from "./otp.service.js";
import { sendOTPemail } from "../utils/email.utils.js";

export async function registerUser({ email, password, name }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const user = new User({ email, password, name });

  const otp = generateOTP(user);
  await user.save();

  await sendOTPemail(email, otp, "registration");

  return { userId: user._id };
}

export async function verifyOtp({ email, otp }) {
  const user = await User.findOne({ email }).select("+otp +otpExpiresAt +otpAttempts");

  if (!user) throw new Error("User not found");

  validateOTP(user, otp);

  user.isVerified = true;
  clearOTP(user);

  await user.save();
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid credentials");
  if (!user.isVerified) throw new Error("Email not verified");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
}

export async function forgotPassword({ email }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = generateOTP(user);
  await user.save();

  await sendOTPemail(email, otp, "reset-password");
}

export async function resetPassword({ email, otp, newPassword }) {
  const user = await User.findOne({ email }).select("+otp +otpExpiresAt +otpAttempts");

  if (!user) throw new Error("User not found");

  validateOTP(user, otp);

  user.password = newPassword;
  clearOTP(user);

  await user.save();
}
