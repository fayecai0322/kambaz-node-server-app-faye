// import Database from "../Database/index.js";
import {v4 as uuidv4} from "uuid";
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
    // const { modules } = Database;
    // const module = modules.find((module) => module._id === moduleId);
    // Object.assign(module, moduleUpdates);
    // return module;
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
    // if (!Database.modules) {
    //     console.error("🚨 Database.modules is undefined!");
    //     return [];  // 返回空数组，避免 `undefined.filter()`
    // }

    // console.log(`📌 Fetching modules for courseId: ${courseId}`);
    // const foundModules = Database.modules.filter((module) => module.course === courseId);
    
    // console.log("✅ Found modules:", foundModules);
    // return foundModules;
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
        if (!courseId || !moduleData || !moduleData.name) {
          throw new Error("Invalid module data");
        }
        const newModule = await model.create({
          _id: uuidv4(),
          course: courseId,
          name: moduleData.name || "New Module",
          description: moduleData.description || "Default description",
          lessons: [],
        });
    
        return newModule;
      } catch (error) {
        console.error("❌ Error in createModule:", error);
        throw error;
      }
    // if (!courseId || !moduleData || !moduleData.name) {
    //     throw new Error("Invalid module data");
    // }
    // const newModule = {
    //     _id: uuidv4(),
    //     course: courseId,
    //     name: moduleData.name || "New Module",
    //     lessons: [],
    //     description: moduleData.description || "Default description",
    // };
    // // 🚨 **确保 `Database.modules` 存在**
    // if (!Database.modules) {
    //     Database.modules = [];
    // }
    // Database.modules.push(newModule);
    // return newModule;
}
export async function addLessonToModule(moduleId, lessonData) {
    try {
        const module = await model.findById(moduleId);
    
        if (!module) {
          throw new Error(`Module with ID ${moduleId} not found`);
        }
    
        const newLesson = {
          _id: uuidv4(),
          name: lessonData.name || "New Lesson",
          description: lessonData.description || "",
          module: moduleId,
        };
    
        module.lessons.push(newLesson);
        await module.save();
    
        return newLesson;
      } catch (error) {
        console.error("❌ Error in addLessonToModule:", error);
        throw error;
      }
    // const { modules } = Database;
    // const module = modules.find((m) => m._id === moduleId);

    // console.log("🧪 moduleId:", moduleId);
    // console.log("📥 lessonData received:", lessonData);
  
    // if (!module) {
    //   console.error("❌ Module not found:", moduleId);
    //   throw new Error(`Module with ID ${moduleId} not found`);
    // }
  
    // const newLesson = {
    //   _id: uuidv4(),
    //   name: lessonData.name || "New Lesson",
    //   description: lessonData.description || "",
    //   module: moduleId,
    // };
  
    // if (!module.lessons) {
    //   module.lessons = [];
    // }
  
    // module.lessons.push(newLesson);
    // console.log("✅ newLesson added:", newLesson);
    // return newLesson;
  }