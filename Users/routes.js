import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

//let currentUser = null;
export default function UserRoutes(app){
    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };
    const findAllUsers = (req, res) => { };
    const findUserById = (req, res) => { };
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
          
            if (currentUser) {
                req.session["currentUser"] = currentUser;
                console.log("Session after signin:", req.session); // 添加日志
                res.json(currentUser);
            } else {
                res.status(401).json({ error: "Incorrect username or password" });
            }
        } catch (error) {
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
    app.get("/api/users/:userId", (req, res) => res.send(dao.findUserById(req.params.userId)));
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", (req, res) => res.send(dao.deleteUser(req.params.userId)));

}