import Database from "../Database/index.js";
import {v4 as uuidv4} from "uuid";

//Takes the current user ID and the newly created course ID
//Saves the association to the Database.enrollments table
export function enrollUserInCourse(userId, courseId){
    const {enrollments} = Database;
    enrollments.push({_id:uuidv4(), user:userId, course:courseId});
}
export function findEnrollmentsByUser(userId) {
    return Database.enrollments.filter(e => e.user === userId);
  }