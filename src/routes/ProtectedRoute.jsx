import { Navigate } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";

export const ProtectedRoute = ({ children, allowedLevels }) => {
  const { isLoggedIn, level } = useLoginStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedLevels && !allowedLevels.includes(Number(level))) {
    return <Navigate to="/products" />;/
  }

  return children;
};