import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    reflectionPinHash: String,

    bestStreak: {
      type: Number,
      default: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    otpHash: String,

    otpExpiresAt: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
passwordResetToken: String,
passwordResetExpires: Date,

    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
  },
  { timestamps: true }
);

// ================= PASSWORD HASH =================
UserSchema.pre("save", async function () {
  if (!this.isModified("password"));

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
console.log("inside model");
  // next();..
  console.log("outside model")
});

// ================= COMPARE =================
UserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
