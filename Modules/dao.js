// import Database from "../Database/index.js";
// import {v4 as uuidv4} from "uuid";
import model from "./model.js";

export async function updateModule(moduleId, moduleUpdates) {
    try {
        const status = await model.updateOne(
            {_id: moduleId},
            {$set:moduleUpdates}
        );
        return status;
    }catch(error){
        console.error("❌ Error in updateModule:", error);
        throw error;
    }
}
    
export async function deleteModule(moduleId){
    // const {modules} = Database;
    // Database.modules = modules.filter((module) => module._id !== moduleId);
    try{
        const status = await model.deleteOne({_id:moduleId});
        return status;
    }catch (error){
        console.error("❌ Error in deleteModule:", error);
        throw error;
    }
}

export async function findModulesForCourse(courseId) {
    try{
        const foundModules = await model.find({ course: courseId });
        return foundModules;    
    }catch(error){
        console.error("❌ Error in findModulesForCourse:", error);
        throw error;
    }
}

// ✅ 添加模块
export async function createModule(courseId, moduleData) {
    try {
      if (moduleData._id) {
        delete moduleData._id;
      }
    // 组合新的模块对象，带上课程 ID
    const newModule = {
      ...moduleData,
      course: courseId,
    };
    // 存入 MongoDB
    const createdModule = await model.create(newModule);
    return createdModule;
    } catch (error) {
      console.error("❌ Error in createModule:", error);
      throw error;
    }
}
export async function addLessonToModule(moduleId, lessonData) {
  try {
    const module = await model.findById(moduleId);
    if (!module) {
      throw new Error(`Module with ID ${moduleId} not found`);
    }

    const newLesson = {
      name: lessonData.name || "New Lesson",
      description: lessonData.description || "",
      editing: lessonData.editing || false,
    };

    module.lessons.push(newLesson);
    await module.save();

    console.log("✅ 成功添加 lesson，新 lesson 列表:", module.lessons);
    // ✅ 返回新添加的那一个 lesson（包含自动生成的 _id）
    return module.lessons[module.lessons.length - 1];
  } catch (error) {
    console.error("❌ Error in addLessonToModule:", error);
    throw error;
  }
}
export async function updateLesson(moduleId, lessonId, updates) {
  try {
    const module = await model.findById(moduleId);
    if (!module) throw new Error(`Module ${moduleId} not found`);

    console.log("📋 module.lessons:", module.lessons.map((l) => l._id?.toString()));
    console.log("🔍 lessonId param:", lessonId);

    const lesson = module.lessons.find(
      (l) => l._id?.toString() === lessonId?.toString()
    );

    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found in module ${moduleId}`);
    }

    Object.assign(lesson, updates);
    await module.save();

    console.log("✅ Lesson updated:", lesson);
    return lesson;
  } catch (error) {
    console.error("❌ Error in updateLesson:", error);
    throw error;
  }
}