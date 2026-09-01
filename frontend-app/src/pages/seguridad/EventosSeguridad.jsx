import { useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";

export default function EventosSeguridad() {
  const { eventos, cargarEventos } = useSeguridadStore();

  useEffect(() => {
    cargarEventos();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Eventos de seguridad</h2>

      {eventos.map((ev) => (
        <div key={ev.id} className="border p-4 rounded">
          <p><strong>Tipo:</strong> {ev.tipo}</p>
          <p><strong>Usuario:</strong> {ev.usuario_id}</p>
          <p><strong>Detalle:</strong> {ev.detalle}</p>
          <p><strong>IP:</strong> {ev.ip}</p>
          <p><strong>Fecha:</strong> {ev.creado_en}</p>
        </div>
      ))}
    </div>
  );
}
