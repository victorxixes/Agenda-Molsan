import React, { useState, useMemo } from "react";
import { useDashboardStore } from "../../store/dashboardStore";

const iconoTipoCita = (tipo) => {
  switch (tipo) {
    case "Firma notarial": return "🖋";
    case "Reunión": return "👥";
    case "Visita": return "👣";
    default: return "📄";
  }
};

const iconoTipoFirma = (vc) => {
  switch (vc) {
    case "SI": return "🎥 Videoconferencia";
    case "NO": return "📍 Presencial";
    default: return "—";
  }
};

export default function CitasHoyList() {
  const { resumen } = useDashboardStore();
  const citasHoy = resumen?.citas_dia || [];

  const [sortBy, setSortBy] = useState("fecha");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filtro, setFiltro] = useState("");

  const ordenar = (campo) => {
    if (sortBy === campo) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(campo);
      setSortDirection("asc");
    }
  };

  const citasProcesadas = useMemo(() => {
    let lista = [...citasHoy];

    if (filtro.trim() !== "") {
      const f = filtro.toLowerCase();

      lista = lista.filter((cita) => {
        const apoderado =
          cita.apoderado_s ||
          (cita.apoderado
            ? `${cita.apoderado.nombre} ${cita.apoderado.apellidos}`
            : "") ||
          cita.apoderado_id ||
          "";

        const notario =
          cita.notario
            ? `${cita.notario.nombre} ${cita.notario.apellidos}`
            : cita.notario_id || "";

        return (
          cita.fecha.toLowerCase().includes(f) ||
          apoderado.toLowerCase().includes(f) ||
          notario.toLowerCase().includes(f) ||
          cita.tipo_cita.toLowerCase().includes(f)
        );
      });
    }

    lista.sort((a, b) => {
      const A = a[sortBy] || "";
      const B = b[sortBy] || "";

      if (A < B) return sortDirection === "asc" ? -1 : 1;
      if (A > B) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return lista;
  }, [citasHoy, filtro, sortBy, sortDirection]);

  const iconoOrden = (campo) => {
    if (sortBy !== campo) return "↕️";
    return sortDirection === "asc" ? "⬆️" : "⬇️";
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-xl font-bold mb-4" style={{ color: "#1F3A5F" }}>
        Citas del día
      </h3>

      <input
        type="text"
        className="input mb-3 w-full"
        placeholder="Filtrar por apoderado, notario, tipo o fecha..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border cursor-pointer" onClick={() => ordenar("fecha")}>
              Fecha {iconoOrden("fecha")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("hora_inicio")}>
              Hora {iconoOrden("hora_inicio")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("tipo_cita")}>
              Tipo de cita {iconoOrden("tipo_cita")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("notario_id")}>
              Notario {iconoOrden("notario_id")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("apoderado_s")}>
              Apoderado {iconoOrden("apoderado_s")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("vc")}>
              Tipo firma {iconoOrden("vc")}
            </th>
          </tr>
        </thead>

        <tbody>
          {citasProcesadas.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No hay citas hoy
              </td>
            </tr>
          ) : (
            citasProcesadas.map((cita) => {
              const apoderado =
                cita.apoderado_s ||
                (cita.apoderado
                  ? `${cita.apoderado.nombre} ${cita.apoderado.apellidos}`
                  : null) ||
                cita.apoderado_id ||
                "—";

              const notario =
                cita.notario
                  ? `${cita.notario.nombre} ${cita.notario.apellidos}`
                  : cita.notario_id || "—";

              return (
                <tr key={cita.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{cita.fecha}</td>

                  <td className="p-2 border">
                    {cita.hora_inicio} - {cita.hora_fin}
                  </td>

                  <td className="p-2 border">
                    {iconoTipoCita(cita.tipo_cita)} {cita.tipo_cita}
                  </td>

                  <td className="p-2 border">{notario}</td>

                  <td className="p-2 border">{apoderado}</td>

                  <td className="p-2 border">
                    {iconoTipoFirma(cita.vc)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
