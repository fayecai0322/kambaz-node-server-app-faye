// import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";

//findAllCourses
//findCoursesForEnrolledUser(userId)
//createCourse(course)
//deleteCourse(courseId)
//updateCourse(courseId, courseUpdates)

export async function findAllCourses() {
  try {
      const courses = await model.find();
      return courses;
  } catch (error) {
      console.error("Error in findAllCourses:", error);
      throw error;
  }
}
//[NEED UPDATE]
export async function findCoursesForEnrolledUser(userId) {
  try {
    // const { courses, enrollments } = db;

    console.log("🧾 All enrollments:", enrollments);
    console.log("📚 All courses:", courses);
    console.log("🔍 Looking for courses for user:", userId);
    // 1. 先查该用户的所有注册记录
    const enrollments = await enrollmentModel.find({ user: userId });

    // 2. 提取所有注册的 courseId
    const courseIds = enrollments.map((e) => e.course);

    // 3. 查找所有课程
    const courses = await model.find({ _id: { $in: courseIds } });

    return courses;

    // const enrolledCourses = courses.filter((course) =>
    //   enrollments.some((enrollment) => {
    //     const match = enrollment.user === userId && enrollment.course === course._id;
    //     if (match) {
    //       console.log(`✅ Matched course: ${course._id} for user: ${userId}`);
    //     }
    //     return match;
    //   })
    // );

    // console.log("📦 Final enrolled courses:", enrolledCourses);
    // return enrolledCourses;
    return null;
  } catch (error) {
    console.error("Error in findCoursesForEnrolledUser:", error);
    throw error;
  }
}

//Generates a new unique ID for the course
//Saves the new course into Database.courses
//Returns the newly created course
export async function createCourse(course) {
  try {
      const newCourse = { ...course, _id: uuidv4() };
      // db.courses = [...db.courses, newCourse];
      const createdCourse = await model.create(newCourse);//put in database
      return createdCourse;
  } catch (error) {
      console.error("Error in createCourse:", error);
      throw error;
  }
}
//backend ,filters out the course from Database.courses
//Removes all associated enrollments from Database.enrollments.
//[CHECK LATER]
export async function deleteCourse(courseId) {
  try {
      // const { courses, enrollments } = db;
      // db.courses = courses.filter((course) => course._id !== courseId);
      // db.enrollments = enrollments.filter(
      //     (enrollment) => enrollment.course !== courseId
      // );
      const status = await model.deleteOne({_id: courseId});
      // const enrollmentStatus = await enrollmentModel.deleteMany({course: courseId})
      return status;
      // {
        
        // deletedCourseCount: courseDeleteResult.deletedCount,
        // deletedEnrollmentsCount: enrollmentDeleteResult.deletedCount,
      // };

  } catch (error) {
      console.error("Error in deleteCourse:", error);
      throw error;
  }
}

export async function updateCourse(courseId, courseUpdates) {
  try {
      const status = await model.updateOne(
        {_id:courseId}
        ,{$set: courseUpdates}
        );
      return status;
  } catch (error) {
      console.error("Error in updateCourse:", error);
      throw error;
  }
}