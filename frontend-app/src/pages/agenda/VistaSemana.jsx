import React from "react";
import { useAgendaStore } from "../../store/agendaStore";

// ⭐ Solo días laborales
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie"];

const HORAS = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);

function colorPorTipo(tipo) {
  switch (tipo) {
    case "Firma notarial":
      return "bg-blue-500/20 border-blue-400 text-blue-200";
    case "Reunión":
      return "bg-green-500/20 border-green-400 text-green-200";
    default:
      return "bg-white/10 border-white/20 text-white";
  }
}

export default function VistaSemana({
  fechaBase,
  citas = [],
  onCitaClick,
  onCrearCita,
}) {
  const citasSeguras = Array.isArray(citas) ? citas : [];
  const resaltadaId = useAgendaStore((s) => s.resaltadaId);

  // ⭐ Obtener fecha real de cada día laboral de la semana
  const obtenerFechaDia = (idx) => {
    const fecha = new Date(fechaBase);
    fecha.setDate(fecha.getDate() + idx); // Lunes + idx
    return fecha.toLocaleDateString("sv-SE"); // YYYY-MM-DD sin UTC
  };

  return (
    <div
      className="
        grid grid-cols-[80px,repeat(5,1fr)] gap-2 text-xs
        bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl
      "
    >
      {/* Cabecera vacía */}
      <div />

      {/* Cabecera días */}
      {DIAS.map((d) => (
        <div
          key={d}
          className="text-center font-semibold text-white/80 tracking-wide"
        >
          {d}
        </div>
      ))}

      {/* Filas de horas */}
      {HORAS.map((h) => (
        <React.Fragment key={h}>
          {/* Columna de horas */}
          <div className="h-16 flex items-start justify-end pr-2 text-white/60">
            {h}
          </div>

          {/* Columnas de días */}
          {DIAS.map((_, idx) => (
            <div
              key={`${h}-${idx}`}
              className="
                h-16 border border-white/10 rounded-xl bg-white/5
                hover:bg-white/10 transition-all duration-300 cursor-pointer relative
              "
              onDoubleClick={() => onCrearCita(obtenerFechaDia(idx))}
            >
              {citasSeguras
                .filter((c) => {
                  // ⭐ FIX DEFINITIVO: evitar UTC
                  const fechaCita = new Date(`${c.fecha}T12:00:00`);
                  const diaSemana = fechaCita.getDay(); // 1=Lun, 2=Mar...

                  // ⭐ Ajuste: Lunes=1 → idx=0
                  return diaSemana === idx + 1;
                })
                .filter((c) => {
                  const horaCita = c.hora_inicio.split(":")[0];
                  const horaBloque = h.split(":")[0];
                  return horaCita === horaBloque;
                })
                .map((c) => (
                  <div
                    key={c.id}
                    className={`
                      absolute inset-0 m-0.5 p-2 rounded-xl border shadow-lg cursor-pointer truncate
                      backdrop-blur-xl
                      ${colorPorTipo(c.tipo_cita)}
                      transition-all duration-300
                      ${
                        resaltadaId === c.id
                          ? "ring-2 ring-yellow-400 bg-yellow-500/20 scale-[1.03]"
                          : "hover:scale-[1.02]"
                      }
                    `}
                    onClick={() => onCitaClick(c)}
                  >
                    <div className="font-semibold truncate text-white">
                      {c.tipo_cita} — {c.hora_inicio}
                    </div>

                    <div className="truncate text-white/80">
                      Notario: {c.notario_nombre || "—"}
                    </div>

                    <div className="truncate text-white/80">
                      Firma: {c.tipo_firma}
                    </div>

                    <div className="truncate text-white/80">
                      Apoderado: {c.apoderado || "—"}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
