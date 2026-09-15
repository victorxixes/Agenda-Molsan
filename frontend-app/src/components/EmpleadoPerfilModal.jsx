import { useEffect } from "react";
import EmpleadoFicha from "../pages/empleados/EmpleadoFicha";

export default function EmpleadoPerfilModal({ id, onClose }) {

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="modal-content bg-white rounded-xl shadow-xl p-6 w-[900px] max-h-[90vh] overflow-auto relative"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={onClose}
        >
          ✕
        </button>

        {/* ⭐ CARGA LA FICHA DEL EMPLEADO CONECTADO */}
        <EmpleadoFicha id={id} />
      </div>
    </div>
  );
}
