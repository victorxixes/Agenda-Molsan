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
        <div key={ev.id} className="border p-3 rounded">
          <p className="font-semibold">{ev.tipo}</p>
          <p className="text-sm text-neutral-600">{ev.descripcion}</p>
          <p className="text-xs text-neutral-500">{ev.fecha}</p>
        </div>
      ))}
    </div>
  );
}
