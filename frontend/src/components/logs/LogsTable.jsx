import React from "react";
import { useLogsStore } from "../../store/logsStore";

export default function LogsTable() {
  const { logs, loading } = useLogsStore();

  if (loading) return <p>Cargando logs...</p>;

  return (
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">Fecha</th>
          <th className="border px-2 py-1">Usuario</th>
          <th className="border px-2 py-1">Módulo</th>
          <th className="border px-2 py-1">Acción</th>
          <th className="border px-2 py-1">Descripción</th>
          <th className="border px-2 py-1">Nivel</th>
        </tr>
      </thead>

      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td className="border px-2 py-1">
              {new Date(log.fecha).toLocaleString()}
            </td>
            <td className="border px-2 py-1">{log.usuario_id || "-"}</td>
            <td className="border px-2 py-1">{log.modulo}</td>
            <td className="border px-2 py-1">{log.accion}</td>
            <td className="border px-2 py-1">{log.descripcion}</td>
            <td className="border px-2 py-1">{log.nivel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
