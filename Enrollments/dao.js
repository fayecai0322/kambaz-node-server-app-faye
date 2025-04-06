// import Database from "../Database/index.js";
import {v4 as uuidv4} from "uuid";
import model from "./model.js";

//Takes the current user ID and the newly created course ID
//Saves the association to the Database.enrollments table
// ✅ 用户注册课程（插入一条 enrollment 数据）
export async function enrollUserInCourse(userId, courseId) {
  try {
    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId,
      enrollmentDate: new Date(),
      status: "ENROLLED"
    };
    const result = await model.create(newEnrollment);
    return result;
  } catch (error) {
    console.error("❌ Error enrolling user:", error);
    throw error;
  }
}
  
// ✅ 取消注册（根据 userId 和 courseId 删除记录）
export async function unenrollUserFromCourse(userId, courseId) {
  try {
    const result = await model.deleteOne({ user: userId, course: courseId });
    return result;
  } catch (error) {
    console.error("❌ Error unenrolling user:", error);
    throw error;
  }
}
// ✅ 查找某用户所有注册记录
export async function findEnrollmentsByUser(userId) {
  try {
    const enrollments = await model.find({ user: userId });
    return enrollments;
  } catch (error) {
    console.error("❌ Error fetching enrollments:", error);
    throw error;
  }
}

// ✅ 查找某课程的所有注册记录
export async function findEnrollmentsForCourse(courseId) {
  try {
    const enrollments = await model.find({ course: courseId });
    return enrollments;
  } catch (error) {
    console.error("❌ Error fetching enrollments for course:", error);
    throw error;
  }
}

export async function findAllEnrollments() {
  return await model.find();
}