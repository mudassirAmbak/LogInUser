import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import bgImage from "../images/a.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@(gmail|ambak)\.(com|in|org)$/;
    return re.test(email);
  };

  const validateName = (name) => {
    const re = /^[A-Za-z\s]+$/;
    return re.test(name);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z\d]{4,}$/;
    return re.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name) {
      newErrors.name = "Name is required.";
    } else if (!validateName(form.name)) {
      newErrors.name = "Name should only contain letters.";
    }

    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(form.password)) {
      newErrors.password =
        "Password must be at least 4 characters and include letters and numbers.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await API.post("/auth/register", form);
      setErrors({});
      setSuccess("Registered successfully! ✅ ");

      // After successful registration, redirect to dashboard
      setTimeout(() => navigate("/dashboard"), 2000); // Delay for 2 seconds to show the success message
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-[800px] max-w-full">
        <div
          className="w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        ></div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleRegister}
          className="w-1/2 p-8 border space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Create Account 📝</h2>
          {success && (
            <div className="text-green-600 text-sm text-center font-semibold">
              {success}
            </div>
          )}

          {errors.general && (
            <div className="text-red-600 text-sm text-center font-semibold">
              {errors.general}
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
              <FaUser className="text-gray-400 mr-2" />
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="bg-transparent w-full outline-none"
              />
            </div>
            {errors.name && (
              <div className="text-red-600 text-sm mt-1 ml-1">
                {errors.name}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="bg-transparent w-full outline-none"
              />
            </div>
            {errors.email && (
              <div className="text-red-600 text-sm mt-1 ml-1">
                {errors.email}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 relative">
              <FaLock className="text-gray-400 mr-2" />
              <input
                name="password"
                value={form.password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                className="bg-transparent w-full outline-none pr-8"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {errors.password && (
              <div className="text-red-600 text-sm mt-1 ml-1">
                {errors.password}
              </div>
            )}
          </div>

          <button className="w-full bg-purple-800 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold transition">
            Sign Up
          </button>

          <a
            href="http://localhost:5000/auth/google"
            className="w-full flex items-center justify-center border border-gray-300 bg-white text-gray-700 py-3 rounded-lg font-semibold hover:shadow-md transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Continue with Google
          </a>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-bold hover:underline"
            >
              Log in
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
