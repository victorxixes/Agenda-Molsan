import { useEffect } from "react";

export default function ModalCtnDetalle({ open, onClose, notaria, firmas }) {
  if (!open) return null;

  // Cerrar con ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Construir dirección para Google Maps
  const direccion = `${notaria?.nombre || ""} ${notaria?.apellidos || ""} ${notaria?.municipio || ""} ${notaria?.provincia || ""}`;
  const mapaUrl = `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-[650px] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          Detalle Notaría #{notaria?.id}
        </h2>

        {/* Datos principales */}
        <div className="space-y-2 text-sm">
          <p><strong>Código:</strong> {notaria?.codigo}</p>
          <p><strong>Nombre:</strong> {notaria?.nombre} {notaria?.apellidos}</p>
          <p><strong>NIF:</strong> {notaria?.nif}</p>
          <p><strong>Teléfono:</strong> {notaria?.telefono || "No disponible"}</p>
          <p><strong>Provincia:</strong> {notaria?.provincia}</p>
          <p><strong>Municipio:</strong> {notaria?.municipio}</p>
          <p><strong>VC:</strong> {notaria?.vc ? "Sí" : "No"}</p>
          <p><strong>Apoderado:</strong> {notaria?.apoderado || "No asignado"}</p>
          <p><strong>Observación:</strong> {notaria?.observacion || "Sin observaciones"}</p>
        </div>

        {/* Mapa */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Ubicación</h3>
          <div className="border rounded overflow-hidden">
            <iframe
              src={mapaUrl}
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Firmas */}
        {firmas && (
          <div className="mt-6 border-t pt-4 space-y-2 text-sm">
            <h3 className="text-lg font-semibold">Firmas</h3>
            <p><strong>Total:</strong> {firmas.total_firmas}</p>
            <p><strong>VC:</strong> {firmas.total_vc}</p>
            <p><strong>Presencial:</strong> {firmas.total_presencial}</p>
          </div>
        )}

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
