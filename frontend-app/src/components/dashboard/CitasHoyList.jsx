import React from "react";
import { useAgendaStore } from "../../store/agendaStore";

export default function CitasHoyList() {
  const { resumen } = useAgendaStore();

  // Si tu Dashboard carga las citas del día en otro sitio, ajustamos aquí:
  const citasHoy = resumen?.citas_dia || [];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-xl font-bold mb-4" style={{ color: "#1F3A5F" }}>
        Citas del día
      </h3>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Día de firma</th>
            <th className="p-2 border">Apoderado</th>
            <th className="p-2 border">Notario</th>
            <th className="p-2 border">Hora inicio</th>
            <th className="p-2 border">Hora fin</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {citasHoy.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No hay citas hoy
              </td>
            </tr>
          ) : (
            citasHoy.map((cita) => {
              const apoderado =
                cita.apoderado_s ||
                (cita.apoderado
                  ? `${cita.apoderado.nombre} ${cita.apoderado.apellidos}`
                  : null) ||
                cita.apoderado_id ||
                "—";

              const notario =
                cita.notario
                  ? `${cita.notario.nombre} ${cita.notario.apellidos}`
                  : cita.notario_id || "—";

              return (
                <tr key={cita.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{cita.fecha}</td>
                  <td className="p-2 border">{apoderado}</td>
                  <td className="p-2 border">{notario}</td>
                  <td className="p-2 border">{cita.hora_inicio}</td>
                  <td className="p-2 border">{cita.hora_fin}</td>

                  <td className="p-2 border">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        useAgendaStore.getState().setCitaActual(cita);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
