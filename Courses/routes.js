import * as courseDao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


export default function CourseRoutes(app) {
    // ✅ 获取所有课程
    app.get("/api/courses", async(req, res) => {
        const courses = await courseDao.findAllCourses();
        res.send(courses);
    });

    // ✅ 创建新课程（教材新增的部分）
    app.post("/api/courses", async (req, res) => {
        const course = await courseDao.createCourse(req.body);
        res.json(course);
    });
    //BACKEND . Extracts courseId from the request
    //Calls the deleteCourse function in the DAO layer.
    // ✅ 删除课程
    app.delete("/api/courses/:courseId", async (req,res) => {
        const {courseId} = req.params;
        const status = await courseDao.deleteCourse(courseId);
        res.send(status);
    });
    // ✅ 更新课程
    app.put("/api/courses/:courseId", async (req,res) => {
        const {courseId} = req.params;
        const courseUpdates = req.body;
        const status = await courseDao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });
    // ✅ 创建模块
    app.post("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const moduleData = req.body;
    
        if (!courseId || !moduleData || !moduleData.name) {
            return res.status(400).json({ error: "Invalid module data" });
        }
    
        const newModule = await modulesDao.createModule(courseId, moduleData);
        res.status(201).json(newModule);
    });
    // ✅ 获取某个课程下所有模块
    app.get("/api/courses/:courseId/modules", async (req,res) => {
        const {courseId} = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });
    // ✅ 获取某课程的所有注册学生
    app.get("/api/courses/:cid/users", async (req, res) => {
        const { cid } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(cid);
        res.json(users);
    });

     // ✅ 创建新课程并自动为作者注册
     app.post("/api/courses", async (req, res) => {
        const course = await courseDao.createCourse(req.body);
        const currentUser = req.session["currentUser"]; // ✅ 获取当前用户
        if (currentUser) {
            await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id); // ✅ 注册课程
        }
        res.json(course);
    });

}