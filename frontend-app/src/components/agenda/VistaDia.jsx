export default function VistaDia({ citas }) {
  return (
    <div className="space-y-4">
      {citas.length === 0 && (
        <p className="text-gray-500">No hay citas en este día.</p>
      )}

      {citas.map((cita) => (
        <div
          key={cita.id}
          className="border rounded p-4 shadow-sm bg-white"
        >
          <div className="font-semibold text-lg">
            {cita.hora_inicio} — {cita.hora_fin}
          </div>

          <div className="text-sm text-gray-600">
            {cita.tipo_cita}
          </div>

          {cita.notario && (
            <div className="text-sm mt-1">
              Notario: <strong>{cita.notario.nombre}</strong>
            </div>
          )}

          {cita.apoderado && (
            <div className="text-sm mt-1">
              Apoderado: <strong>{cita.apoderado.nombre}</strong>
            </div>
          )}

          {cita.observaciones && (
            <div className="text-sm mt-2 italic">
              {cita.observaciones}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
