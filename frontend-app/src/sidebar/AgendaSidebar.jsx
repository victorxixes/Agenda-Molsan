export default function AgendaSidebar({ date, citas, onNuevaCita }) {
  const fecha = date.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{fecha}</h3>

        <button className="btn-primary" onClick={onNuevaCita}>
          Nueva cita
        </button>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Tipo</th>
            <th>Apoderado</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {citas.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No hay citas en esta fecha
              </td>
            </tr>
          )}

          {citas.map(c => (
            <tr key={c.id}>
              <td>{c.hora_inicio}</td>
              <td>{c.tipo_cita}</td>
              <td>{c.apoderado_nombre}</td>
              <td>{c.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
