import { useEffect } from "react";

export default function ModalCtnDetalle({ open, onClose, notaria }) {
  if (!open) return null;

  // Cerrar con ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          Detalle Notaría #{notaria?.id}
        </h2>

        <div className="space-y-2">
          <p><strong>Nombre:</strong> {notaria?.nombre}</p>
          <p><strong>Municipio:</strong> {notaria?.municipio}</p>
          <p><strong>Provincia:</strong> {notaria?.provincia}</p>
          <p><strong>Firmas:</strong> {notaria?.firmas}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>

      {/* Cerrar al hacer clic fuera */}
      <div className="absolute inset-0" onClick={onClose}></div>
    </div>
  );
}
