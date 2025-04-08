import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema(
    {
        _id:String,
        course: {type: mongoose.Schema.Types.ObjectId, ref:"CourseModel"}, //foreign key, they are related
        user:{type: mongoose.Schema.Types.ObjectId, ref:"UserModel"},//foreign key, they are related
        grade:Number,
        letterGrade:String,
        enrollmentDate:Date,
        status:{
            type:String,
            enum:["ENROLLED","DROPPED","COMPLETED"],
            default:"ENROLLED",
        },
    },
    {collection:"enrollments"}
);
export default enrollmentSchema;