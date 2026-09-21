import { useEffect, useCallback } from "react";
import EmpleadoPerfil from "../pages/empleados/EmpleadoPerfil";

export default function EmpleadoPerfilModal({ id, onClose }) {
  // Blindar ID
  const idNum = Number(id);
  const idValido = Number.isFinite(idNum) && idNum > 0;

  // Si el ID no es válido, NO montar el modal
  if (!idValido) return null;

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Cerrar al hacer click fuera
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <div
      className="
        fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50
        animate-fade-in
      "
      onClick={handleOverlayClick}
    >
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-2xl p-6 w-[900px] max-h-[90vh] overflow-auto relative
        "
      >
        {/* BOTÓN CERRAR */}
        <button
          className="
            absolute top-4 right-4 text-white/70 hover:text-white
            transition text-xl
          "
          onClick={onClose}
        >
          ✕
        </button>

        {/* PERFIL PREMIUM */}
        <EmpleadoPerfil id={idNum} />
      </div>
    </div>
  );
}
