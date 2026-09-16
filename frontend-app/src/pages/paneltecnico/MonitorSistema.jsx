import { useEffect, useState, useCallback, useMemo } from "react";
import MonitorRealtime from "./MonitorRealtime";
import {
  listarTablas,
  describirTabla,
  obtenerContenidoTabla,
} from "../../api/monitorRealtime";

/**
 * MonitorSistema — SJ‑2026 Premium
 * - Diagnóstico BD
 * - WebSocket realtime
 * - Glass‑UI
 * - Render optimizado
 */

export default function MonitorSistema({ baseUrl }) {
  const [tablas, setTablas] = useState([]);
  const [tablaSeleccionada, setTablaSeleccionada] = useState(null);
  const [columnas, setColumnas] = useState([]);
  const [contenido, setContenido] = useState([]);

  // Cargar listado de tablas
  useEffect(() => {
    listarTablas().then((res) => {
      setTablas(res.data?.tablas || []);
    });
  }, []);

  // Cargar columnas + contenido
  const cargarTabla = useCallback(async (tabla) => {
    setTablaSeleccionada(tabla);

    const cols = await describirTabla(tabla);
    const cont = await obtenerContenidoTabla(tabla);

    setColumnas(cols.data?.columnas || []);
    setContenido(cont.data?.filas || []);
  }, []);

  const columnasMemo = useMemo(() => columnas, [columnas]);
  const contenidoMemo = useMemo(() => contenido, [contenido]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      <h1 className="text-2xl font-bold text-white drop-shadow">
        Monitor del Sistema
      </h1>

      {/* MONITOR REALTIME */}
      <MonitorRealtime baseUrl={baseUrl} />

      {/* DIAGNÓSTICO BD */}
      <section
        className="
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
          p-6 shadow-xl
        "
      >
        <h2 className="text-xl font-semibold mb-4 text-white drop-shadow">
          Diagnóstico BD
        </h2>

        <div className="flex gap-6">

          {/* LISTA DE TABLAS */}
          <div className="w-1/3">
            <h3 className="font-semibold mb-3 text-white/80">Tablas</h3>

            <ul className="space-y-1">
              {tablas.map((t) => (
                <li
                  key={t}
                  className="
                    cursor-pointer bg-white/5 border border-white/10 rounded-xl
                    p-2 hover:bg-white/10 transition text-white
                  "
                  onClick={() => cargarTabla(t)}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* DETALLE DE TABLA */}
          <div className="w-2/3">
            {tablaSeleccionada && (
              <>
                {/* COLUMNAS */}
                <h3 className="font-semibold mb-2 text-white/80">
                  {tablaSeleccionada} — Columnas
                </h3>

                <table
                  className="
                    w-full text-sm text-white mb-4
                    bg-white/5 border border-white/10 rounded-xl
                  "
                >
                  <thead>
                    <tr className="bg-white/10 border-b border-white/10">
                      <th className="py-2 px-2">Columna</th>
                      <th className="py-2 px-2">Tipo</th>
                    </tr>
                  </thead>

                  <tbody>
                    {columnasMemo.map((c, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/10 hover:bg-white/10 transition"
                      >
                        <td className="py-2 px-2">{c.columna}</td>
                        <td className="py-2 px-2">{c.tipo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* CONTENIDO */}
                <h3 className="font-semibold mb-2 text-white/80">
                  Contenido
                </h3>

                <div className="overflow-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  <table
                    className="
                      w-full text-sm text-white
                      bg-white/5 border border-white/10 rounded-xl
                    "
                  >
                    <thead>
                      <tr className="bg-white/10 border-b border-white/10">
                        {columnasMemo.map((c, i) => (
                          <th key={i} className="py-2 px-2">
                            {c.columna}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {contenidoMemo.map((fila, i) => (
                        <tr
                          key={i}
                          className="border-b border-white/10 hover:bg-white/10 transition"
                        >
                          {columnasMemo.map((c, j) => (
                            <td key={j} className="py-2 px-2">
                              {fila[c.columna]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
