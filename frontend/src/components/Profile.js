import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link

const Profile = ({ setToken }) => {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const clearToken = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }, [setToken, navigate]);

  // ✅ Change Username
  const changeUsername = async () => {
    if (!newUsername) {
      setError("Enter a new username");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/change-username/",
        {
          email: user.email,
          new_username: newUsername, // ✅ Ensure correct field names
        }
      );

      if (response.data.message) {
        alert(response.data.message);
        setNewUsername("");
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.detail || "Error changing username");
    }
  };

  // ✅ Change Password
  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/change-password/",
        {
          email: user.email,
          old_password: oldPassword,
          new_password: newPassword,
        }
      );

      if (response.data.message) {
        alert(response.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.detail || "Error changing password");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        clearToken();
      }
    };

    fetchUser();
  }, [clearToken]);

  return (
    <div className="auth-container">
      <h2>👤 My Profile</h2>
      {error && (
        <p style={{ color: "red" }}>
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}
      {user ? (
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {/* Change Username */}
          <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button onClick={changeUsername}>Change Username</button>

          {/* Change Password */}
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button onClick={changePassword}>Change Password</button>

          {/* ✅ Added Home Link */}
          <br />
          <br />
          <Link to="/" className="home-btn">
            🏠 Back to Home
          </Link>

          {/* Spacing before Logout */}
          <br />
          <br />
          <button onClick={clearToken} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
