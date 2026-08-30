import React from "react";
import { useAgendaStore } from "../../store/agendaStore";

// 🔥 Iconos para tipo de cita
const iconoTipoCita = (tipo) => {
  switch (tipo) {
    case "Firma notarial": return "🖋";
    case "Reunión": return "👥";
    case "Visita": return "👣";
    default: return "📄";
  }
};

// 🔥 Iconos para tipo de firma basado en vc
const iconoTipoFirma = (vc) => {
  switch (vc) {
    case "SI": return "🎥";
    case "NO": return "📍";
    default: return "📄";
  }
};

export default function CalendarGrid({ selectedDate, onSelectDay, onNuevaCita }) {
  const { citasMes, setCitaActual } = useAgendaStore();

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const grid = [];

  // Espacios vacíos antes del día 1
  for (let i = 0; i < startWeekday; i++) {
    grid.push(
      <div
        key={`empty-${i}`}
        className="min-h-28 border rounded-lg bg-gray-50"
      ></div>
    );
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const fecha = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const citas = citasMes[fecha] || [];

    grid.push(
      <div
        key={fecha}
        className="min-h-28 border rounded-lg p-2 bg-white hover:bg-gray-50 transition cursor-pointer"
        onClick={() => {
          onSelectDay(new Date(year, month, day));
          onNuevaCita();
        }}
      >
        <div className="font-semibold">{day}</div>

        <div className="mt-1 space-y-1">
          {citas.map((cita) => {

            // 🔥 Icono final: primero vc, si no existe → tipo_cita
            const icono = cita.vc
              ? iconoTipoFirma(cita.vc)
              : iconoTipoCita(cita.tipo_cita);

            const notarioNombre = cita.notario
              ? `${cita.notario.nombre} ${cita.notario.apellidos}`
              : cita.notario_id || "—";

            // 🔥 Apoderado final (prioridad CTN → empleado → id → —)
            const apoderadoNombre =
              cita.apoderado_s ||
              (cita.apoderado
                ? `${cita.apoderado.nombre} ${cita.apoderado.apellidos}`
                : null) ||
              cita.apoderado_id ||
              "—";

            const tipoFirmaLabel =
              cita.vc === "SI"
                ? "Videoconferencia"
                : cita.vc === "NO"
                ? "Presencial"
                : "—";

            const observacionLabel = cita.observacion || "—";

            return (
              <div
                key={cita.id}
                className="p-1 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setCitaActual(cita);
                }}
                title={`Notario: ${notarioNombre}
Apoderado: ${apoderadoNombre}
Hora: ${cita.hora_inicio}
Tipo firma: ${tipoFirmaLabel}
Observación: ${observacionLabel}`}
              >
                <div className="flex items-center gap-1 text-sm">
                  <span>{icono}</span>
                  <span className="font-bold">{cita.hora_inicio}</span>
                </div>

                <div className="text-xs text-gray-700">
                  {notarioNombre}
                </div>

                {/* 🔥 Apoderado con icono y color */}
                <div className="text-xs text-blue-700 font-medium flex items-center gap-1">
                  <span>👤</span>
                  <span>{apoderadoNombre}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <div className="grid grid-cols-7 gap-2 mt-4">{grid}</div>;
}
