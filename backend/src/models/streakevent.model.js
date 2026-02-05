import mongoose from "mongoose";

const streakEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    previousStreak: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      // examples: "below-threshold", "near-miss-chain"
    },

    completionPercent: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("StreakEvent", streakEventSchema);
