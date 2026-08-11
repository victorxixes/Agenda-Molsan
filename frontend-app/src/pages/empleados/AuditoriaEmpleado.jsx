import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditoriaEmpleado({ empleadoId }) {
  const [eventos, setEventos] = useState([]);
  const API = "https://agenda-intranet-backend.onrender.com";

  useEffect(() => {
    axios
      .get(`${API}/auditoria/empleados/${empleadoId}`)
      .then((res) => setEventos(res.data || []))
      .catch(() => setEventos([]));
  }, [empleadoId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Auditoría del empleado</h2>

      {eventos.length === 0 && (
        <p className="text-gray-500">No hay eventos de auditoría.</p>
      )}

      <ul className="space-y-2">
        {eventos.map((ev, idx) => (
          <li
            key={idx}
            className="border rounded p-2 text-sm flex justify-between"
          >
            <span>{ev.descripcion || ev.evento}</span>
            <span className="text-gray-500">
              {ev.fecha || ev.timestamp || ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
