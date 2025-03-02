import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword"; // ✅ Import Forgot Password
import "./styles/App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route
              path="/register"
              element={<Register setToken={setToken} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
            {/* ✅ Add Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile setToken={setToken} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

// ✅ Home Page
const Home = () => (
  <div className="home-container">
    <h1>👋 Hello!</h1>
    <Link to="/profile" className="profile-btn">
      Go to Profile
    </Link>
  </div>
);

export default App;
