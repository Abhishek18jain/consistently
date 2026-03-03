// models/template.model.js

import mongoose from "mongoose";
const blockSchema = new mongoose.Schema({
  type: String,
  variant: String
}, { _id: false });

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    type: {
      type: String,
      required: true,
      index: true,
    },

    description: String,

    thumbnail: String,
      blocks: [blockSchema],
       templateKind: String,
         tags: [String]
,


    structureJSON: {
      type: Array, // same block structure
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Template", templateSchema);