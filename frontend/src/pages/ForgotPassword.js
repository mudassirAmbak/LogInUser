import { useState } from "react";
import API from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      const res = await API.post("/auth/password/forgot-password", { email });

      setMessage(res.data.message);
    } catch (err) {
      setError("Email not found.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleForgot}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4 outline-none"
        />
        <button className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
