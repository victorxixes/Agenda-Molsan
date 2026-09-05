import { useEffect } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";

export default function SeguridadAuditoria() {
  const { auditoria, cargarTodo } = useSeguridad();

  useEffect(() => {
    cargarTodo();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Auditoría del sistema</h1>

      <table className="w-full border rounded bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Fecha</th>
            <th className="p-2">Usuario</th>
            <th className="p-2">Módulo</th>
            <th className="p-2">Acción</th>
            <th className="p-2">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {auditoria.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.fecha}</td>
              <td className="p-2">{a.usuario}</td>
              <td className="p-2">{a.modulo}</td>
              <td className="p-2">{a.accion}</td>
              <td className="p-2">{a.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
