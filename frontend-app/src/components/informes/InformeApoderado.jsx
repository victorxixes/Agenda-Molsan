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
      try {
        const res = await axios.get(
          `${API_BASE}/informes/apoderados/${apoderadoId}`,
          {
            params: { desde, hasta },
          }
        );

        const rank = await axios.get(
          `${API_BASE}/informes/apoderados/ranking`,
          {
            params: { desde, hasta },
          }
        );

        setData({
          ...res.data,
          km_totales:
            res.data.km_totales ??
            res.data.distancia_km ??
            0,
        });

        setRanking(
          (rank.data || []).map((r) => ({
            ...r,
            km: r.km ?? r.distancia_km ?? 0,
          }))
        );
      } catch (error) {
        console.error("Error cargando informe:", error);
      }
    };

    cargar();
  }, [apoderadoId, periodo]);

  if (!data) {
    return (
      <div
        className="
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          p-8
          text-white
          flex items-center justify-center
        "
      >
        <div className="text-white/60 animate-pulse">
          Cargando informe…
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white/10
        backdrop-blur-2xl
        border border-white/20
        rounded-3xl
        p-6
        text-white
        shadow-2xl
        space-y-6
      "
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>

            <h2 className="text-2xl font-bold">
              Informe del apoderado
            </h2>
          </div>

          <p className="text-sm text-white/50 mt-1">
            Resumen de actividad y rendimiento.
          </p>
        </div>

        <select
          className="
            bg-white/10
            border border-white/20
            rounded-xl
            px-4 py-2.5
            text-white
            outline-none
            focus:ring-2
            focus:ring-blue-400/30
          "
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
        >
          <option value="mensual" className="text-black">
            Mensual
          </option>

          <option value="anual" className="text-black">
            Anual
          </option>
        </select>

      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <Kpi
          icon="🤝"
          titulo="Citas presenciales"
          valor={data.total_presencial ?? 0}
        />

        <Kpi
          icon="💻"
          titulo="Citas VC"
          valor={data.total_vc ?? 0}
        />

        <Kpi
          icon="🚗"
          titulo="Km recorridos"
          valor={`${(data.km_totales || 0).toFixed(1)} km`}
        />

        <Kpi
          icon="⏱️"
          titulo="Tiempo medio"
          valor={`${(data.tiempo_medio_dias || 0).toFixed(1)} días`}
        />

      </div>

      {/* RANKING */}
      <div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🏆</span>

          <div>
            <h3 className="text-lg font-bold">
              Ranking de apoderados
            </h3>

            <p className="text-xs text-white/40">
              Actividad acumulada durante el periodo seleccionado.
            </p>
          </div>
        </div>

        <div className="space-y-2">

          {ranking.length === 0 ? (
            <div className="text-sm text-white/40 py-6 text-center">
              No hay datos de ranking.
            </div>
          ) : (
            ranking.map((r, i) => (
              <div
                key={r.apoderado_id}
                className="
                  flex items-center gap-4
                  bg-white/5
                  hover:bg-white/10
                  border border-white/10
                  rounded-xl
                  p-3
                  transition
                "
              >

                <div
                  className={`
                    w-9 h-9
                    rounded-xl
                    flex items-center justify-center
                    font-bold
                    ${
                      i === 0
                        ? "bg-yellow-400/20 text-yellow-300"
                        : i === 1
                        ? "bg-slate-300/20 text-slate-200"
                        : i === 2
                        ? "bg-orange-400/20 text-orange-300"
                        : "bg-white/10 text-white/60"
                    }
                  `}
                >
                  {i + 1}
                </div>

                <div className="flex-1">
                  <div className="font-semibold">
                    Apoderado {r.apoderado_id}
                  </div>

                  <div className="text-xs text-white/40">
                    {r.total_citas ?? 0} citas
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {(r.km || 0).toFixed(1)} km
                  </div>

                  <div className="text-xs text-white/40">
                    distancia
                  </div>
                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, titulo, valor }) {
  return (
    <div
      className="
        bg-white/5
        border border-white/10
        rounded-2xl
        p-5
        hover:bg-white/10
        transition
      "
    >
      <div className="flex items-center justify-between">

        <span className="text-2xl">
          {icon}
        </span>

        <span className="text-xs text-white/40">
          KPI
        </span>

      </div>

      <div className="text-3xl font-bold mt-4">
        {valor}
      </div>

      <div className="text-xs text-white/50 mt-1">
        {titulo}
      </div>
    </div>
  );
}
