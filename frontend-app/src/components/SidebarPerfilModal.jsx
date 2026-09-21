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
      "
      onClick={handleOverlayClick}
    >
      {/* Aquí NO metemos ningún contenedor extra */}
      <ModalEmpleado
        open={true}
        empleadoId={idNum}
        onClose={onClose}
      />
    </div>
  );
}
