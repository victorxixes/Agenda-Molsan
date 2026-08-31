import React, { useState, useMemo } from "react";
import { useAgendaStore } from "../../store/agendaStore";

export default function CitasHoyList() {
  const { resumen } = useAgendaStore();
  const citasHoy = resumen?.citas_dia || [];

  // 🔥 Estado para ordenación
  const [sortBy, setSortBy] = useState("fecha");
  const [sortDirection, setSortDirection] = useState("asc");

  // 🔥 Estado para filtro en tiempo real
  const [filtro, setFiltro] = useState("");

  // 🔥 Función de ordenación
  const ordenar = (campo) => {
    if (sortBy === campo) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(campo);
      setSortDirection("asc");
    }
  };

  // 🔥 Datos procesados (filtro + ordenación)
  const citasProcesadas = useMemo(() => {
    let lista = [...citasHoy];

    // Filtro en tiempo real
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
          notario.toLowerCase().includes(f)
        );
      });
    }

    // Ordenación
    lista.sort((a, b) => {
      const A = a[sortBy] || "";
      const B = b[sortBy] || "";

      if (A < B) return sortDirection === "asc" ? -1 : 1;
      if (A > B) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return lista;
  }, [citasHoy, filtro, sortBy, sortDirection]);

  // 🔥 Icono de ordenación
  const iconoOrden = (campo) => {
    if (sortBy !== campo) return "↕️";
    return sortDirection === "asc" ? "⬆️" : "⬇️";
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-xl font-bold mb-4" style={{ color: "#1F3A5F" }}>
        Citas del día
      </h3>

      {/* 🔥 Filtro en tiempo real */}
      <input
        type="text"
        className="input mb-3 w-full"
        placeholder="Filtrar por apoderado, notario o fecha..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border cursor-pointer" onClick={() => ordenar("fecha")}>
              Día de firma {iconoOrden("fecha")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("apoderado_s")}>
              Apoderado {iconoOrden("apoderado_s")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("notario_id")}>
              Notario {iconoOrden("notario_id")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("hora_inicio")}>
              Hora inicio {iconoOrden("hora_inicio")}
            </th>

            <th className="p-2 border cursor-pointer" onClick={() => ordenar("hora_fin")}>
              Hora fin {iconoOrden("hora_fin")}
            </th>

            <th className="p-2 border">Acciones</th>
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
                  <td className="p-2 border">{apoderado}</td>
                  <td className="p-2 border">{notario}</td>
                  <td className="p-2 border">{cita.hora_inicio}</td>
                  <td className="p-2 border">{cita.hora_fin}</td>

                  <td className="p-2 border">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        useAgendaStore.getState().setCitaActual(cita);
                      }}
                    >
                      Editar
                    </button>
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
