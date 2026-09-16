import { useMemo, useCallback } from "react";
import { useAgendaStore } from "../../store/agendaStore";

/**
 * VistaDia — SJ‑2026 Premium
 * - Timeline glass‑UI
 * - Animaciones suaves
 * - Render optimizado
 */

const HORAS = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);

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

export default function VistaDia({ fechaDia, citas = [], onCitaClick, onCrearCita }) {
  const resaltadaId = useAgendaStore((s) => s.resaltadaId);

  const fechaNormalizada = useMemo(
    () => fechaDia.toLocaleDateString("sv-SE"),
    [fechaDia]
  );

  const citasSeguras = useMemo(() => (Array.isArray(citas) ? citas : []), [citas]);

  const crearCitaDia = useCallback(() => {
    onCrearCita(fechaNormalizada);
  }, [fechaNormalizada, onCrearCita]);

  const citasPosicionadas = useMemo(() => {
    return citasSeguras.map((cita) => {
      const inicioHora = parseInt(cita.hora_inicio.split(":")[0], 10);
      const finHora = parseInt(cita.hora_fin.split(":")[0], 10);

      return {
        ...cita,
        top: (inicioHora - 9) * 48,
        height: (finHora - inicioHora) * 48 - 4,
      };
    });
  }, [citasSeguras]);

  return (
    <div className="grid grid-cols-[80px,1fr] gap-4 text-xs animate-fade-in">

      {/* Columna de horas */}
      <div className="text-white/70 flex flex-col">
        {HORAS.map((h) => (
          <div key={h} className="h-12 flex items-start justify-end pr-2">
            {h}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div
        className="
          relative border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl shadow-xl
          overflow-hidden
        "
      >
        {/* Bloques horarios */}
        {HORAS.map((h) => (
          <div
            key={h}
            className="
              h-12 border-b border-white/10 hover:bg-white/10 cursor-pointer
              transition-all duration-300
            "
            onDoubleClick={crearCitaDia}
          />
        ))}

        {/* Citas posicionadas */}
        {citasPosicionadas.map((cita) => (
          <div
            key={cita.id}
            className={`
              absolute left-4 right-4 mt-1 p-3 rounded-xl border shadow-lg cursor-pointer
              backdrop-blur-xl
              ${colorPorTipo(cita.tipo_cita)}
              transition-all duration-300
              ${
                resaltadaId === cita.id
                  ? "ring-2 ring-yellow-400 bg-yellow-500/20 scale-[1.03]"
                  : "hover:scale-[1.02]"
              }
            `}
            style={{
              top: cita.top,
              height: cita.height,
            }}
            onClick={() => onCitaClick(cita)}
          >
            <div className="font-semibold truncate text-white">
              {cita.tipo_cita} — {cita.hora_inicio} - {cita.hora_fin}
            </div>

            <div className="truncate text-white/80">
              Notario: {cita.notario_nombre || "—"}
            </div>

            <div className="truncate text-white/80">
              Firma: {cita.tipo_firma}
            </div>

            <div className="truncate text-white/80">
              Apoderado: {cita.apoderado_nombre || "—"}
            </div>

            {cita.observaciones && (
              <div className="text-[11px] mt-1 truncate text-white/70">
                Obs: {cita.observaciones}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
