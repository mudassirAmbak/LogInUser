import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api";
import { setUser } from "../auth";
import { motion } from "framer-motion";
import { FaLock, FaEnvelope } from "react-icons/fa";
import bgImage from "../images/b.png";
import userImage from "../images/profile.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password });

      console.log("Login response:", res.data);

      if (res.data && res.data.token && res.data.user) {
        setUser({
          token: res.data.token,
          user: res.data.user,
        });
        res.data.user.role === "admin"
          ? navigate("/admin")
          : navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    }
  };


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log("Query params:", queryParams.toString());
    const urlToken = queryParams.get("token");

    if (urlToken) {
      // Save token to localStorage and navigate
      localStorage.setItem("token", urlToken);
      navigate("/dashboard", { replace: true });
      return;
    }
  },[]);
  // Google OAuth token handler

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const token = urlParams.get("token");
    console.log("URL token:", token);
    if (token) {
      API.get(`/auth/verify-token?token=${token}`)

        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user)); 
          setUser({
            token: response.data.token,
            user: response.data.user,
          });

          navigate("/dashboard", { replace: true }); // ✅ removes token from URL
        })
        .catch((error) => {
          console.error("Token verification error:", error);
          setError("Invalid token. Please log in again.");
        });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-[800px] max-w-full">
        <div
          className="w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleLogin}
          className="w-1/2 p-8 border space-y-6"
        >
          <div className="flex justify-center">
            <div
              className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-white text-4xl"
              style={{
                backgroundImage: `url(${userImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>

          <h2 className="text-2xl font-bold text-center">Welcome Back 👋</h2>

          {error && (
            <div className="text-red-600 text-sm text-center font-semibold mb-2">
              {error}
            </div>
          )}

          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full outline-none"
            />
          </div>

          <div className="flex justify-end text-sm text-gray-600">
            <Link
              to="/forgot-password"
              className="hover:underline text-sm text-blue-600"
            >
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-[#7474ED] hover:bg-[#5c5cce] text-white py-3 rounded-lg font-semibold transition">
            Log in
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
            Login with Google
          </a>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#7474ED] font-bold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
