import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    templateType: {
      type: String,
      required: true,
      // examples: todo, grocery, study, work, planning, reflection
    },

    content: {
      type: Object,
      default: {},
    },

    completionPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

   
  isReflection: {
      type: Boolean,
      default: false
    },

    isLocked: {
      type: Boolean,
      default: false, // true for reflection
    },
  },
  { timestamps: true }
);

// 🚫 HARD RULE: ONE PAGE PER DAY PER BOOK
pageSchema.index({ bookId: 1, date: 1 }, { unique: true });

export default mongoose.model("Page", pageSchema);
