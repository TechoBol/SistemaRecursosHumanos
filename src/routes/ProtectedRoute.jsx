import { Navigate, Outlet } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useLoginStore();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};