import { useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { useSeguridadWS } from "../../hooks/useSeguridadWS";

export default function SeguridadRealtimePanel() {
  const { connected, events } = useSeguridadWS("seguridad");
  const { addRealtimeEvent } = useSeguridadStore();

  // cada evento que llega por WS lo metemos en el store
  useEffect(() => {
    events.forEach((ev) => addRealtimeEvent(ev));
  }, [events]);

  const { eventos } = useSeguridadStore();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Realtime seguridad</h2>
        <span
          className={`inline-flex items-center gap-2 text-sm ${
            connected ? "text-green-600" : "text-red-600"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {connected ? "Conectado" : "Desconectado"}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-auto border rounded p-3 bg-neutral-50">
        {eventos.map((ev) => (
          <div key={ev.id ?? `${ev.fecha}-${ev.tipo}`} className="border-b pb-2 mb-2">
            <p className="font-semibold">{ev.tipo}</p>
            <p className="text-sm text-neutral-700">{ev.descripcion}</p>
            <p className="text-xs text-neutral-500">{ev.fecha}</p>
          </div>
        ))}
        {eventos.length === 0 && (
          <p className="text-sm text-neutral-500">Sin eventos de seguridad todavía.</p>
        )}
      </div>
    </div>
  );
}
