import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        console.log("Access token:", accessToken);

        // Send access token to your backend
        const res = await axios.post("http://localhost:5000/api/auth/google-login", {
          token: accessToken,
        });
        console.log("Response from backend:", res.data);

        const backendToken = res.data.token;
        console.log("Backend token:", backendToken);
        const user = jwtDecode(backendToken); // decode to get role/email/etc.

        // Store token & user
        localStorage.setItem("token", backendToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Navigate to dashboard or admin
        navigate(user.role === "admin" ? "/admin" : "/dashboard");
      } catch (error) {
        console.error("Google login error:", error);
        alert("Google login failed. Please try again.");
      }
    },
    onError: () => alert("Google login failed."),
  });

  return (
    <button
      onClick={() => handleGoogleLogin()}
      className="w-full mt-3 flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition font-medium"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
