export default function AgendaSidebar({ date, citas, onEditarCita }) {
  const fecha = date.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">

      {/* Cabecera sin botón */}
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

          {citas.map(c => (
  <div key={c.id} className="p-3 bg-white/60 rounded-lg shadow flex justify-between items-center">

    <div>
      <div className="font-semibold">{c.tipo_cita}</div>
      <div className="text-sm">{c.hora_inicio} - {c.hora_fin}</div>
      <div className="text-xs text-gray-600">{c.apoderado}</div>
    </div>

    <div className="flex gap-2">
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
    </div>

  </div>
))}

        </tbody>
      </table>

    </div>
  );
}
