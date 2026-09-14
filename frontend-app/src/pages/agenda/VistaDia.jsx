import { useAgendaStore } from "../../store/agendaStore";

const HORAS = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);

function colorPorTipo(tipo) {
  switch (tipo) {
    case "Firma notarial":
      return "bg-blue-100 border-blue-400 text-blue-800";
    case "Reunión":
      return "bg-green-100 border-green-400 text-green-800";
    default:
      return "bg-gray-100 border-gray-300 text-gray-800";
  }
}

export default function VistaDia({ citas = [], onCitaClick, onCrearCita }) {
  const citasSeguras = Array.isArray(citas) ? citas : [];
  const resaltadaId = useAgendaStore((s) => s.resaltadaId);

  return (
    <div className="grid grid-cols-[80px,1fr] gap-2">
      {/* Columna de horas */}
      <div className="text-xs text-gray-500 flex flex-col">
        {HORAS.map((h) => (
          <div key={h} className="h-12 flex items-start justify-end pr-2">
            {h}
          </div>
        ))}
      </div>

      {/* Columna de citas */}
      <div className="relative border rounded-lg bg-white">
        {HORAS.map((h) => (
          <div
            key={h}
            className="h-12 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onDoubleClick={() =>
              onCrearCita(new Date().toISOString().slice(0, 10))
            }
          />
        ))}

        {citasSeguras.map((cita) => {
          const inicioHora = parseInt(cita.hora_inicio.split(":")[0], 10);
          const finHora = parseInt(cita.hora_fin.split(":")[0], 10);

          return (
            <div
              key={cita.id}
              className={`
                absolute left-4 right-4 mt-1 p-2 text-xs rounded border shadow-sm cursor-pointer
                ${colorPorTipo(cita.tipo_cita)}
                transition-all duration-300
                ${resaltadaId === cita.id ? "ring-2 ring-yellow-400 bg-yellow-50 shadow-md" : ""}
              `}
              style={{
                top: (inicioHora - 9) * 48,
                height: (finHora - inicioHora) * 48 - 4,
              }}
              onClick={() => onCitaClick(cita)}
            >
              <div className="font-semibold truncate">
                {cita.tipo_cita} — {cita.hora_inicio} - {cita.hora_fin}
              </div>

              <div className="truncate">
                Notario: {cita.notario_nombre || "—"}
              </div>

              <div className="truncate">
                Firma: {cita.tipo_firma}
              </div>

              <div className="truncate">
                Apoderado: {cita.apoderado_nombre || "—"}
              </div>

              {cita.observaciones && (
                <div className="text-[11px] mt-1 truncate">
                  Obs: {cita.observaciones}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
