// models/page.model.js

import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "checklist", "image", "divider"],
      required: true,
    },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    journalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journal",
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    contentJSON: {
      type: [blockSchema],
      default: [],
    },

    createdFromTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * 🔥 ENFORCE ONE PAGE PER DATE PER JOURNAL
 */
pageSchema.index({ journalId: 1, date: 1 }, { unique: true });

export default mongoose.model("Page", pageSchema);