import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
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

    bookType: {
      type: String,
      enum: ["blank", "exam", "travel", "planning"],
      default: "blank",
    },

    allowedTemplates: {
      type: [String],
      default: [],
      // example: ["todo", "study", "planning"]
    },

    totalPages: {
      type: Number,
      default: 0,
    },

    lastPageDate: {
      type: Date,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
  
)
export default mongoose.model("Book", bookSchema);