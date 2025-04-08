// Assignments/schema.js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    points: Number,
    due: String,
    availableFrom: String,
    availableUntil: String,
    course: {
      type: String,
      ref: "CourseModel",
      required: true,
    },
  },
  { collection: "assignments" }
);

export default schema;
