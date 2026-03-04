import mongoose from "mongoose";
import dotenv from "dotenv";
import Template from "../src/models/template.model.js";
import { templates } from "../src/templates/index.js";

dotenv.config();

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Find and delete existing ones or just insert if missing.
        // For safety, let's upsert by name
        for (const t of templates) {
            await Template.findOneAndUpdate({ name: t.name }, t, { upsert: true, new: true });
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed", err);
        process.exit(1);
    }
}

seed();
