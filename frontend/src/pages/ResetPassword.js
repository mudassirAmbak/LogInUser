import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await API.post(`/auth/password/reset-password/${token}`, {
        password,
      });

      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Invalid or expired token.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <input
          type="password"
          placeholder="New Password"
          className="w-full px-3 py-2 border rounded mb-4 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-3 py-2 border rounded mb-4 outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition">
          Reset Password
        </button>
      </form>
    </div>
  );
}
