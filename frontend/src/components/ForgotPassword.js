import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1); // Track steps (1 = Email, 2 = Code, 3 = Reset)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  // ✅ Send Reset Code
  const requestResetCode = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/forgot-password/", { email });
      alert(`Reset code sent to ${email}`);
      setStep(2);
      setCanResend(false);
      setTimer(30); // Start 30s timer
    } catch (error) {
      setError(error.response?.data?.detail || "Error sending reset code");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Timer for Resend Code
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) setCanResend(true);
  }, [timer, step]);

  // ✅ Verify Reset Code & Allow Password Reset
  const verifyResetCode = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/verify-code/", {
        email,
        reset_code: resetCode,
      });

      if (response.status === 200) {
        alert("Code verified! Enter new password.");
        setStep(3); // ✅ Move to new password entry
      }
    } catch (error) {
      setError(
        error.response?.data?.detail || "Invalid code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Password
  const resetPassword = async () => {
    setError("");
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/reset-password/",
        {
          email,
          reset_code: resetCode,
          new_password: newPassword,
          confirm_password: confirmNewPassword,
        }
      );

      if (response.status === 200) {
        alert("Password reset successful! Please log in.");
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Error resetting password.");
    }
  };

  return (
    <div className="auth-container">
      <h2>🔑 Forgot Password</h2>
      {error && <p className="error-text">{error}</p>}

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={requestResetCode} disabled={loading}>
            {loading ? "Sending..." : "Send Code"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter Reset Code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
          />
          <button onClick={verifyResetCode} disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          <p>
            {canResend ? (
              <button onClick={requestResetCode}>Resend Code</button>
            ) : (
              `Resend code in ${timer}s`
            )}
          </p>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <button onClick={resetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
