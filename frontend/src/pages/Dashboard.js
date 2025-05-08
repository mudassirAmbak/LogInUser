// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import API from "../api";
// import Img from "../images/c.png";
// import { logout } from "../auth";
// import Swal from "sweetalert2";

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         // Step 0: Get token from URL if redirected from Google OAuth
//         const queryParams = new URLSearchParams(location.search);
//         const urlToken = queryParams.get("token");

//         console.log("URL token before condition:", urlToken);

//         if (urlToken) {
//           localStorage.setItem("token", urlToken);
//           navigate("/dashboard", { replace: true }); // Remove token from URL
//           return;
//         }

//         // Step 1: Check localStorage for token
//         const token = localStorage.getItem("token");

//         if (token) {
//           const res = await API.get("/users/me");
//           setUser(res.data);
//           return;
//         }

//         // Step 2: Try to fetch Google login session from backend
//         const googleRes = await fetch(
//           "http://localhost:5000/auth/login/success",
//           {
//             method: "GET",
//             credentials: "include",
//           }
//         );

//         if (googleRes.ok) {
//           const googleData = await googleRes.json();
//           localStorage.setItem("token", googleData.token);
//           setUser(googleData.user);
//         } else {
//           console.log("No active Google session");
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };

//     fetchUser();
//   }, [location.search, navigate]);

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out of your account.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, logout!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         logout();
//         fetch("http://localhost:5000/auth/logout", {
//           method: "GET",
//           credentials: "include",
//         });
//         navigate("/login");
//       }
//     });
//   };

//   if (!user) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white rounded-xl shadow-lg p-6 w-110">
//         <div className="flex items-center justify-center mb-6">
//           <h2 className="text-2xl font-bold">My Profile</h2>
//         </div>

//         <div className="flex items-center justify-center gap-4 mb-6">
//           <img
//             src={user.picture || Img}
//             alt="Profile"
//             className="w-24 h-24 rounded-full border"
//           />
//           <div>
//             <p>
//               <strong>Name:</strong> {user.name}
//             </p>
//             <p>
//               <strong>Email:</strong> {user.email}
//             </p>
//             {user.role && (
//               <p>
//                 <strong>Role:</strong> {user.role}
//               </p>
//             )}
//           </div>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import Img from "../images/c.png";
import { logout } from "../auth";
import Swal from "sweetalert2";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        console.log("Query params:", queryParams.toString());
        const urlToken = queryParams.get("token");

        if (urlToken) {
          // Save token to localStorage and navigate
          localStorage.setItem("token", urlToken);
          navigate("/dashboard", { replace: true });
          return;
        }

        const token = localStorage.getItem("token");

        if (token) {
          // Fetch user info with the token
          const res = await API.get("/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data); // Update user state
          return;
        }

        // If no token, check Google login session
        const googleRes = await fetch(
          "http://localhost:5000/auth/login/success",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (googleRes.ok) {
          const googleData = await googleRes.json();
          console.log("Google Data:", googleData);

          // Save token and user data in localStorage
          localStorage.setItem("token", googleData.token);
          localStorage.setItem("user", JSON.stringify(googleData.user));
          setUser(googleData.user); // Update user state
          navigate("/dashboard", { replace: true }); // Navigate to dashboard
        } else {
          console.log("No active Google session");
          // Optionally show a message or redirect to login if needed
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

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-6 w-110">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold">My Profile</h2>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <img
            src={user.picture || Img}
            alt="Profile"
            className="w-24 h-24 rounded-full border object-cover"
          />
          <div>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.role && (
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
