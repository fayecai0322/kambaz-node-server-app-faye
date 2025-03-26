import * as courseDao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";


export default function CourseRoutes(app) {
    // ✅ 获取所有课程
    app.get("/api/courses", (req, res) => {
        const courses = courseDao.findAllCourses();
        res.send(courses);
    });
    //BACKEND . Extracts courseId from the request
    //Calls the deleteCourse function in the DAO layer.
    app.delete("/api/courses/:courseId", (req,res) => {
        const {courseId} = req.params;
        const status = courseDao.deleteCourse(courseId);
        res.send(status);
    });

    app.put("/api/courses/:courseId", (req,res) => {
        const {courseId} = req.params;
        const courseUpdates = req.body;
        const status = courseDao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });

    app.post("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const moduleData = req.body;
    
        if (!courseId || !moduleData || !moduleData.name) {
            return res.status(400).json({ error: "Invalid module data" });
        }
    
        const newModule = modulesDao.createModule(courseId, moduleData);
        res.status(201).json(newModule);
    });

    app.get("/api/courses/:courseId/modules", (req,res) => {
        const {courseId} = req.params;
        const modules = modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });

}