import { useEffect } from "react";
import { useAgenda } from "../../hooks/useAgenda";
import { useAgendaWS } from "../../hooks/useAgendaWS";

export default function Agenda() {
  const {
    citas,
    cargarDia,
    cargarSemana,
    cargarMes,
    vista,
    fechaActual,
  } = useAgenda();

  useAgendaWS(1); // usuario actual

  useEffect(() => {
    cargarDia(new Date().toISOString().slice(0, 10));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agenda</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => cargarDia(fechaActual)}>Día</button>
        <button onClick={() => cargarSemana(fechaActual)}>Semana</button>
        <button
          onClick={() =>
            cargarMes(
              new Date(fechaActual).getFullYear(),
              new Date(fechaActual).getMonth() + 1
            )
          }
        >
          Mes
        </button>
      </div>

      <div>
        {vista === "dia" && <VistaDia citas={citas} />}
        {vista === "semana" && <VistaSemana citas={citas} />}
        {vista === "mes" && <VistaMes citas={citas} />}
      </div>
    </div>
  );
}

