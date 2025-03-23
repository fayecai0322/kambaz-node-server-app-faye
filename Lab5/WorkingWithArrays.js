import express from "express";

let todos = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
];

export default function WorkingWithArrays(app) {
    console.log("📢 Registering todos API routes...");
    app.use(express.json()); 
    // ✅ 处理 GET 请求
    app.get("/lab5/todos", (req, res) => {
        console.log("📢 GET /lab5/todos - Sending todos:", todos);
        res.json(todos);
    });

    // ✅ 处理 POST 请求
    app.post("/lab5/todos", (req, res) => {
        console.log("📢 POST /lab5/todos - Raw body:", req.body);

        if (!req.body || !req.body.title) {
            console.error("❌ Error: Invalid request body:", req.body);
            return res.status(400).json({ error: "Title is required" });
        }

        const newTodo = { id: new Date().getTime(), ...req.body };
        todos.push(newTodo);

        console.log("✅ New todo added:", newTodo);
        res.json(newTodo);
    });

    // ✅ 删除任务
    app.delete("/lab5/todos/:id", (req, res) => {
        console.log("📢 DELETE /lab5/todos/:id - Received ID:", req.params.id);

        const todoId = parseInt(req.params.id, 10);
        const todoIndex = todos.findIndex((t) => t.id === todoId);

        if (todoIndex === -1) {
            return res.status(404).json({ message: `Unable to delete Todo with ID ${todoId}` });
        }

        todos.splice(todoIndex, 1);
        console.log("✅ Todo deleted:", todoId);
        res.sendStatus(200);
    });

    
    app.put("/lab5/todos/:id", (req, res) => {
        const todoId = parseInt(req.params.id, 10);
        const updatedTodo = req.body;

        console.log("🔍 Updating todo ID:", todoId);
        console.log("🔍 Existing todos:", todos);

        if (!todoId || isNaN(todoId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        if (!updatedTodo || typeof updatedTodo.title !== "string") {
            return res.status(400).json({ error: "Invalid request body" });
        }

        let found = false;
        todos = todos.map((t) => {
            if (t.id === todoId) {
                found = true;
                return { ...t, ...updatedTodo };
            }
            return t;
        });

        if (!found) {
            return res.status(404).json({ message: `Unable to update Todo with ID ${todoId}` });
        }

        console.log("✅ Todo updated:", updatedTodo);
        res.json(updatedTodo);
    });
    console.log("✅ Todos API routes registered!");
}
