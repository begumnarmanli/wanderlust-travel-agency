import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  let decoded = null;
  let isAuthorized = true;

  try {
    decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (location.pathname === "/admin" && userRole !== "admin") {
      console.warn(
        "Unauthorized access: Only administrators can access the admin panel!"
      );
      isAuthorized = false;
    }
  } catch (err) {
    console.error("Token decode error:", err);
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
