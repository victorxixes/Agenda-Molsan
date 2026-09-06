export default function VistaSemana({ citas, onCitaClick }) {
  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const citasPorDia = {};

  citas.forEach((cita) => {
    if (!citasPorDia[cita.fecha]) citasPorDia[cita.fecha] = [];
    citasPorDia[cita.fecha].push(cita);
  });

  return (
    <div className="grid grid-cols-7 gap-3">
      {diasSemana.map((dia, idx) => {
        const fecha = Object.keys(citasPorDia)[idx];
        const citasDia = citasPorDia[fecha] || [];

        return (
          <div key={dia} className="border rounded p-2 bg-white">
            <div className="font-semibold mb-2">{dia}</div>

            {citasDia.length === 0 && (
              <p className="text-xs text-gray-400">Sin citas</p>
            )}

            {citasDia.map((cita) => (
              <div
                key={cita.id}
                onClick={() => onCitaClick(cita)}
                className="text-xs mb-2 p-1 border rounded bg-gray-50 cursor-pointer hover:bg-blue-50"
              >
                <strong>{cita.hora_inicio}</strong> — {cita.tipo_cita}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
