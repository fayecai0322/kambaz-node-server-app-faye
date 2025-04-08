import mongoose from "mongoose";
const schema = new mongoose.Schema(
    {
        // _id: String,
        name: String,
        description: String,
        course:{type:String, ref: "CourseModel"}, //ref matches name "./Courses/model"
        lessons: [
            {
              _id: { type: mongoose.Schema.Types.ObjectId, auto: true },  // ✅ 添加这一行
              name: String,
              description: String,
              editing: { type: Boolean, default: false },
            },
          ],
    },
    {collection:"modules"}
);
export default schema;