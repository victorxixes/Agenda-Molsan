import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function FichaExpediente() {
  const { id } = useParams();
  const [expediente, setExpediente] = useState(null);
  const [detalle, setDetalle] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarExpediente();
  }, []);

  const cargarExpediente = async () => {
    try {
      const exp = await axios.get(`/api/expedientes/${id}`);
      const det = await axios.get(`/api/expedientes/${id}/detalle`);

      setExpediente(exp.data);
      setDetalle(det.data);
    } catch (err) {
      console.error("Error cargando expediente:", err);
    }

    setLoading(false);
  };

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
            {detalle.map((item) => (
              <li key={item.id}>
                <span className="font-semibold">{item.campo}: </span>
                <span>{item.valor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* PANEL DERECHO — Actividad */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">

          <h2 className="text-xl font-semibold text-white mb-4">Actividad del expediente</h2>

          <div className="grid grid-cols-2 gap-4 text-white/80">

            <Dato campo="Estado expediente" valor={expediente.estado_expediente} />
            <Dato campo="Fecha alta" valor={expediente.fecha_alta} />
            <Dato campo="Actividad actual" valor={expediente.actividad_actual} />
            <Dato campo="Estado actividad" valor={expediente.estado_actividad} />
            <Dato campo="Inicio actividad" valor={expediente.fecha_inicio_actividad} />
            <Dato campo="Fin actividad" valor={expediente.fecha_fin_actividad} />

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
      <p className="text-white font-semibold">{valor || "—"}</p>
    </div>
  );
}
