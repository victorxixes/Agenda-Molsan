import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function RequireAuth({ children }) {
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const authReady = useAuthStore((s) => s.authReady);

  if (!authReady || loading) {
    return null; // o spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
