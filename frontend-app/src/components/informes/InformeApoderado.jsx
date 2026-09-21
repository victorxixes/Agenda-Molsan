import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../api/config";

export default function InformeApoderado({ apoderadoId }) {
  const [data, setData] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [periodo, setPeriodo] = useState("mensual");

  useEffect(() => {
    const hoy = new Date();
    const desde =
      periodo === "mensual"
        ? new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        : new Date(hoy.getFullYear(), 0, 1);

    const hasta = hoy;

    const cargar = async () => {
      const res = await axios.get(
        `${API_BASE}/informes/apoderados/${apoderadoId}`,
        { params: { desde, hasta } }
      );

      const rank = await axios.get(
        `${API_BASE}/informes/apoderados/ranking`,
        { params: { desde, hasta } }
      );

      setData(res.data);
      setRanking(rank.data);
    };

    cargar();
  }, [apoderadoId, periodo]);

  if (!data) return <div className="text-white">Cargando informe…</div>;

  return (
    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20 text-white space-y-6">
      <h2 className="text-xl font-semibold">Informe del apoderado</h2>

      <select
        className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        value={periodo}
        onChange={(e) => setPeriodo(e.target.value)}
      >
        <option value="mensual">Mensual</option>
        <option value="anual">Anual</option>
      </select>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-white/5 p-4 rounded-xl">
          <h4 className="text-white/70 text-sm">Citas Presenciales</h4>
          <div className="text-3xl font-bold">{data.total_presencial}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl">
          <h4 className="text-white/70 text-sm">Citas VC</h4>
          <div className="text-3xl font-bold">{data.total_vc}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl">
          <h4 className="text-white/70 text-sm">Km recorridos</h4>
          <div className="text-3xl font-bold">{data.km_totales}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-xl">
          <h4 className="text-white/70 text-sm">Tiempo medio</h4>
          <div className="text-3xl font-bold">
            {data.tiempo_medio_dias.toFixed(1)} días
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6">Ranking apoderados</h3>

      <ul className="space-y-2">
        {ranking.map((r, i) => (
          <li key={r.apoderado_id} className="bg-white/5 p-3 rounded-xl flex justify-between">
            <span># {i + 1} — Apoderado {r.apoderado_id}</span>
            <span>
              {r.total_citas} citas — {r.km} km
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
