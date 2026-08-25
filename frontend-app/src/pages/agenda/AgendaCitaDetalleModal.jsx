import React from "react";
import { useAgendaStore } from "../../store/agendaStore";

export default function AgendaCitaDetalleModal() {
  const { citaActual, setCitaActual } = useAgendaStore();

  if (!citaActual) return null;

  const notarioNombre = citaActual.notario
    ? `${citaActual.notario.nombre} ${citaActual.notario.apellidos}`
    : citaActual.notario_id || "—";

  const apoderadoNombre = citaActual.apoderado
    ? `${citaActual.apoderado.nombre} ${citaActual.apoderado.apellidos}`
    : citaActual.apoderado_id || "—";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] space-y-4">

        <h2 className="text-2xl font-bold text-[#1F3A5F]">
          Detalle de la cita
        </h2>

        <p><strong>Fecha:</strong> {citaActual.fecha}</p>
        <p><strong>Hora:</strong> {citaActual.hora_inicio} - {citaActual.hora_fin}</p>
        <p><strong>Tipo:</strong> {citaActual.tipo_cita}</p>

        <p><strong>Notario:</strong> {notarioNombre}</p>
        <p><strong>Apoderado:</strong> {apoderadoNombre}</p>

        <p><strong>Tipo firma:</strong> {citaActual.tipo_firma || "—"}</p>
        <p><strong>Estado:</strong> {citaActual.estado}</p>
        <p><strong>Observaciones:</strong> {citaActual.observaciones || "—"}</p>

        <button
          onClick={() => setCitaActual(null)}
          className="w-full bg-[#1F3A5F] text-white py-2 rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
