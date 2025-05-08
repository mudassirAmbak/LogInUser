
// import { Navigate } from "react-router-dom";
// import { getUser } from "../auth";

// export default function PrivateRoute({ children }) {
//   console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
//   const user = getUser();
//   console.log("User in PrivateRoute:", user);
//   console.log("Raw user from localStorage:", localStorage.getItem("user"));

//   return user ? children : <Navigate to="/login" />;
// }




// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // assuming you're storing JWT in localStorage

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;





