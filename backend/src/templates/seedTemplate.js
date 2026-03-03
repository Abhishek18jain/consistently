import mongoose from "mongoose";
import Template from "../models/template.model.js";
import { templates } from "../templates/index.js"; // your array

async function seed() {
  try {
    await mongoose.connect("mongodb://localhost:27017/consistently?directConnection=true");

    // Optional: wipe old templates
    await Template.deleteMany({});

    await Template.insertMany(templates);

    console.log("Templates seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();