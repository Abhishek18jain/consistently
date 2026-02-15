import mongoose from "mongoose";

const dailyStatsSchema = new mongoose.Schema(
  {
    userId: {
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
   completion: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },

    success: {
      type: Boolean,
      required: true
      // completion >= 70%
    },
    completionPercent: {
      type: Number,
      required: true,
    },
        nearMiss: {
      type: Boolean,
      default: false
      // completion between 60–69
    },

    excluded: {
      type: Boolean,
      default: false
      // reflection-only pages
    },

    status: {
      type: String,
      enum: ["success", "near-miss", "fail"],
      required: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      required: true
    },
  },
  { timestamps: true }
);

// One stat per day per user
dailyStatsSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyStats", dailyStatsSchema);
