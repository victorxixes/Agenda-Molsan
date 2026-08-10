import React, { useState } from "react";
import { useLogsStore } from "../../store/logsStore";

export default function LogsFilters() {
  const {
    cargarLogs,
    filtrarPorUsuario,
    filtrarPorModulo,
    filtrarPorNivel,
    filtrarPorFecha,
  } = useLogsStore();

  const [usuario, setUsuario] = useState("");
  const [modulo, setModulo] = useState("");
  const [nivel, setNivel] = useState("");
  const [fecha, setFecha] = useState("");

  return (
    <div className="flex gap-3 mb-4 flex-wrap">

      <input
        className="border px-2 py-1 rounded"
        placeholder="Usuario ID"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded"
        onClick={() => filtrarPorUsuario(usuario)}
      >
        Usuario
      </button>

      <input
        className="border px-2 py-1 rounded"
        placeholder="Módulo"
        value={modulo}
        onChange={(e) => setModulo(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-3 py-1 rounded"
        onClick={() => filtrarPorModulo(modulo)}
      >
        Módulo
      </button>

      <select
        className="border px-2 py-1 rounded"
        value={nivel}
        onChange={(e) => setNivel(e.target.value)}
      >
        <option value="">Nivel</option>
        <option value="INFO">INFO</option>
        <option value="WARNING">WARNING</option>
        <option value="ERROR">ERROR</option>
      </select>
      <button
        className="bg-orange-600 text-white px-3 py-1 rounded"
        onClick={() => filtrarPorNivel(nivel)}
      >
        Nivel
      </button>

      <input
        type="date"
        className="border px-2 py-1 rounded"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white px-3 py-1 rounded"
        onClick={() => filtrarPorFecha(fecha)}
      >
        Fecha
      </button>

      <button
        className="bg-gray-700 text-white px-3 py-1 rounded"
        onClick={cargarLogs}
      >
        Reset
      </button>
    </div>
  );
}
