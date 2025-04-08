import * as modulesDao from "./dao.js";
import express from "express";

const router = express.Router(); // ✅ 正确初始化 `router`

export default function ModuleRoutes(app){
    // ✅ 更新模块信息
    app.put("/api/modules/:moduleId", async(req, res) => {
        try {
            const { moduleId } = req.params;
            const moduleUpdates = req.body;
            const updatedModule = await modulesDao.updateModule(moduleId, moduleUpdates);
            res.json(updatedModule);
        } catch (error) {
            console.error("Error updating module:", error);
            res.status(500).json({ error: "Failed to update module" });
        }
    });

    // ✅ 删除模块
    app.delete("/api/modules/:moduleId",  async (req, res) => {
        try {
            const { moduleId } = req.params;
            const status = await modulesDao.deleteModule(moduleId);
            res.json({ success: status });
        } catch (error) {
            console.error("Error deleting module:", error);
            res.status(500).json({ error: "Failed to delete module" });
        }
    });

    // ✅ 添加模块
    router.post("/courses/:courseId/modules", async(req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const moduleData = req.body;
        // 🚨 **防止 `courseId` 或 `moduleData` 为空**
        if (!courseId || !moduleData || !moduleData.name) {
            return res.status(400).json({ error: "Invalid module data" });
        }
        try {
            const newModule = await modulesDao.createModule(module); 
            res.status(201).json(newModule);
        } catch (error) {
            console.error("Error creating module:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    // ✅ 获取特定课程的所有模块
    app.get("/api/courses/:courseId/modules", async(req, res) => {
        try {
            const { courseId } = req.params;
            console.log(`📌 GET request received for courseId: ${courseId}`);
            const modules = await modulesDao.findModulesForCourse(courseId);
            console.log("✅ Returning modules:", modules);
            res.json(modules);
        } catch (error) {
            console.error("Error fetching modules:", error);
            res.status(500).json({ error: "Failed to fetch modules" });
        }
    });
        // 添加 lesson 路由
    router.post("/modules/:moduleId/lessons", async(req, res) => {
        try {
        const { moduleId } = req.params;
        const lessonData = req.body;
        const newLesson = await modulesDao.addLessonToModule(moduleId, lessonData);
        res.status(201).json(newLesson);
        } catch (error) {
        console.error("❌ Error adding lesson:", error);
        res.status(500).json({ error: "Failed to add lesson" });
        }
    });

    router.put("/modules/:moduleId/lessons/:lessonId", async (req, res) => {
        try {
            const { moduleId, lessonId } = req.params;
            const updates = req.body;
            const updatedLesson = await modulesDao.updateLesson(moduleId, lessonId, updates);
            res.json(updatedLesson);
        } catch (error) {
            console.error("❌ Error updating lesson:", error);
            res.status(500).json({ error: "Failed to update lesson" });
        }
        });
    app.use("/api",router); // ✅ 挂载到 app 上
}
