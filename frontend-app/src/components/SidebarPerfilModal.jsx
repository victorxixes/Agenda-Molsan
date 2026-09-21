import { useEffect, useCallback } from "react";
import ModalEmpleado from "./empleados/ModalEmpleado";

export default function EmpleadoPerfilModal({ id, onClose }) {
  const idNum = Number(id);
  const idValido = Number.isFinite(idNum) && idNum > 0;

  if (!idValido) return null;

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
        <button
          className="
            absolute top-4 right-4 text-white/70 hover:text-white
            transition text-xl
          "
          onClick={onClose}
        >
          ✕
        </button>

        {/* Ficha completa del empleado */}
        <ModalEmpleado
          open={true}
          empleadoId={idNum}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
