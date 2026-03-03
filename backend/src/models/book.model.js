import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
      default: "My Journal",
    },

    journalType: {
      type: String,
      enum: [
        "todo",
        "planner",
        "study",
        "reflection",
        "fitness",
        "blank",
        "travel",
        "habit",
        "budget",
        "matrix",
        "workspace",
        "energy",
        "focus"
      ],
      required: true,
      index: true,
    },

    /* default template */
    defaultTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },

    /* fast open last page */
    currentPageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      default: null,
    },

    currentPageDate: {
      type: String, // YYYY-MM-DD
      default: null,
    },

    totalPages: {
      type: Number,
      default: 0,
    },

    lastPageDate: {
      type: String, // YYYY-MM-DD
      default: null,
    },

    settings: {
      allowFuturePages: {
        type: Boolean,
        default: false,
      },

      autoCreateDailyPage: {
        type: Boolean,
        default: true,
      },
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Journal", journalSchema);