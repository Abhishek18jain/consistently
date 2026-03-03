import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import { generateOTP, validateOTP, clearOTP } from "./otp.service.js";
import { sendOTPemail } from "../utils/email.utils.js";
import PendingUserModel from "../models/PendingUser.model.js";

export async function registerUser({ email, password, name }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await PendingUserModel.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
    },
    { upsert: true }
  );

  await sendOTPemail(email, otp, "registration");
}

export async function verifyOtp({ email, otp }) {
  const pending = await PendingUserModel.findOne({ email });

  if (!pending) throw new Error("Registration expired");

  if (pending.otp !== otp)
    throw new Error("Invalid OTP");

  if (pending.otpExpiresAt < Date.now())
    throw new Error("OTP expired");

  // CREATE ACTUAL USER
  const user = new User({
    name: pending.name,
    email: pending.email,
    password: pending.password,
    isVerified: true,
  });

  await user.save();

  // remove temp record
  await PendingUserModel.deleteOne({ email });
}


export async function loginUser({ email, password }) {
  // console.log("email", email , password);

  const user = await User.findOne({ email }).select("+password");  
  console.log("USER:", user);
  console.log("INPUT PASSWORD:", password);
  console.log("HASHED PASSWORD:", user?.password);


  if (!user) throw new Error("Invalid credentials");
  if (!user.isVerified) throw new Error("Email not verified");

 
  const isMatch = await bcrypt.compare(password, user.password);
console.log(isMatch);

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
