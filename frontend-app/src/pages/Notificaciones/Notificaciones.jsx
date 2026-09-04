import { useNotificacionesStore } from "../../store/notificacionesStore";
import { useNotificacionesWS } from "../../hooks/useNotificacionesWS";

export default function Notificaciones() {
  const { notificaciones, clearNotificaciones } = useNotificacionesStore();

  useNotificacionesWS();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notificaciones internas</h1>
        <button
          className="text-sm px-3 py-1 border rounded"
          onClick={clearNotificaciones}
        >
          Limpiar
        </button>
      </div>

      {notificaciones.length === 0 ? (
        <p className="text-gray-500">No hay notificaciones.</p>
      ) : (
        <ul className="space-y-2">
          {notificaciones.map((n) => (
            <li
              key={n.id}
              className="border rounded p-3 bg-white shadow-sm flex flex-col"
            >
              <div className="flex justify-between">
                <span className="font-semibold">{n.titulo}</span>
                <span className="text-xs text-gray-400">
                  {new Date(n.fecha).toLocaleString()}
                </span>
              </div>
              {n.descripcion && (
                <p className="text-sm text-gray-700 mt-1">{n.descripcion}</p>
              )}
              <span className="text-xs text-gray-500 mt-1">
                Tipo: {n.tipo}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
