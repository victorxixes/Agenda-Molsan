const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
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

export default function VistaSemana({ citas, onCitaClick, onCrearCita }) {
  return (
    <div className="grid grid-cols-[80px,repeat(7,1fr)] gap-1 text-xs">
      <div />
      {DIAS.map((d) => (
        <div key={d} className="text-center font-semibold text-gray-700">
          {d}
        </div>
      ))}

      {HORAS.map((h) => (
        <>
          <div
            key={`hora-${h}`}
            className="h-16 flex items-start justify-end pr-2 text-gray-500"
          >
            {h}
          </div>
          {DIAS.map((d, idx) => (
            <div
              key={`${h}-${d}`}
              className="h-16 border border-gray-100 hover:bg-gray-50 cursor-pointer"
              onDoubleClick={() => onCrearCita(new Date().toISOString().slice(0, 10))}
            >
              {citas
                .filter((c) => {
                  const fecha = new Date(c.fecha);
                  return fecha.getDay() === ((idx + 1) % 7);
                })
                .filter(
                  (c) => c.hora_inicio.split(":")[0] === h.split(":")[0]
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className={`m-0.5 p-1 rounded border shadow-sm cursor-pointer ${colorPorTipo(
                      c.tipo_cita
                    )}`}
                    onClick={() => onCitaClick(c)}
                  >
                    <div className="font-semibold">{c.tipo_cita}</div>
                    <div>
                      {c.hora_inicio} - {c.hora_fin}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </>
      ))}
    </div>
  );
}
