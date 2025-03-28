import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAllCourses(){
    return Database.courses;
}
export function findCoursesForEnrolledUser(userId){
    const { courses, enrollments } = Database;
  
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
  }

//Generates a new unique ID for the course
//Saves the new course into Database.courses
//Returns the newly created course
export function createCourse(course){
    const newCourse = {...course, _id:uuidv4()};
    Database.courses = [...Database.courses,newCourse];
    return newCourse;
}
//backend ,filters out the course from Database.courses
//Removes all associated enrollments from Database.enrollments.
export function deleteCourse(courseId){
    const {courses, enrollments} = Database;
    Database.courses = courses.filter((course) => course._id !== courseId);
    Database.enrollments = enrollments.filter(
        (enrollment) => enrollment.course !== courseId
    );
}

export function updateCourse(courseId, courseUpdates){
    const {courses} = Database;
    const course = courses.find((course)=>course._id === courseId);
    Object.assign(course, courseUpdates);
    return course;
}