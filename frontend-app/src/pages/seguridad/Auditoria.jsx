import { useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";

export default function Auditoria() {
  const { auditoria, cargarAuditoria } = useSeguridadStore();

  useEffect(() => {
    cargarAuditoria();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Auditoría del sistema</h2>

      {auditoria.map((a) => (
        <div key={a.id} className="border p-4 rounded">
          <p><strong>Módulo:</strong> {a.modulo}</p>
          <p><strong>Acción:</strong> {a.accion}</p>
          <p><strong>Usuario:</strong> {a.usuario_id}</p>
          <p><strong>Fecha:</strong> {a.creado_en}</p>
        </div>
      ))}
    </div>
  );
}
