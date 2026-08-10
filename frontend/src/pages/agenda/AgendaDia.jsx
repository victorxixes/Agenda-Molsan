import React, { useEffect, useState } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { Link } from "react-router-dom";
import AgendaCard from "../../components/agenda/AgendaCard.jsx";
import AgendaSection from "../../components/agenda/AgendaSection.jsx";

export default function AgendaDia() {
  const { citas, cargarDia } = useAgendaStore();
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    cargarDia(fecha);
  }, [fecha]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
        Agenda del día
      </h2>

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="border p-2 rounded"
      />

      <Link
        to="/agenda/nueva"
        className="inline-block mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white"
      >
        Nueva cita
      </Link>

      <AgendaSection title="Citas del día">
        {citas.length === 0 && (
          <p className="text-gray-600">No hay citas en esta fecha.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {citas.map((cita) => (
            <AgendaCard key={cita.id} cita={cita} />
          ))}
        </div>
      </AgendaSection>

      <AgendaSection title="Vista en tabla">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Tipo</th>
              <th>Apoderado</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {citas.map((c) => (
              <tr key={c.id}>
                <td>{c.hora_inicio}</td>
                <td>{c.tipo_cita}</td>
                <td>{c.apoderado?.nombre || "-"}</td>
                <td>{c.estado}</td>
                <td>
                  <Link to={`/agenda/cita/${c.id}`}>Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AgendaSection>
    </div>
  );
}
