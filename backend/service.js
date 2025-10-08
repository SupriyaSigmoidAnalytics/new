const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json()); // to parse JSON

let tasks = []; // in-memory storage

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const task = { id: Date.now(), title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Toggle task done/undone
app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.done = !task.done;
  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(5000, () => console.log("Backend running on port 5000"));
