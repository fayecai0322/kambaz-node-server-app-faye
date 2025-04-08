// import Database from "../Database/index.js";
// import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export async function findAssignmentsForCourse(courseId) {
    // return Database.assignments.filter((a) => a.course === courseId);
    return await model.find({ course: courseId });
  }
  
  export async function findAssignmentById(assignmentId) {
    // return Database.assignments.find((a) => a._id === assignmentId);
    return await model.findById(assignmentId);
  }
  
  export async function createAssignment(courseId, assignmentData) {
    try {
      if (assignmentData._id) delete assignmentData._id;
      const newAssignment = {
        ...assignmentData,
        course: courseId,
      };
      console.log("🚀 Creating assignment in DB:", newAssignment);
      const created = await model.create(newAssignment);
      console.log("✅ Assignment created in DB:", created);
      return created;
    } catch (err) {
      console.error("❌ Failed to create assignment:", err);
      throw err;
    };
  }
  
  export async function updateAssignment(assignmentId, updates) {
    return await model.updateOne({ _id: assignmentId }, { $set: updates });
    // const assignment = Database.assignments.find((a) => a._id === assignmentId);
    // if (!assignment) return null;
    // Object.assign(assignment, updates);
    // return assignment;
  }
  
  export async function deleteAssignment(assignmentId) {
    return await model.deleteOne({ _id: assignmentId });
    // const originalLength = Database.assignments.length;
    // Database.assignments = Database.assignments.filter((a) => a._id !== assignmentId);
    // return Database.assignments.length < originalLength;
  }