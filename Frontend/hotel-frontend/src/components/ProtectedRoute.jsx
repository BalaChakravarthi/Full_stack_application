import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // Not logged in
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Admin route protection
  if (adminOnly && role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;