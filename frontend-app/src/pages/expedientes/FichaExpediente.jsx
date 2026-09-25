import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FichaExpediente() {
  const { id } = useParams();
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarExpediente = async () => {
    try {
      const res = await axios.get(`/api/expedientes/${id}`);
      setExpediente(res.data);
    } catch (err) {
      console.error("Error cargando expediente:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarExpediente();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-white/70">Cargando expediente…</div>;
  }

  if (!expediente) {
    return <div className="p-6 text-red-400">Expediente no encontrado.</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* Título */}
      <h1 className="text-3xl font-bold text-white drop-shadow">
        Expediente {expediente.id_expediente}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PANEL IZQUIERDO — Datos generales */}
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">

          <h2 className="text-xl font-semibold text-white mb-4">Datos generales</h2>

          <ul className="space-y-2 text-white/80">
            <li><span className="font-semibold">Titular: </span>{expediente.nombre_titular || "—"}</li>
            <li><span className="font-semibold">NIF titular: </span>{expediente.nif_titular || "—"}</li>
            <li><span className="font-semibold">Notario: </span>{expediente.nombre_notario || "—"}</li>
            <li><span className="font-semibold">NIF notario: </span>{expediente.nif_notario || "—"}</li>
            <li><span className="font-semibold">Oficina: </span>{expediente.oficina || "—"}</li>
            <li><span className="font-semibold">Gestoría: </span>{expediente.gestoria || "—"}</li>
            <li><span className="font-semibold">Contrato: </span>{expediente.contrato || "—"}</li>
            <li><span className="font-semibold">Tipo operación: </span>{expediente.tipo_operacion || "—"}</li>
            <li><span className="font-semibold">Subtipo operación: </span>{expediente.subtipo_operacion || "—"}</li>
          </ul>
        </div>

        {/* PANEL DERECHO — Actividad + Fechas + Importes */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Actividad del expediente</h2>

            <div className="grid grid-cols-2 gap-4 text-white/80">
              <Dato campo="Estado expediente" valor={expediente.estado_expediente} />
              <Dato campo="Estado Ancert" valor={expediente.estado_expediente_ancert} />
              <Dato campo="Actividad actual" valor={expediente.actividad_actual} />
              <Dato campo="Estado actividad" valor={expediente.estado_actividad} />
              <Dato campo="Fecha alta" valor={expediente.fecha_alta} />
              <Dato campo="Fecha firma" valor={expediente.fecha_firma} />
              <Dato campo="Fecha inscripción" valor={expediente.fecha_inscripcion} />
              <Dato campo="Fecha entrega cliente" valor={expediente.fecha_entregado_cliente} />
              <Dato campo="Fecha prevista firma" valor={expediente.fecha_prevista_firma} />
              <Dato campo="Fecha vencimiento" valor={expediente.fecha_vencimiento} />
              <Dato campo="Inicio actividad" valor={expediente.fecha_inicio_actividad} />
              <Dato campo="Fin actividad" valor={expediente.fecha_fin_actividad} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Importes y saldos</h2>

            <div className="grid grid-cols-2 gap-4 text-white/80">
              <Dato campo="Capital" valor={expediente.capital} />
              <Dato campo="Importe" valor={expediente.importe} />
              <Dato campo="Saldo real" valor={expediente.saldo_real} />
              <Dato campo="Saldo disponible" valor={expediente.saldo_disponible} />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function Dato({ campo, valor }) {
  return (
    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
      <p className="text-sm text-white/60">{campo}</p>
      <p className="text-white font-semibold">
        {valor !== null && valor !== undefined && valor !== "" ? String(valor) : "—"}
      </p>
    </div>
  );
}
