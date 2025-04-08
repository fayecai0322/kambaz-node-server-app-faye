import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/courses/:courseId/assignments", async(req, res) => {
    const assignments = await dao.findAssignmentsForCourse(req.params.courseId);
    res.send(assignments);
  });

  app.get("/api/assignments/:assignmentId", async(req, res) => {
    const assignment = await dao.findAssignmentById(req.params.assignmentId);
    res.send(assignment);
  });

  app.post("/api/courses/:courseId/assignments", async(req, res) => {
    const { courseId } = req.params;
    const assignmentData = req.body;
  
    console.log("📥 New assignment request for course:", courseId);
    console.log("📝 Assignment data:", assignmentData);
  
    const newAssignment = await dao.createAssignment(courseId, assignmentData);
    console.log("✅ Assignment created:", newAssignment);
  
    res.status(201).send(newAssignment);
  });

  app.put("/api/assignments/:assignmentId", async(req, res) => {
    const updated = await dao.updateAssignment(req.params.assignmentId, req.body);
    res.send(updated);
  });

  app.delete("/api/assignments/:assignmentId", async(req, res) => {
    await dao.deleteAssignment(req.params.assignmentId);
    res.sendStatus(204);
  });
}