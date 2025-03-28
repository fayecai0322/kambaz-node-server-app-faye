import Database from "../Database/index.js";
import {v4 as uuidv4} from "uuid";

export function updateModule(moduleId, moduleUpdates) {
    const { modules } = Database;
    const module = modules.find((module) => module._id === moduleId);
    Object.assign(module, moduleUpdates);
    return module;
}
    
export function deleteModule(moduleId){
    const {modules} = Database;
    Database.modules = modules.filter((module) => module._id !== moduleId);
}

export function findModulesForCourse(courseId) {
    if (!Database.modules) {
        console.error("🚨 Database.modules is undefined!");
        return [];  // 返回空数组，避免 `undefined.filter()`
    }

    console.log(`📌 Fetching modules for courseId: ${courseId}`);
    const foundModules = Database.modules.filter((module) => module.course === courseId);
    
    console.log("✅ Found modules:", foundModules);
    return foundModules;
}

// ✅ 添加模块
export function createModule(courseId, moduleData) {
    if (!courseId || !moduleData || !moduleData.name) {
        throw new Error("Invalid module data");
    }
    const newModule = {
        _id: uuidv4(),
        course: courseId,
        name: moduleData.name || "New Module",
        lessons: [],
        description: moduleData.description || "Default description",
    };
    // 🚨 **确保 `Database.modules` 存在**
    if (!Database.modules) {
        Database.modules = [];
    }
    Database.modules.push(newModule);
    return newModule;
}
export function addLessonToModule(moduleId, lessonData) {
    const { modules } = Database;
    const module = modules.find((m) => m._id === moduleId);

    console.log("🧪 moduleId:", moduleId);
    console.log("📥 lessonData received:", lessonData);
  
    if (!module) {
      console.error("❌ Module not found:", moduleId);
      throw new Error(`Module with ID ${moduleId} not found`);
    }
  
    const newLesson = {
      _id: uuidv4(),
      name: lessonData.name || "New Lesson",
      description: lessonData.description || "",
      module: moduleId,
    };
  
    if (!module.lessons) {
      module.lessons = [];
    }
  
    module.lessons.push(newLesson);
    console.log("✅ newLesson added:", newLesson);
    return newLesson;
  }