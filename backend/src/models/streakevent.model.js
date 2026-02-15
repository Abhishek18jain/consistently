import mongoose from "mongoose";

const streakEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index:true
    },
    eventType: {
      type: String,
      enum: ["break", "recovery","near miss"],
      required: true
    },

    date: {
      type: Date,
      required: true,
    },
 streakLength: {
      type: Number,
      required: true
    },

    completion: {
      type: Number,
      min: 0,
      max: 100
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
