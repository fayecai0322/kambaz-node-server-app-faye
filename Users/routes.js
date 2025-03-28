import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

//let currentUser = null;
export default function UserRoutes(app){
    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };
    const findAllUsers = (req, res) => { };
    const findUserById = (req, res) => { };
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
     };
    const signup = (req, res) => { 
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);  // ✅ 加上 await
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
        let userId = req.params.userId || "current";
        console.log("🧠 Session inside /current/courses:", req.session);
      
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
      
        try {
          const courses = courseDao.findCoursesForEnrolledUser(userId);
          res.json(courses);
        } catch (err) {
          console.error("🔥 Error in findCoursesForEnrolledUser:", err);
          res.sendStatus(500);
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

    // app.get("/api/users", (_, res) => res.send(dao.findAllUsers()));
    app.get("/api/users/:userId", (req, res) => res.send(dao.findUserById(req.params.userId)));
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", (req, res) => res.send(dao.deleteUser(req.params.userId)));

}