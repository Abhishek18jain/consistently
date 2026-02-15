import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
      // e.g. "todo_day", "study_day"
    },

    name: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["planning", "list", "work", "study", "reflection"],
      required: true
    },

    schema: {
      type: Object,
      required: true
      /*
        Example:
        {
          tasks: { type: "array", item: "string" },
          completedTasks: { type: "array", item: "string" }
        }
      */
    },

    requiredFields: {
      type: [String],
      default: []
      // fields required for 100% completion
    },

    completionRule: {
      type: String,
      enum: ["checklist", "ratio", "manual"],
      required: true
    },

    affectsStreak: {
      type: Boolean,
      default: true
    },

    coachReadable: {
      type: Boolean,
      default: true
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Template", templateSchema);
