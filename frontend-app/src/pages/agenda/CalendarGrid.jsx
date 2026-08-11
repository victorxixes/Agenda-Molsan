import { useAgendaStore } from "../../store/agendaStore";

export default function CalendarGrid({ selectedDate, onSelectDay }) {
  const { citasMes } = useAgendaStore();

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = [];
  for (let i = 0; i < startDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));

  return (
    <div className="grid grid-cols-7 gap-1">

      {/* Cabecera */}
      {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
        <div key={d} className="text-center font-semibold py-2">
          {d}
        </div>
      ))}

      {/* Días */}
      {grid.map((day, i) => (
        <div
          key={i}
          className={`border p-2 h-28 cursor-pointer hover:bg-blue-50 transition ${
            day && day.toDateString() === selectedDate.toDateString()
              ? "bg-blue-100"
              : ""
          }`}
          onClick={() => day && onSelectDay(day)}
        >
          {day && (
            <>
              <div className="text-sm font-semibold">{day.getDate()}</div>

              <div className="mt-1 space-y-1">
                {(citasMes[day.toISOString().split("T")[0]] || []).map(ev => (
                  <span
                    key={ev.id}
                    className="block text-xs rounded px-1 text-white"
                    style={{ backgroundColor: ev.color }}
                  >
                    {ev.hora_inicio} {ev.tipo_cita}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
