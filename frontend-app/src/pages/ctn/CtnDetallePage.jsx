import { useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCtn } from "../../hooks/useCtn";

/**
 * CtnDetallePage — SJ‑2026 Premium
 * - Ficha completa de notaría
 * - Glass‑UI
 * - Animaciones fade‑in
 * - Render optimizado
 */

export default function CtnDetallePage() {
  const { id } = useParams();
  const {
    notaria,
    firmas,
    cargarNotaria,
    cargarFirmasNotaria,
    loading,
  } = useCtn();

  const cargar = useCallback(() => {
    cargarNotaria(id);
    cargarFirmasNotaria(id);
  }, [id, cargarNotaria, cargarFirmasNotaria]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const datosNotaria = useMemo(() => notaria, [notaria]);
  const datosFirmas = useMemo(() => firmas, [firmas]);

  if (loading || !datosNotaria) {
    return (
      <p className="text-white/70 p-6 animate-pulse">
        Cargando notaría…
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6 text-white animate-fade-in">

      {/* HEADER PREMIUM */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
          p-6 shadow-xl
        "
      >
        <h1 className="text-3xl font-bold drop-shadow">
          {datosNotaria.nombre} {datosNotaria.apellidos}
        </h1>
        <p className="text-white/70">
          Ficha completa de la notaría #{datosNotaria.id}
        </p>
      </div>

      {/* DATOS PRINCIPALES */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
          p-6 shadow-xl space-y-2
        "
      >
        <p><strong>Código:</strong> {datosNotaria.codigo}</p>
        <p><strong>NIF:</strong> {datosNotaria.nif}</p>
        <p><strong>Teléfono:</strong> {datosNotaria.telefono}</p>
        <p><strong>Provincia:</strong> {datosNotaria.provincia}</p>
        <p><strong>Municipio:</strong> {datosNotaria.municipio}</p>
        <p><strong>CP:</strong> {datosNotaria.cp}</p>
        <p><strong>Dirección:</strong> {datosNotaria.direccion}</p>
        <p><strong>VC:</strong> {datosNotaria.vc}</p>
        <p><strong>Apoderado:</strong> {datosNotaria.apoderado}</p>
        <p><strong>Observación:</strong> {datosNotaria.observacion}</p>
      </div>

      {/* FIRMAS */}
      {datosFirmas && (
        <div
          className="
            bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
            p-6 shadow-xl
          "
        >
          <h2 className="text-xl font-semibold mb-2 drop-shadow">
            Firmas
          </h2>

          <p><strong>Total:</strong> {datosFirmas.total_firmas}</p>
          <p><strong>VC:</strong> {datosFirmas.total_vc}</p>
          <p><strong>Presencial:</strong> {datosFirmas.total_presencial}</p>
        </div>
      )}
    </div>
  );
}
