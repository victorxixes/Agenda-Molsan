import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAgendaStore } from "../../store/agendaStore";
import GlassCard from "../../components/ui/GlassCard.jsx";
import AgendaSection from "../../components/agenda/AgendaSection.jsx";

export default function AgendaCitaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { obtenerCita, eliminar, cambiarEstado } = useAgendaStore();

  const [cita, setCita] = useState(null);

  useEffect(() => {
    obtenerCita(id).then((res) => setCita(res));
  }, [id]);

  if (!cita) {
    return <p className="text-gray-600">Cargando cita...</p>;
  }

  const borrar = async () => {
    if (!confirm("¿Eliminar esta cita?")) return;
    await eliminar(id);
    navigate("/agenda");
  };

  const cambiar = async (nuevo) => {
    await cambiarEstado(id, nuevo);
    const res = await obtenerCita(id);
    setCita(res);
  };

  return (
    <AgendaSection title="Detalle de la cita">
      <GlassCard className="space-y-4">

        <div>
          <h3 className="text-xl font-bold">{cita.tipo_cita}</h3>
          <p className="text-gray-600">{cita.fecha} — {cita.hora_inicio} a {cita.hora_fin}</p>
        </div>

        <div className="border-t pt-3">
          <h4 className="font-semibold">Notaría</h4>
          {cita.notario ? (
            <div className="text-gray-700">
              <p>{cita.notario.nombre} {cita.notario.apellidos}</p>
              <p>{cita.notario.municipio} ({cita.notario.provincia})</p>
              <p>Código: {cita.notario.codigo}</p>
              <p>NIF: {cita.notario.nif}</p>
            </div>
          ) : (
            <p className="text-gray-500">Sin notario asignado</p>
          )}
        </div>

        <div className="border-t pt-3">
          <h4 className="font-semibold">Apoderado</h4>
          {cita.apoderado ? (
            <p className="text-gray-700">
              {cita.apoderado.nombre} {cita.apoderado.apellidos}
            </p>
          ) : (
            <p className="text-gray-500">Sin apoderado asignado</p>
          )}
        </div>

        <div className="border-t pt-3">
          <h4 className="font-semibold">Estado</h4>
          <p className="text-gray-700">{cita.estado}</p>

          <div className="flex gap-2 mt-2">
            <button
              className="btn-secondary"
              onClick={() => cambiar("Confirmada")}
            >
              Confirmar
            </button>

            <button
              className="btn-secondary"
              onClick={() => cambiar("Cancelada")}
            >
              Cancelar
            </button>

            <button
              className="btn-secondary"
              onClick={() => cambiar("Finalizada")}
            >
              Finalizar
            </button>
          </div>
        </div>

        <div className="border-t pt-3">
          <h4 className="font-semibold">Observaciones</h4>
          <p className="text-gray-700">{cita.observaciones || "Sin observaciones"}</p>
        </div>

        <button className="btn-danger w-full mt-4" onClick={borrar}>
          Eliminar cita
        </button>

      </GlassCard>
    </AgendaSection>
  );
}
