import Database from "../Database/index.js";
import {v4 as uuidv4} from "uuid";

//Takes the current user ID and the newly created course ID
//Saves the association to the Database.enrollments table
export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  }
  
  export function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = Database;
    const index = enrollments.findIndex(e => e.user === userId && e.course === courseId);
    if (index !== -1) enrollments.splice(index, 1);
  }
export function findEnrollmentsByUser(userId) {
    return Database.enrollments.filter(e => e.user === userId);
  }