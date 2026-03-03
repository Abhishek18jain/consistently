import mongoose from "mongoose";
 const PendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  otpExpiresAt: Date
  
});
PendingUserSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });


export default mongoose.model("pendingUser" , PendingUserSchema);