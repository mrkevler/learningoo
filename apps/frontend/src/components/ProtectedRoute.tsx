import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store";

const ProtectedRoute = () => {
  const token = useAppSelector((s) => s.auth.token);
  const location = useLocation();
  if (!token)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
