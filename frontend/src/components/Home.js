import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import "../styles/Home.css";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  // ✅ Fetch tasks function
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await fetch("http://localhost:8000/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data); // ✅ Show all tasks
      } else {
        console.error("Failed to fetch tasks.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="home-container">
      <h1 className="welcome-text">👋 Welcome to Your Task Manager!</h1>

      {/* ✅ Navigation stays visible at the top */}
      <div className="nav-links">
        <Link to="/tasks" className="nav-btn">
          📋 View All Tasks
        </Link>
        <Link to="/profile" className="nav-btn">
          👤 Profile
        </Link>
      </div>

      <TaskForm fetchTasks={fetchTasks} />

      {/* ✅ Scrollable Task List */}
      <div className="task-list-container">
        <TaskList tasks={tasks} fetchTasks={fetchTasks} />
      </div>
    </div>
  );
};

export default Home;
