import { useState } from "react";

export default function VistaMes({ citas, onDiaClick, onCitaClick }) {
  const [fecha] = useState(new Date());

  const year = fecha.getFullYear();
  const month = fecha.getMonth();

  const primerDia = new Date(year, month, 1);
  const diaSemana = primerDia.getDay();
  const offset = diaSemana === 0 ? 6 : diaSemana - 1;

  const diasMes = new Date(year, month + 1, 0).getDate();
  const diasPrevio = new Date(year, month, 0).getDate();

  const dias = [];

  for (let i = offset - 1; i >= 0; i--) {
    dias.push({ fecha: new Date(year, month - 1, diasPrevio - i), actual: false });
  }

  for (let i = 1; i <= diasMes; i++) {
    dias.push({ fecha: new Date(year, month, i), actual: true });
  }

  while (dias.length < 35) {
    dias.push({
      fecha: new Date(year, month + 1, dias.length - diasMes - offset + 1),
      actual: false,
    });
  }

  const formatoFecha = (d) => d.toISOString().slice(0, 10);

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
        <div key={d} className="text-center font-semibold text-gray-600">
          {d}
        </div>
      ))}

      {dias.map(({ fecha, actual }, idx) => {
        const fechaStr = formatoFecha(fecha);
        const citasDia = citas.filter((c) => c.fecha === fechaStr);

        return (
          <div
            key={idx}
            className={`p-2 rounded border cursor-pointer transition ${
              actual ? "bg-white" : "bg-gray-100 text-gray-400"
            } hover:bg-blue-50 hover:border-blue-400`}
          >
            <div onClick={() => onDiaClick(fechaStr)} className="text-sm font-medium">
              {fecha.getDate()}
            </div>

            {citasDia.length > 0 && (
              <div className="mt-1 space-y-1">
                {citasDia.map((cita) => (
                  <div
                    key={cita.id}
                    onClick={() => onCitaClick(cita)}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    {cita.hora_inicio} — {cita.notario?.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
