import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import model from "./model.js";

//let currentUser = null;
export default function UserRoutes(app){
    const createUser = async(req, res) => {
        try {
            const user = await dao.createUser(req.body);
            res.status(201).json(user);
          } catch (e) {
            console.error("❌ Error creating user:", e);
            res.status(500).json({ error: e.message || "Error creating user" });
          }
     };
     const deleteUser = async (req, res) => {
        console.log("🗑️ Deleting user:", req.params.userId);
        try {
          const result = await dao.deleteUser(req.params.userId);
          if (result.deletedCount === 1) {
            res.json({ success: true, message: "User deleted." });
          } else {
            res.status(404).json({ success: false, message: "User not found." });
          }
        } catch (err) {
          console.error("❌ Delete user failed:", err);
          res.status(500).json({ success: false, error: err.message });
        }
      };
    const findAllUsers = async(req, res) => {
        const {role,name} = req.query;
        if(role){
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }
        if(name){
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
     };
    const updateUser = async (req, res) => {
        try {
            const userId = req.params.userId;
            const userUpdates = req.body;
            await dao.updateUser(userId, userUpdates);
            const currentUser = await dao.findUserById(userId);
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    };
    const signup = async (req, res) => {
        try {
            const user = await dao.findUserByUsername(req.body.username);
            if (user) {
                res.status(400).json({ message: "Username already in use" });
                return;
            }
            const currentUser = await dao.createUser(req.body);
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    };

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const currentUser = await dao.findUserByCredentials(username, password);
            console.log("🔎 Found user:", currentUser);
            const users = await model.find();
            console.log("🧾 All users:", users);
          
            if (currentUser) {
                req.session["currentUser"] = currentUser;
                console.log("Session after signin:", req.session); // 添加日志
                // res.json(currentUser);
                res.json(currentUser.toObject());
            } else {
                res.status(401).json({ error: "Incorrect username or password" });
            }
        } catch (error) {
            console.error("🔥 Error in signin route:", error);
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    };


    const profile = (req, res) => { 
        const currentUser = req.session["currentUser"];
        if (!currentUser){
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
        
     };
   
    const signout = (req, res) => { 
        req.session.destroy();
        res.sendStatus(200); 
    };


    const findCoursesForEnrolledUser = async (req, res) => {
        try {
            let userId = req.params.userId || "current";
            console.log("🧠 Session inside /current/courses:", req.session);
            console.log("Session user before check:", req.session["currentUser"]);
            console.log("Request headers:", req.headers); // 添加日志
            console.log("Request cookies:", req.cookies); // 添加日志

            if (userId === "current") {
                const currentUser = req.session["currentUser"];
                if (!currentUser) {
                    console.log("❌ No current user in session");
                    res.sendStatus(401);
                    return;
                }
                console.log("✅ Found current user:", currentUser);
                userId = currentUser._id;
            }

            const courses = await courseDao.findCoursesForEnrolledUser(userId);
            res.json(courses);
        } catch (error) {
            console.error("🔥 Error in findCoursesForEnrolledUser:", error);
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    };

    const createCourse = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            const newCourse = await courseDao.createCourse(req.body);
            await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
            res.json(newCourse);
        } catch (error) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    };
    const findUserById = async(req,res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    }
 

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    app.get("/api/users/current/courses", findCoursesForEnrolledUser);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/current/courses", createCourse);

    // app.get("/api/users", (_, res) => res.send(dao.findAllUsers()));
    // app.get("/api/users/:userId", (req, res) => res.send(dao.findUserById(req.params.userId)));
    // app.delete("/api/users/:userId", (req, res) => res.send(dao.deleteUser(req.params.userId)));

}