import { useEffect, useMemo, useCallback } from "react";

/**
 * ModalCtnDetalle — SJ‑2026 Premium
 * Muestra detalle de notaría + mapa + firmas.
 * - Glass‑UI
 * - Cierre por ESC
 * - Cierre por click‑outside
 * - Datos normalizados
 */

export default function ModalCtnDetalle({ open, onClose, notaria, firmas }) {
  if (!open) return null;

  /**
   * Cerrar con tecla ESC
   */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /**
   * Dirección completa para Google Maps
   */
  const direccionTexto = useMemo(() => {
    return [notaria?.direccion, notaria?.municipio, notaria?.provincia]
      .filter(Boolean)
      .join(" ");
  }, [notaria]);

  const mapaUrl = useMemo(() => {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      direccionTexto || ""
    )}&output=embed`;
  }, [direccionTexto]);

  /**
   * Evitar recrear funciones en cada render
   */
  const stopPropagation = useCallback((e) => e.stopPropagation(), []);

  return (
    <div
      className="
        fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50
      "
      onClick={onClose}
    >
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          shadow-2xl p-6 w-[650px] max-h-[85vh] overflow-y-auto text-white
        "
        onClick={stopPropagation}
      >
        {/* TÍTULO */}
        <h2 className="text-2xl font-bold mb-4 drop-shadow">
          Detalle Notaría #{notaria?.id}
        </h2>

        {/* DATOS PRINCIPALES */}
        <div className="space-y-2 text-sm text-white/80">
          <p><strong>Código:</strong> {notaria?.codigo}</p>
          <p><strong>Nombre:</strong> {notaria?.nombre} {notaria?.apellidos}</p>
          <p><strong>NIF:</strong> {notaria?.nif}</p>
          <p><strong>Teléfono:</strong> {notaria?.telefono || "No disponible"}</p>
          <p><strong>Provincia:</strong> {notaria?.provincia}</p>
          <p><strong>Municipio:</strong> {notaria?.municipio}</p>
          <p><strong>CP:</strong> {notaria?.cp}</p>
          <p><strong>Dirección:</strong> {notaria?.direccion || "No disponible"}</p>
          <p><strong>VC:</strong> {notaria?.vc ? "Sí" : "No"}</p>
          <p><strong>Apoderado:</strong> {notaria?.apoderado || "No asignado"}</p>
          <p><strong>Observación:</strong> {notaria?.observacion || "Sin observaciones"}</p>
        </div>

        {/* MAPA */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 drop-shadow">Ubicación</h3>

          <div className="border border-white/20 rounded-xl overflow-hidden shadow-xl">
            <iframe
              src={mapaUrl}
              width="100%"
              height="250"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>

        {/* FIRMAS */}
        {firmas && (
          <div className="mt-6 border-t border-white/20 pt-4 space-y-2 text-sm text-white/80">
            <h3 className="text-lg font-semibold drop-shadow">Firmas</h3>
            <p><strong>Total:</strong> {firmas.total_firmas}</p>
            <p><strong>VC:</strong> {firmas.total_vc}</p>
            <p><strong>Presencial:</strong> {firmas.total_presencial}</p>
          </div>
        )}

        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="
            mt-6 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
            text-white shadow-lg transition
          "
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
