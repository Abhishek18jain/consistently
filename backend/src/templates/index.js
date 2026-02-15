import mongoose from "mongoose";
import Template from "../models/template.model.js";
import dotenv from "dotenv";

dotenv.config();
const templates = [
  {
    key: "todo_day",
    name: "Daily To-Do",
    category: "planning",
    completionRule: "checklist",
    affectsStreak: true,
    coachReadable: true,
    active: true,
    schema: {
      tasks: [
        {
          title: String,
          done: Boolean
        }
      ]
    },
    requiredFields: ["tasks"]
  },
  {
    key: "ratio_day",
    name: "Ratio Tracking",
    category: "work",
    completionRule: "ratio",
    affectsStreak: true,
    coachReadable: true,
    active: true,
    schema: {
      target: Number,
      completed: Number
    },
    requiredFields: ["target", "completed"]
  },
  {
    key: "reflection_day",
    name: "Reflection",
    category: "reflection",
    completionRule: "manual",
    affectsStreak: false,
    coachReadable: false,
    active: true,
    schema: {
      note: String
    },
    requiredFields: ["note"]
  }
];


async function seedTemplates() {
  try {
    await mongoose.connect("mongodb://localhost:27017/consistently?directConnection=true");

    await Template.deleteMany({});
    await Template.insertMany(templates);

    console.log("Templates seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedTemplates();
