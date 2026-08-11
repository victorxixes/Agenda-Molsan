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
            <tr key={c.id}>
              <td>{c.hora_inicio}</td>
              <td>{c.hora_fin}</td>
              <td>{c.tipo_cita}</td>

              {/* Notario */}
              <td>
                {c.notario
                  ? `${c.notario.nombre} ${c.notario.apellidos}`
                  : "-"}
              </td>

              {/* Tipo firma */}
              <td>{c.tipo_firma || "-"}</td>

              {/* Apoderado */}
              <td>
                {c.apoderado
                  ? `${c.apoderado.nombre} ${c.apoderado.apellidos}`
                  : "-"}
              </td>

              <td>{c.estado}</td>

              <td>
                <button
                  className="btn"
                  onClick={() => onEditarCita(c.id)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
