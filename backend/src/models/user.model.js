import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false // never return password by default
    },

    pinHash: {
      type: String,
      select: false // used only to unlock reflection
    },

    settings: {
      timezone: { type: String, default: "Asia/Kolkata" },
      weekStartsOn: { type: Number, default: 1 } // Monday
    },

    streak: {
      current: { type: Number, default: 0 },
      best: { type: Number, default: 0 },
      lastSuccessDate: { type: Date, default: null },
    },
    otp: {
      type: String,
      select: false,
    },

    otpExpiresAt: {
      type: Date,
      select: false,
    },

    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },


    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

/* ===========================
   PASSWORD HASHING
   =========================== */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  // Prevent double hashing
  if (this.password.startsWith("$2b$")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // next();
});



/* ===========================
   PASSWORD COMPARISON
   =========================== */

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


export default mongoose.model("User", userSchema);
