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
// import SessionController from './Lab5/SessionController.js';

const app = express(); // 创建 Express 实例

    app.use(
        cors({
            credentials: true,
            origin: [
                process.env.NETLIFY_URL, // ✅ 线上 Netlify 部署
                "http://localhost:5173", // ✅ Vite 本地开发
                "http://localhost:4000", // ✅ API 服务器本地测试
                "https://kambaz-react-web-app-a5-new.netlify.app",
            ].filter(Boolean), // ❗ 确保不会传入 `undefined`
            methods: "GET,POST,PUT,DELETE,OPTIONS",
            allowedHeaders: "Content-Type,Authorization",
        })
    );
// ✅ 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ✅ 设置 Session
// const sessionOptions = {
//     secret: process.env.SESSION_SECRET || "kambaz",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       sameSite: "none",
//       secure: true, // Heroku/Render 默认使用 HTTPS
//     }
//   };
/** ✅ Session 设置，兼容开发和生产 */
const isDev = process.env.NODE_ENV === "development";
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  proxy: !isDev,
  cookie: {
    sameSite: isDev ? "lax" : "none", // 本地 lax，生产 none
    secure: !isDev                   // 本地 false，生产 true（HTTPS 才能 set-cookie）
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

app.use((req, res, next) => {
    console.log("🧠 Session:", req.session);
    next();
  });
//Kamabaz Project
UserRoutes(app);
CourseRoutes(app);
EnrollmentRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);

//Lab Part
Hello(app) //pass app reference to Hello
Lab5(app);
// SessionController(app);

const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => {

    console.log("UserRoutes:", typeof UserRoutes);
    console.log("CourseRoutes:", typeof CourseRoutes);
    console.log("EnrollmentRoutes:", typeof EnrollmentRoutes);
    console.log("ModuleRoutes:", typeof ModuleRoutes);
    console.log(`✅ Server running on http://localhost:${PORT}`);
});