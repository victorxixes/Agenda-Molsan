import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditoriaEmpleado({ empleadoId }) {
  const [eventos, setEventos] = useState([]);
  const API = "https://agenda-intranet-backend.onrender.com";

  useEffect(() => {
    axios
      .get(`${API}/logs/usuario/${empleadoId}`)
      .then((res) => setEventos(res.data || []))
      .catch(() => setEventos([]));
  }, [empleadoId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Historial de actividad</h2>

      {eventos.length === 0 && (
        <p className="text-gray-500">No hay registros de actividad.</p>
      )}

      <ul className="space-y-3">
        {eventos.map((ev, idx) => (
          <li
            key={idx}
            className="border rounded p-3 bg-gray-50 flex justify-between"
          >
            <div>
              <p className="font-semibold">{ev.modulo}</p>
              <p className="text-sm">{ev.descripcion}</p>
              <p className="text-xs text-gray-600">{ev.datos}</p>
            </div>
            <span className="text-gray-500 text-sm">{ev.fecha}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
