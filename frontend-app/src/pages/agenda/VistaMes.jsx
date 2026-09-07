const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function getMatrix(fechaBase) {
  const f = new Date(fechaBase);
  const year = f.getFullYear();
  const month = f.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function colorPorTipo(tipo) {
  switch (tipo) {
    case "Firma notarial":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "Reunión":
      return "bg-green-50 text-green-800 border-green-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200";
  }
}

export default function VistaMes({ citas, onDiaClick, onCitaClick }) {
  const fechaBase =
    citas[0]?.fecha || new Date().toISOString().slice(0, 10);
  const matrix = getMatrix(fechaBase);

  return (
    <div className="text-xs">
      <div className="grid grid-cols-7 mb-2">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center font-semibold text-gray-700">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {matrix.map((week, wi) =>
          week.map((day, di) => {
            if (!day) {
              return (
                <div
                  key={`${wi}-${di}`}
                  className="h-24 border border-gray-100 bg-gray-50"
                />
              );
            }

            const fechaStr = day.toISOString().slice(0, 10);
            const citasDia = citas.filter((c) => c.fecha === fechaStr);

            return (
              <div
                key={`${wi}-${di}`}
                className="h-24 border border-gray-100 bg-white rounded hover:bg-gray-50 cursor-pointer flex flex-col p-1"
                onClick={() => onDiaClick(fechaStr)}
              >
                <div className="text-right text-[11px] font-semibold text-gray-700">
                  {day.getDate()}
                </div>

                <div className="mt-1 space-y-1 overflow-hidden">
                  {citasDia.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className={`text-[11px] px-1 py-0.5 rounded border cursor-pointer truncate ${colorPorTipo(
                        c.tipo_cita
                      )}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCitaClick(c);
                      }}
                    >
                      {c.tipo_cita} ({c.hora_inicio})
                    </div>
                  ))}
                  {citasDia.length > 3 && (
                    <div className="text-[10px] text-gray-500">
                      +{citasDia.length - 3} más…
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
