import { useMemo, useCallback } from "react";
import { useAgendaStore } from "../../store/agendaStore";

/**
 * VistaMes — SJ‑2026 Premium
 * - Calendario laboral (Lun–Vie)
 * - Glass‑UI
 * - Animaciones suaves
 * - Render optimizado
 */

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie"];

const colorPorTipo = (tipo) => {
  switch (tipo) {
    case "Firma notarial":
      return "bg-blue-500/20 border-blue-400 text-blue-200";
    case "Reunión":
      return "bg-green-500/20 border-green-400 text-green-200";
    default:
      return "bg-white/10 border-white/20 text-white";
  }
};

function generarMatriz(fechaBase) {
  const f = new Date(fechaBase);
  if (isNaN(f.getTime())) return [[]];

  const year = f.getFullYear();
  const month = f.getMonth();
  const firstDay = new Date(year, month, 1);

  const start = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    const semanaCompleta = cells.slice(i, i + 7);
    weeks.push(semanaCompleta.slice(0, 5)); // Solo L–V
  }

  return weeks;
}

export default function VistaMes({ year, month, citas, onDiaClick, onCitaClick }) {
  const resaltadaId = useAgendaStore((s) => s.resaltadaId);

  const fechaBase = useMemo(
    () => `${year}-${String(month).padStart(2, "0")}-01`,
    [year, month]
  );

  const matrix = useMemo(() => generarMatriz(fechaBase), [fechaBase]);

  const citasSeguras = useMemo(() => (Array.isArray(citas) ? citas : []), [citas]);

  const obtenerCitasDia = useCallback(
    (fechaStr) =>
      citasSeguras.filter((c) => (c.fecha || "").slice(0, 10) === fechaStr),
    [citasSeguras]
  );

  return (
    <div className="text-xs text-white animate-fade-in">

      {/* Cabecera días */}
      <div className="grid grid-cols-5 mb-3">
        {DIAS_SEMANA.map((d) => (
          <div
            key={d}
            className="text-center font-semibold text-white/80 tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-5 gap-2">
        {matrix.map((week, wi) =>
          week.map((day, di) => {
            if (!day) {
              return (
                <div
                  key={`${wi}-${di}`}
                  className="
                    h-28 rounded-xl bg-white/5 border border-white/10 
                    backdrop-blur-xl shadow-inner
                  "
                />
              );
            }

            const fechaStr = day.toLocaleDateString("sv-SE");
            const citasDia = obtenerCitasDia(fechaStr);

            return (
              <div
                key={`${wi}-${di}`}
                className="
                  h-28 rounded-xl bg-white/5 border border-white/10 
                  backdrop-blur-xl shadow-lg p-2 flex flex-col cursor-pointer
                  hover:bg-white/10 transition-all duration-300
                "
                onClick={() => onDiaClick(fechaStr)}
              >
                {/* Número del día */}
                <div className="text-right text-[12px] font-semibold text-white/90">
                  {day.getDate()}
                </div>

                {/* Citas */}
                <div className="mt-1 space-y-1 overflow-y-auto max-h-20 pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {citasDia.map((c) => (
                    <div
                      key={c.id}
                      className={`
                        text-[11px] px-2 py-1 rounded-lg border truncate
                        ${colorPorTipo(c.tipo_cita)}
                        backdrop-blur-md shadow-md
                        transition-all duration-300
                        ${
                          resaltadaId === c.id
                            ? "ring-2 ring-yellow-400 bg-yellow-500/20 scale-[1.03]"
                            : "hover:scale-[1.02]"
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCitaClick(c);
                      }}
                    >
                      <div className="font-semibold truncate">
                        {c.tipo_cita} — {c.hora_inicio} → {c.hora_fin}
                      </div>

                      <div className="truncate text-white/80">
                        Notario: {c.notario_nombre || "—"}
                      </div>

                      <div className="truncate text-white/80">
                        Firma: {c.tipo_firma}
                      </div>

                      <div className="truncate text-white/80">
                        Apoderado: {c.apoderado_nombre || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
