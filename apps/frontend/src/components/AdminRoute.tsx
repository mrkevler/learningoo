import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store";

const AdminRoute = () => {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();

  const payloadRole = (() => {
    if (!token) return null;
    try {
      const base64 = token.split(".")[1];
      const json = atob(base64);
      return JSON.parse(json).role as string;
    } catch {
      return null;
    }
  })();

  const isAdmin = user?.role === "admin" || payloadRole === "admin";

  if (!token)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default AdminRoute;
