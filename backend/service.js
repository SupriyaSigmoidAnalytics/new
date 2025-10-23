const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON

// ------------------ Prometheus Metrics ------------------
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// HTTP request metrics
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 1, 2, 5],
});

// Task metrics
const tasksCount = new client.Gauge({
  name: "tasks_count",
  help: "Current number of tasks in memory",
});

const taskOperationsTotal = new client.Counter({
  name: "task_operations_total",
  help: "Total task operations (create/delete/toggle)",
  labelNames: ["op"],
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds);
register.registerMetric(tasksCount);
register.registerMetric(taskOperationsTotal);

// ------------------ Middleware for metrics ------------------
app.use((req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  const route = req.route && req.route.path ? req.route.path : req.path;

  res.on("finish", () => {
    const status = res.statusCode;
    httpRequestsTotal.inc({ method: req.method, route, status: String(status) });
    end({ method: req.method, route, status: String(status) });
  });

  next();
});

// ------------------ In-memory tasks ------------------
let tasks = [];
tasksCount.set(tasks.length);

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add a task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  
  const task = { id: Date.now(), title, done: false };
  tasks.push(task);
  tasksCount.set(tasks.length);
  taskOperationsTotal.inc({ op: "create" });

  res.status(201).json(task);
});

// Toggle task done/undone
app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.done = !task.done;
  taskOperationsTotal.inc({ op: "toggle" });
  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  if (tasks.length < before) {
    tasksCount.set(tasks.length);
    taskOperationsTotal.inc({ op: "delete" });
  }
  res.status(204).send();
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// ------------------ Start server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
