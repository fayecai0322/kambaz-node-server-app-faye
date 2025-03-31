import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export async function findAllCourses(db = Database) {
  try {
      return db.courses;
  } catch (error) {
      console.error("Error in findAllCourses:", error);
      throw error;
  }
}
export async function findCoursesForEnrolledUser(userId, db = Database) {
  try {
    const { courses, enrollments } = db;

    console.log("🧾 All enrollments:", enrollments);
    console.log("📚 All courses:", courses);
    console.log("🔍 Looking for courses for user:", userId);

    const enrolledCourses = courses.filter((course) =>
      enrollments.some((enrollment) => {
        const match = enrollment.user === userId && enrollment.course === course._id;
        if (match) {
          console.log(`✅ Matched course: ${course._id} for user: ${userId}`);
        }
        return match;
      })
    );

    console.log("📦 Final enrolled courses:", enrolledCourses);
    return enrolledCourses;
  } catch (error) {
    console.error("Error in findCoursesForEnrolledUser:", error);
    throw error;
  }
}

//Generates a new unique ID for the course
//Saves the new course into Database.courses
//Returns the newly created course
export async function createCourse(course, db = Database) {
  try {
      const newCourse = { ...course, _id: uuidv4() };
      db.courses = [...db.courses, newCourse];
      return newCourse;
  } catch (error) {
      console.error("Error in createCourse:", error);
      throw error;
  }
}
//backend ,filters out the course from Database.courses
//Removes all associated enrollments from Database.enrollments.
export async function deleteCourse(courseId, db = Database) {
  try {
      const { courses, enrollments } = db;
      db.courses = courses.filter((course) => course._id !== courseId);
      db.enrollments = enrollments.filter(
          (enrollment) => enrollment.course !== courseId
      );
  } catch (error) {
      console.error("Error in deleteCourse:", error);
      throw error;
  }
}

export async function updateCourse(courseId, courseUpdates, db = Database) {
  try {
      const { courses } = db;
      const course = courses.find((course) => course._id === courseId);
      if (course) {
          Object.assign(course, courseUpdates);
          return course;
      }
      return null;
  } catch (error) {
      console.error("Error in updateCourse:", error);
      throw error;
  }
}