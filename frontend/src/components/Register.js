import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ setToken }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validate email format
    if (!credentials.email.includes("@")) {
      setError("Invalid email format");
      return;
    }

    // ✅ Check if passwords match
    if (credentials.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/register/",
        credentials
      );

      if (response && response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        setToken(response.data.access_token);
        navigate("/");
      } else {
        setError("Unexpected server response.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || "Registration failed");
      } else {
        setError("Unable to connect to server.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>📝 Register</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
