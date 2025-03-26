import courses from "./courses.js";
import modules from "./modules.js";
import assignments from "./assignments.js";
import users from "./users.js";
import enrollments from "./enrollments.js";
  
// ✅ 兼容前端 `import { enrollments }` 和后端 `import db`
export { courses, modules, assignments, users, enrollments };
export default { courses, modules, assignments, users, enrollments };