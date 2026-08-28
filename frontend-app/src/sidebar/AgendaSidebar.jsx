import { useAgendaStore } from "../store/agendaStore";

export default function AgendaSidebar({ date, citas, onEditarCita, onNuevaCita }) {
  const fecha = date.toISOString().split("T")[0];
  const { eliminar, setCitaActual } = useAgendaStore();

  const onEliminarCita = async (id) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    await eliminar(id);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{fecha}</h3>

        {/* 🔥 BOTÓN NUEVA CITA */}
        <button
          className="btn-primary"
          onClick={onNuevaCita}
        >
          Nueva cita
        </button>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Hora inicio</th>
            <th>Hora fin</th>
            <th>Tipo de cita</th>
            <th>Notario</th>
            <th>Tipo firma</th>
            <th>Apoderado</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {citas.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No hay citas en esta fecha
              </td>
            </tr>
          )}

          {citas.map((c) => {
            const notarioNombre = c.notario
              ? `${c.notario.nombre} ${c.notario.apellidos}`
              : "—";

            const apoderadoNombre = c.apoderado
              ? `${c.apoderado.nombre} ${c.apoderado.apellidos}`
              : c.apoderado_id || "—";

            return (
              <tr
                key={c.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setCitaActual(c)}
              >
                <td>{c.hora_inicio}</td>
                <td>{c.hora_fin}</td>
                <td>{c.tipo_cita}</td>
                <td>{notarioNombre}</td>
                <td>{c.tipo_firma || "—"}</td>
                <td>{apoderadoNombre}</td>
                <td>{c.estado}</td>

                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditarCita(c.id);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEliminarCita(c.id);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}
