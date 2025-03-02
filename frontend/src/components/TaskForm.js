import React, { useState } from "react";
import axios from "axios";
import "../styles/TaskForm.css";

const TaskForm = ({ fetchTasks }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add tasks.");
      return;
    }

    const taskData = {
      title: task.title,
      description: task.description,
      due_date: new Date(task.due_date).toISOString(), // ✅ Ensure correct format
      priority: "Medium",
      completed: false,
    };

    try {
      await axios.post("http://localhost:8000/tasks/", taskData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setTask({ title: "", description: "", due_date: "" }); // ✅ Reset Form
      fetchTasks(); // ✅ Refresh Task List
    } catch (error) {
      console.error("Error adding task:", error);
      setError(error.response?.data?.detail || "Failed to add task.");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {error && <p className="error-text">{error}</p>}
      <input
        type="text"
        placeholder="Task Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <input
        type="datetime-local"
        value={task.due_date}
        onChange={(e) => setTask({ ...task, due_date: e.target.value })}
        required
      />
      <button type="submit">➕ Add Task</button>
    </form>
  );
};

export default TaskForm;
