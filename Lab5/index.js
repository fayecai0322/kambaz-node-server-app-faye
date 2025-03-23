import PathParameters from "./PathParameters.js";
import QueryParameters from "./QueryParameters.js";
import WorkingWithArrays from "./WorkingWithArrays.js";

export default function Lab5(app) {
    console.log("📢 Registering Lab5 API...");

    app.get("/lab5/welcome", (req, res) => {
        res.send("Welcome to Lab 5");
    });

    // ✅ 注册不同的 API 端点
    PathParameters(app);
    QueryParameters(app);
    WorkingWithArrays(app);

    console.log("✅ Lab5 API routes registered!");
}