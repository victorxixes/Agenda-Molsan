import { useEffect } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadLogs() {
  const { logs = [], cargarTodo } = useSeguridad();

  useEffect(() => {
    cargarTodo();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Logs del sistema</h1>

      <table className="w-full border rounded bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Fecha</th>
            <th className="p-2">Evento</th>
            <th className="p-2">Detalle</th>
            <th className="p-2">IP</th>
          </tr>
        </thead>

        <tbody>
          {(logs || []).map((l) => (
            <tr key={l.id} className="border-b">
              <td className="p-2">{l.fecha}</td>
              <td className="p-2">{l.evento}</td>
              <td className="p-2">{l.detalle || "-"}</td>
              <td className="p-2">{l.ip || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
