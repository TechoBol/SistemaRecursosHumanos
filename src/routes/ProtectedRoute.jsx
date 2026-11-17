import { Navigate, Outlet } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { usePermissions } from "../hooks/usePermissions";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useLoginStore();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export const SuperAdminRoute = ({ children }) => {
  const { isLoggedIn } = useLoginStore();
  const { canAccessUsers } = usePermissions();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!canAccessUsers) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};