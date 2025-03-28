import db from "../Database/index.js";
import {v4 as uuidv4} from "uuid";

let {users} =db;

//创建新用户，并为其生成唯一 ID（UUID）
export const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    console.log("✅ Creating new user:", newUser);

    users = [...users, newUser];
    db.users = users;  // ✅ 确保存入 database
    console.log("🔄 Updated users list:", db.users);
    return newUser;
};
//获取所有用户
export const findAllUsers = () => db.users; 
//根据 ID 查找用户
export const findUserById = (userId) => users.find((user) => user._id === userId);
//根据用户名查找用户
export const findUserByUsername = (username) => users.find((user) => user.username === username); 
//验证用户身份（登录时使用）
export const findUserByCredentials = async (username, password) => {
    return Database.users.find(
        (u) => u.username === username && u.password === password
    );
};
//更新用户信息
export const updateUser = (userId, user) => (users = users.map((u) => (u._id === userId ? user : u)));
//删除用户
export const deleteUser = (userId) => (users = users.filter((u) => u._id !== userId)); 
