import mongoose from "mongoose";
const schema = new mongoose.Schema(
    {
        // _id: String,
        name: String,
        description: String,
        credits: Number,
        department: String,
    },
    {collection:"courses"}
);
export default schema;