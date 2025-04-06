import mongoose from "mongoose";
import schema from "./schemas.js";
const model = mongoose.model("CourseModel",schema);
export default model;