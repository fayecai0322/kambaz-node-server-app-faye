import express from "express";
import * as enrollmentsDao from "./dao.js";

const router = express.Router();  // ✅ 必须先定义 router

export default function EnrollmentRoutes(app){
    const findEnrollmentsForCourse = async(req,res) =>{
        const{courseId} = req.params;
        const enrollments = await enrollmentsDao.findEnrollmentsForCourse(courseId);
        res.json(enrollments);
    }
    const findAllEnrollments = async (req, res) => {
        const all = await enrollmentsDao.findAllEnrollments();
        res.json(all);
      };
    const findEnrollmentsForUser = async (req, res) => {
    const { userId } = req.params;
    const enrollments = await enrollmentsDao.findEnrollmentsByUser(userId);
    res.json(enrollments);
    };
    // ✅ 用户注册课程
    router.post("/", async (req, res) => {
        const { userId, courseId } = req.body;
        if (!userId || !courseId) {
          return res.status(400).json({ error: "userId and courseId are required" });
        }
        const enrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.status(201).json(enrollment);
      });

    // ✅ 获取某个用户的所有注册课程
    router.get("/:userId", async (req, res) => {
        const { userId } = req.params;
        const enrollments = await enrollmentsDao.findEnrollmentsByUser(userId);
        res.json(enrollments);
      });

    // ✅ 取消用户注册的课程
    router.delete("/:userId/:courseId", async (req, res) => {
        const { userId, courseId } = req.params;
        await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        res.status(204).send(); // No Content
      });
    app.use("/api/enrollments", router);  // ✅ 关键：正确挂载路由
    app.get("/api/user/:userId/enrollments", findEnrollmentsForUser);
    app.get("/api/enrollments",findAllEnrollments);
    app.get("/api/course/:courseId/enrollments",findEnrollmentsForCourse);
}