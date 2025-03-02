import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TaskPage.css";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);

  // Filters
  const [priorityFilter, setPriorityFilter] = useState("");
  const [completionFilter, setCompletionFilter] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");

  // ✅ Fetch tasks function (can be used in useEffect and buttons)
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.get("http://localhost:8000/tasks/", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed token sending
      });

      setTasks(response.data);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Fetch tasks whenever filters change
  useEffect(() => {
    fetchTasks();
  }, [priorityFilter, completionFilter, deadlineFilter]);

  return (
    <div className="task-page">
      <h2>📌 All Tasks</h2>

      {/* ✅ Filters */}
      <div className="filter-controls">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={completionFilter}
          onChange={(e) => setCompletionFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="datetime-local"
          value={deadlineFilter}
          onChange={(e) => setDeadlineFilter(e.target.value)}
        />
      </div>

      {/* ✅ Display Tasks */}
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <div
            className={`task-item priority-${task.priority.toLowerCase()}`}
            key={task.id}
          >
            <div className="task-header">
              <h3>
                {task.title}{" "}
                <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </h3>
              <div className="task-buttons">
                {!task.completed ? (
                  <button
                    className="complete-btn"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        console.error("No authentication token found.");
                        return;
                      }

                      await axios.put(
                        `http://localhost:8000/tasks/${task.id}/complete`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      fetchTasks(); // ✅ Now fetchTasks is defined and can be used
                    }}
                  >
                    ✅ Complete
                  </button>
                ) : (
                  <span className="completed-text">✔ Completed</span>
                )}
                <button
                  className="delete-btn"
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      console.error("No authentication token found.");
                      return;
                    }

                    await axios.delete(
                      `http://localhost:8000/tasks/${task.id}`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    fetchTasks(); // ✅ Now fetchTasks is defined and can be used
                  }}
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
              onClick={() =>
                setExpandedTask(expandedTask === task.id ? null : task.id)
              }
            >
              {expandedTask === task.id ? "Hide Reason" : "See Reason"}
            </button>

            {expandedTask === task.id && (
              <p className="task-reason">📝 {task.reason}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TaskPage;
