import express from "express";
import * as enrollmentsDao from "./dao.js";

const router = express.Router();  // ✅ 必须先定义 router

export default function EnrollmentRoutes(app){
    // ✅ 用户注册课程
    router.post("/", (req, res) => {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({ error: "userId and courseId are required" });
        }
        enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.status(201).json({ message: "Enrollment successful", userId, courseId });
    });

    // ✅ 获取某个用户的所有注册课程
    router.get("/:userId", (req, res) => {
        const { userId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    });

    // ✅ 取消用户注册的课程
    router.delete("/:userId/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        res.status(204).send(); // No Content
    });
    app.use("/api/enrollments", router);  // ✅ 关键：正确挂载路由

}