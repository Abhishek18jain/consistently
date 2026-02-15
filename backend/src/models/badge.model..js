import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: [
        "7_day_streak",
        "100% completion",
        "30_day_streak",
        "perfect_week",
        "recovery"
      ],
      required: true
    },

    earnedAt: {
      type: Date,
      default: Date.now
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed
      // optional: streakLength, month, etc.
    }
  },
  { timestamps: true }
);

export default mongoose.model("Badge", badgeSchema);
