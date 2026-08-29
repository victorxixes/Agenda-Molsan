import { useAgendaStore } from "../store/agendaStore";

export default function AgendaSidebar({ date }) {
  const fecha = date.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h3 className="text-xl font-bold">{fecha}</h3>
      {/* Sidebar limpio — sin citas */}
    </div>
  );
}
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">

      {/* Fecha */}
      <h3 className="text-xl font-bold">{fecha}</h3>

      {/* 🔥 Si NO hay citas → NO mostrar nada */}
      {citas.length === 0 && <></>}

      {/* 🔥 Si hay citas → mostrarlas en formato limpio */}
      {citas.length > 0 && citas.map((c) => {
        const notarioNombre = c.notario
          ? `${c.notario.nombre} ${c.notario.apellidos}`
          : "—";

        const apoderadoNombre = c.apoderado
          ? `${c.apoderado.nombre} ${c.apoderado.apellidos}`
          : c.apoderado_id || "—";

        return (
          <div
            key={c.id}
            className="p-3 rounded-lg bg-gray-50 shadow cursor-pointer hover:bg-gray-100"
            onClick={() => setCitaActual(c)}
          >
            <div className="font-bold">{c.hora_inicio} — {c.hora_fin}</div>
            <div>{c.tipo_cita}</div>

            <div className="text-sm text-gray-600">{notarioNombre}</div>
            <div className="text-sm text-gray-600">{apoderadoNombre}</div>

            <div className="flex gap-2 mt-2">
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
            </div>
          </div>
        );
      })}

    </div>
  );
}
