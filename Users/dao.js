// import db from "../Database/index.js";
import {v4 as uuidv4} from "uuid";
import model from "./model.js";

// let {users} =db;

//创建新用户，并为其生成唯一 ID（UUID）
// export const createUser = async(user) => {
//   if(user._id){
//     delete user._id;// 避免干扰 MongoDB 自动生成 _id
//   }
//   return await model.create(user);// mongoose 自动生成 _id
//     // const newUser = { ...user, _id: uuidv4() };
//     // console.log("✅ Creating new user:", newUser);
//     // const createdUser = await model.create(newUser);
//     // return createdUser;
// };
export const createUser = async (user) => {
  // 完全移除 _id 字段（哪怕是 undefined 或空也删掉）
  if (user.hasOwnProperty("_id")) {
    delete user._id;
  }
  // 插入数据库，让 MongoDB 自动生成 _id
  return await model.create(user);
};
//获取所有用户
export const findAllUsers = () => model.find();//before: db.users, update to non sql dbs
//根据 ID 查找用户
export const findUserById = (userId) => model.findById(userId);//users.find((user) => user._id === userId);
//根据用户名查找用户
export const findUserByUsername = (username) => model.findOne({username:username});//users.find((user) => user.username === username); 
//验证用户身份（登录时使用）
export const findUserByCredentials = async (username, password) => {
  console.log("🔐 Looking for user with username:", username, "and password:", password);

  const userByUsername = await model.findOne({ username });
  console.log("🧪 Found by username only:", userByUsername);

  const user = await model.findOne({ username, password });
  console.log("🧪 Found by both username & password:", user);
  return user;
};


//更新用户信息
export const updateUser = (userId, user) => model.updateOne({_id:userId},{$set:user});

//删除用户
export const deleteUser = (userId) => model.deleteOne({_id:userId});

export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName,"i");
  return model.find({
    $or:[{firstName:{$regex:regex}},{lastName:{$regex:regex}}],
  });
};

export const findUsersByRole = async (role) => {
  try {
    const users = await model.find({ role });
    return users;
  } catch (error) {
    console.error("❌ Error in findUsersByRole:", error);
    throw error;
  }
};
