import MonitorRealtime from "./MonitorRealtime";
import { useEffect, useState } from "react";
import { listarTablas, describirTabla, obtenerContenidoTabla } from "../../api/monitorBd";

export default function MonitorSistema({ baseUrl }) {
  const [tablas, setTablas] = useState([]);
  const [tablaSeleccionada, setTablaSeleccionada] = useState(null);
  const [columnas, setColumnas] = useState([]);
  const [contenido, setContenido] = useState([]);

  useEffect(() => {
    listarTablas().then((res) => setTablas(res.data.tablas));
  }, []);

  const cargarTabla = async (tabla) => {
    setTablaSeleccionada(tabla);

    const cols = await describirTabla(tabla);
    const cont = await obtenerContenidoTabla(tabla);

    setColumnas(cols.data.columnas);
    setContenido(cont.data.filas);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Monitor del Sistema</h1>

      <MonitorRealtime baseUrl={baseUrl} />

      <section className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-2">Diagnóstico BD</h2>

        <div className="flex gap-4">
          <div className="w-1/3">
            <h3 className="font-semibold mb-2">Tablas</h3>
            <ul className="space-y-1">
              {tablas.map((t) => (
                <li
                  key={t}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => cargarTabla(t)}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-2/3">
            {tablaSeleccionada && (
              <>
                <h3 className="font-semibold mb-2">
                  {tablaSeleccionada} — Columnas
                </h3>

                <table className="w-full border mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th>Columna</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnas.map((c, i) => (
                      <tr key={i} className="border-b">
                        <td>{c.columna}</td>
                        <td>{c.tipo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 className="font-semibold mb-2">Contenido</h3>

                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      {columnas.map((c, i) => (
                        <th key={i}>{c.columna}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contenido.map((fila, i) => (
                      <tr key={i} className="border-b">
                        {columnas.map((c, j) => (
                          <td key={j}>{fila[c.columna]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
