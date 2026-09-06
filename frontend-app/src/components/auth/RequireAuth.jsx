import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function RequireAuth({ children }) {
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);

  // 1) Mientras carga → no redirigir
  if (loading) {
    return null; // o spinner si quieres
  }

  // 2) Cuando ya sabemos si hay token → decidir
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
