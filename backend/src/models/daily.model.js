import mongoose from "mongoose";

const dailyStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    completionPercent: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["success", "near-miss", "fail"],
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },

    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
    },
  },
  { timestamps: true }
);

// One stat per day per user
dailyStatsSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyStats", dailyStatsSchema);
