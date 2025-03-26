import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAssignmentsForCourse(courseId) {
    return Database.assignments.filter((a) => a.course === courseId);
  }
  
  export function findAssignmentById(assignmentId) {
    return Database.assignments.find((a) => a._id === assignmentId);
  }
  
  export function createAssignment(courseId, assignmentData) {
    const newAssignment = {
      _id: uuidv4(),
      course: courseId,
      title: assignmentData.title || "Untitled Assignment",
      description: assignmentData.description || "",
      points: assignmentData.points || 100,
      due: assignmentData.due || "",
      availableFrom: assignmentData.availableFrom || "",
      availableUntil: assignmentData.availableUntil || "",
    };
    Database.assignments.push(newAssignment);
    return newAssignment;
  }
  
  export function updateAssignment(assignmentId, updates) {
    const assignment = Database.assignments.find((a) => a._id === assignmentId);
    if (!assignment) return null;
    Object.assign(assignment, updates);
    return assignment;
  }
  
  export function deleteAssignment(assignmentId) {
    const originalLength = Database.assignments.length;
    Database.assignments = Database.assignments.filter((a) => a._id !== assignmentId);
    return Database.assignments.length < originalLength;
  }