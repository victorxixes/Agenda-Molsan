import React from "react";
import { useAgendaStore } from "../../store/agendaStore";

export default function CalendarGrid({ selectedDate, onSelectDay }) {
  const { citasMes, setCitaActual } = useAgendaStore();

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth(); // 0–11

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay(); // 0 domingo

  const tipoIcono = {
    "firma notarial": "🖋️",
    "videoconferencia": "🎥",
    "presencial": "📍",
    "otros": "📄",
  };

  const grid = [];

  for (let i = 0; i < startWeekday; i++) {
    grid.push(<div key={`empty-${i}`} className="h-28 border rounded-lg bg-gray-50"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const fecha = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const citas = citasMes[fecha] || [];

    grid.push(
      <div
        key={fecha}
        className="h-28 border rounded-lg p-2 bg-white hover:bg-gray-50 transition cursor-pointer"
        onClick={() => onSelectDay(new Date(year, month, day))}
      >
        <div className="font-semibold">{day}</div>

        <div className="mt-1 space-y-1">
          {citas.map((cita) => {
            const icono = tipoIcono[cita.tipo_cita] || "📄";

            return (
              <div
                key={cita.id}
                className="p-1 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setCitaActual(cita);
                }}
                title={`Notario: ${cita.notario_id}\nApoderado: ${cita.apoderado}\nHora: ${cita.hora_inicio}`}
              >
                <div className="flex items-center gap-1 text-sm">
                  <span>{icono}</span>
                  <span className="font-bold">{cita.hora_inicio}</span>
                </div>
                <div className="text-xs text-gray-700">
                  Notario: {cita.notario_id}
                </div>
                <div className="text-xs text-gray-700">
                  Apoderado: {cita.apoderado || "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {grid}
    </div>
  );
}
