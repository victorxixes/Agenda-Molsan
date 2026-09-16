import { useEffect } from "react";
import EmpleadoPerfil from "../pages/empleados/EmpleadoPerfil";

export default function EmpleadoPerfilModal({ id, onClose }) {

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

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
        <EmpleadoPerfil id={id} />
      </div>
    </div>
  );
}
