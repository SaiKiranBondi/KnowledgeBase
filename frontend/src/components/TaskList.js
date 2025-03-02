import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TaskList.css";
import { useNavigate } from "react-router-dom";

const TaskList = ({ tasks = [], fetchTasks, showAll = false }) => {
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (tasks.length > 0) {
      setLoading(false);
    }
  }, [tasks]);

  const markCompleted = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      await axios.post(
        `http://localhost:8000/tasks/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchTasks(); // ✅ Refresh task list
    } catch (error) {
      console.error("Error marking task as completed:", error.response?.data);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleReason = (id) => {
    setExpandedTask(expandedTask === id ? null : id);
  };

  if (loading) {
    return <p className="loading-text">Loading tasks...</p>;
  }

  // Show only latest 2 tasks on the homepage
  const displayTasks = showAll ? tasks : tasks.slice(0, 2);

  return (
    <div className="task-list">
      {displayTasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Add one! ✨</p>
      ) : (
        displayTasks.map((task) => (
          <div
            className={`task-item priority-${task.priority?.toLowerCase()}`}
            key={task.id}
          >
            {/* ✅ Title + Priority + Buttons in One Line */}
            <div className="task-header">
              <div className="task-title">
                <h3>
                  {task.title}{" "}
                  <span
                    className={`priority-tag ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                </h3>
              </div>
              <div className="task-buttons">
                {!task.completed ? (
                  <button
                    className="complete-btn"
                    onClick={() => markCompleted(task.id)}
                  >
                    ✅ Complete
                  </button>
                ) : (
                  <span className="completed-text">✔ Completed</span>
                )}
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  ❌ Delete
                </button>
              </div>
            </div>

            <p>{task.description}</p>
            <small className="deadline-text">
              📅 {new Date(task.due_date).toLocaleString()}
            </small>

            <button
              className="toggle-reason-btn"
              onClick={() => toggleReason(task.id)}
            >
              {expandedTask === task.id ? "Hide Reason" : "See Reason"}
            </button>

            {expandedTask === task.id && (
              <p className="task-reason">📝 {task.reason}</p>
            )}
          </div>
        ))
      )}
      {!showAll && tasks.length > 2 && (
        <button className="view-all-btn" onClick={() => navigate("/tasks")}>
          🔍 View All Tasks
        </button>
      )}
    </div>
  );
};

export default TaskList;
