import React from "react";
import { useEmpleadosStore } from "../../store/empleadosStore.js";

export default function MensajeListItem({ mensaje, propio }) {
  const { empleados } = useEmpleadosStore();

  // Nombre del remitente
  const autor =
    empleados.find((e) => e.id === mensaje.remitente_id)?.nombre || "Usuario";

  return (
    <div
      className={`
        p-3 rounded-xl mb-2 max-w-[75%] shadow-sm
        ${propio
          ? "bg-blue-100 ml-auto border border-blue-300"
          : "bg-gray-100 border border-gray-300"
        }
      `}
    >
      <p className="text-xs font-semibold text-gray-600">{autor}</p>
      <p className="text-sm leading-snug">{mensaje.mensaje}</p>
      <p className="text-[10px] text-gray-400 mt-1">{mensaje.fecha}</p>
    </div>
  );
}
