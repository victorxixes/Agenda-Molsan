import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function RequireAuth({ children }) {
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const authReady = useAuthStore((s) => s.authReady);

  // Pantalla de carga premium SJ‑2026
  if (!authReady || loading) {
    return (
      <div
        className="
          w-full h-screen flex items-center justify-center
          bg-black/40 backdrop-blur-xl
        "
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner premium */}
          <div
            className="
              w-12 h-12 border-4 border-white/20 border-t-white
              rounded-full animate-spin
            "
          ></div>

          <p className="text-white/80 text-sm tracking-wide">
            Cargando sesión…
          </p>
        </div>
      </div>
    );
  }

  // Si no hay token → redirigir
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si todo está OK → mostrar contenido protegido
  return children;
}
