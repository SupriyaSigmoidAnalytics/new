import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!newTask) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });
    const task = await res.json();
    setTasks([...tasks, task]);
    setNewTask("");
  };

  // Toggle done
  const toggleTask = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "PATCH" });
    const updated = await res.json();
    setTasks(tasks.map(t => (t.id === id ? updated : t)));
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Styles
  const styles = {
    container: {
      textAlign: "center",
      marginTop: "50px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f0f4f8",
      minHeight: "100vh",
      padding: "20px",
    },
    header: {
      color: "#333",
      fontSize: "2.5rem",
      marginBottom: "20px",
    },
    input: {
      padding: "10px",
      width: "250px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginRight: "10px",
      fontSize: "1rem",
    },
    addButton: {
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#4caf50",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    addButtonHover: {
      backgroundColor: "#45a049",
    },
    taskList: {
      listStyle: "none",
      padding: 0,
      marginTop: "30px",
      maxWidth: "400px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    taskItem: {
      backgroundColor: "#fff",
      padding: "15px 20px",
      borderRadius: "8px",
      marginBottom: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
    },
    taskText: {
      cursor: "pointer",
      fontSize: "1.1rem",
    },
    deleteButton: {
      padding: "5px 10px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#f44336",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📝 Task Manager</h1>

      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task"
          style={styles.input}
        />
        <button
          style={styles.addButton}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4caf50")}
          onClick={addTask}
        >
          Add
        </button>
      </div>

      <ul style={styles.taskList}>
        {tasks.map(task => (
          <li
            key={task.id}
            style={styles.taskItem}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span
              style={{
                ...styles.taskText,
                textDecoration: task.done ? "line-through" : "none",
              }}
              onClick={() => toggleTask(task.id)}
            >
              {task.title}
            </span>
            <button
              style={styles.deleteButton}
              onClick={() => deleteTask(task.id)}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f44336")}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
