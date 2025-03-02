import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setToken }) => {
  const [credentials, setCredentials] = useState({
    username_or_email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/login/",
        credentials
      );

      if (response && response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        setToken(response.data.access_token);
        navigate("/");
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || "Login failed");
      } else {
        setError("Unable to connect to server. Please check your network.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>🔑 Login</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) =>
            setCredentials({
              ...credentials,
              username_or_email: e.target.value,
            })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        New here? <Link to="/register">Register</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
};

export default Login;
