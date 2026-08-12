import { useAgendaStore } from "../store/agendaStore";

export default function AgendaSidebar({ date, citas, onEditarCita }) {
  const fecha = date.toISOString().split("T")[0];
  const { eliminar, cargarDia } = useAgendaStore();

  const onEliminarCita = async (id) => {
    if (!confirm("¿Eliminar esta cita?")) return;

    await eliminar(id);
    cargarDia(date.toISOString().split("T")[0]); // refresco automático
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">

      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{fecha}</h3>
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

          {citas.map((c) => (
            <tr key={c.id}>
              <td>{c.hora_inicio}</td>
              <td>{c.hora_fin}</td>
              <td>{c.tipo_cita}</td>
              <td>{c.notario_nombre}</td>
              <td>{c.tipo_firma}</td>
              <td>{c.apoderado}</td>
              <td>{c.estado}</td>

              <td className="flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onEditarCita(c.id)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onEliminarCita(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
