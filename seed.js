import Database from "../kambaz-react-web-app/src/Kambaz/Database/index.js";
import { v4 as uuidv4 } from "uuid";

// ✅ 预填充测试数据
Database.courses.push({
  _id: "123",
  name: "Test Course",
  number: "CS101",
  startDate: "2023-01-10",
  endDate: "2023-06-10",
  description: "This is a test course.",
});

// ✅ 让 `faye` 注册 `Test Course`
Database.enrollments.push({
  _id: uuidv4(),  // 生成唯一 ID
  user: "faye",   // 关联用户 faye
  course: "123",  // 课程 ID 对应 Test Course
});

console.log("✅ Test course added:", Database.courses);
console.log("✅ faye enrolled in Test Course:", Database.enrollments);
