import express from 'express';
import cors from "cors";
import Hello from "./Hello.js"; //import hello
import Lab5 from './Lab5/index.js';
import UserRoutes from "./Users/routes.js";
import CourseRoutes from "./Courses/routes.js";
import EnrollmentRoutes from "./Enrollments/routes.js";
import ModuleRoutes from "./Modules/routes.js";
import AssignmentRoutes from "./Assignments/routes.js"; 
import session from "express-session";
import "dotenv/config";


const app = express(); // 创建 Express 实例
// ✅ 允许前端 http://localhost:5173 访问
// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: "Content-Type,Authorization"
// }));
    // app.use(
    //     cors({
    //     credentials: true, // ✅ 让请求带上 cookies 和 session
    //     origin: process.env.NETLIFY_URL || "http://localhost:5173" ,  // ✅ 允许多个环境
    //     })
    // );

    app.use(
        cors({
            credentials: true,
            origin: [
                process.env.NETLIFY_URL, // ✅ 线上 Netlify 部署
                "http://localhost:5173", // ✅ Vite 本地开发
                "http://localhost:4000", // ✅ API 服务器本地测试
                "https://kambaz-react-web-app-a5.netlify.app",
            ].filter(Boolean), // ❗ 确保不会传入 `undefined`
            methods: "GET,POST,PUT,DELETE,OPTIONS",
            allowedHeaders: "Content-Type,Authorization",
        })
    );
// const sessionOptions = {
//     secret: process.env.SESSION_SECRET || "kambaz",//用于加密 session 数据
//     resave: false,//禁止无修改时重新保存 session
//     saveUninitialized: false, //禁止存储未初始化的 session
// };

// ✅ 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ✅ 设置 Session
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: true, // Heroku/Render 默认使用 HTTPS
    }
  };

// ✅ 仅在生产环境启用 `secure`，开发环境允许 HTTP
if (process.env.NODE_ENV !== "development"){
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite:"none", // 允许跨域 cookies
        secure:true,  // 仅 HTTPS 允许
        // domain:process.env.NODE_SERVER_DOMAIN, // 限制 cookie 作用域
    };
}

// ✅ 确保 JSON 解析（⚠️ 确保在所有路由之前）
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));

//Kamabaz Project
UserRoutes(app);
CourseRoutes(app);
EnrollmentRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);

//Lab Part
Hello(app) //pass app reference to Hello
Lab5(app);

const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => {
     // ✅ 在服务器启动后再检查路由
    // console.log("📌 注册的路由列表:", 
    //     app._router.stack
    //         .map(layer => layer.route && layer.route.path)
    //         .filter(Boolean)
    // );
    console.log("UserRoutes:", typeof UserRoutes);
    console.log("CourseRoutes:", typeof CourseRoutes);
    console.log("EnrollmentRoutes:", typeof EnrollmentRoutes);
    console.log("ModuleRoutes:", typeof ModuleRoutes);
    console.log(`✅ Server running on http://localhost:${PORT}`);
});