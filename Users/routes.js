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
        const userId = req.params.userId;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = await dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
     const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        console.log("🔎 Found user:", currentUser);
    
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
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


    const findCoursesForEnrolledUser = (req, res) => {
        const currentUser = req.session["currentUser"];
        console.log("🧠 Session inside /current/courses:", req.session);
      
        if (!currentUser) {
          console.log("❌ No current user in session");
          return res.sendStatus(401);
        }
      
        const userId = currentUser._id;
        console.log("✅ Found current user:", currentUser);
      
        try {
          const courses = courseDao.findCoursesForEnrolledUser(userId);
          console.log("📦 Final enrolled courses:", courses);
          return res.json(courses);
        } catch (err) {
          console.error("🔥 Error in findCoursesForEnrolledUser:", err);
          return res.sendStatus(500);
        }
      };

    const createCourse = (req,res)=> {
        const currentUser = req.session["currentUser"]; //Extracts the currentUser from the session
        const newCourse = courseDao.createCourse(req.body);//Calls createCourse() to store the course in the database
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);//Calls enrollUserInCourse() to link the user with the course
        res.json(newCourse);//Sends back the created course as a response
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

    app.get("/api/users", (_, res) => res.send(dao.findAllUsers()));
    app.get("/api/users/:userId", (req, res) => res.send(dao.findUserById(req.params.userId)));
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", (req, res) => res.send(dao.deleteUser(req.params.userId)));

}