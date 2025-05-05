
import { Navigate } from "react-router-dom";
import { getUser } from "../auth";

export default function PrivateRoute({ children }) {
  const user = getUser();
  console.log("User in PrivateRoute:", user);
  return user ? children : <Navigate to="/login" />;
}
