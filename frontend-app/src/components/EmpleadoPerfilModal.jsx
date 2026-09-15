import { useEffect } from "react";
import EmpleadoFicha from "../pages/empleados/EmpleadoFicha";
import { useAuthStore } from "../store/authStore";

export default function EmpleadoPerfilModal({ id, onClose }) {

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Cerrar al hacer clic fuera
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-overlay fade-in fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="modal-content bg-white rounded-xl shadow-xl p-6 w-[900px] max-h-[90vh] overflow-auto relative animate-fade-in"
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Ficha del empleado */}
        <EmpleadoFicha id={id} />
      </div>
    </div>
  );
}
