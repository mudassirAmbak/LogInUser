import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import Img from "../images/c.png";
import { logout } from "../auth";
import Swal from "sweetalert2";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const urlToken = queryParams.get("token");

        if (urlToken) {
          localStorage.setItem("token", urlToken);
          navigate("/dashboard", { replace: true });
          return;
        }

        const token = localStorage.getItem("token");

        if (token) {
          const res = await API.get("/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data);
          return;
        }

        const googleRes = await fetch(
          "http://localhost:5000/auth/login/success",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (googleRes.ok) {
          const googleData = await googleRes.json();
          localStorage.setItem("token", googleData.token);
          localStorage.setItem("user", JSON.stringify(googleData.user));
          setUser(googleData.user);
          navigate("/dashboard", { replace: true });
        } else {
          console.log("No active Google session");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [location.search, navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        fetch("http://localhost:5000/auth/logout", {
          method: "GET",
          credentials: "include",
        });
        navigate("/login");
      }
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("profilePic", selectedFile);

      const uploadRes = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();

      await fetch("http://localhost:5000/api/users/me/profile-pic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ imageUrl: uploadData.imageUrl }),
      });

      setUser({ ...user, picture: uploadData.imageUrl });
      setSelectedFile(null);
      setPreviewUrl("");
      fileInputRef.current.value = "";

      Swal.fire({
        icon: "success",
        title: "Upload Successful!",
        text: "Your profile picture has been updated.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Upload error:", err);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong while uploading your picture.",
      });
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-98 transition transform hover:scale-[1.01]">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        </div>

        <div className="flex items-center justify-center  gap-4 mb-6">
          {/* 👇 Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="hidden"
          />

          
          <div
            onClick={handleImageClick}
            className="relative group cursor-pointer mb-4"
          >
            <img
              src={previewUrl || user.picture || Img}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-300 shadow-md object-cover transition hover:opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-black bg-opacity-30">
              <span className="text-white text-xs font-semibold">Change</span>
            </div>
          </div>

          <div>
            <div className="font-medium">
              <span className="text-black">Name:</span> {user.name}
            </div>
            <div className="font-medium">
              <span className="text-black">Email:</span> {user.email}
            </div>
            {user.role && (
              <div className="font-medium">
                <span className="text-black">Role:</span> {user.role}
              </div>
            )}
          </div>
        </div>

        {previewUrl && (
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl mb-3 font-semibold transition"
          >
            Upload Picture
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
