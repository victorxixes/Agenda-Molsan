import React, { useEffect, useState } from "react";
import { useCTNStore } from "../../store/ctnStore";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconIntranet from "../../components/icons/IconIntranet.jsx";
import Modal from "../../components/ui/Modal.jsx";

export default function CTNList() {
  const { notarias, cargarNotarias } = useCTNStore();

  // ESTADOS
  const [pagina, setPagina] = useState(1);
  const porPagina = 20;

  const [busqueda, setBusqueda] = useState("");
  const [filtroProvincia, setFiltroProvincia] = useState("");
  const [ordenColumna, setOrdenColumna] = useState(null);
  const [ordenDireccion, setOrdenDireccion] = useState("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [notariaSeleccionada, setNotariaSeleccionada] = useState(null);

  useEffect(() => {
    cargarNotarias();
  }, []);

  // LIMPIAR "nan"
  const limpiar = (v) => (v === "nan" || v === null ? "" : v);

  // ⭐ FILTRADO + BUSQUEDA MEJORADO
  const filtradas = notarias.filter((n) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      n.nombre?.toLowerCase().includes(texto) ||
      n.apellidos?.toLowerCase().includes(texto) ||        // ⭐ NUEVO
      n.municipio?.toLowerCase().includes(texto) ||
      n.provincia?.toLowerCase().includes(texto) ||
      n.codigo?.toLowerCase().includes(texto) ||           // ⭐ NUEVO
      n.nif?.toLowerCase().includes(texto) ||              // ⭐ NUEVO
      n.apoderado?.toLowerCase().includes(texto) ||        // ⭐ NUEVO
      n.apoderado_s?.toLowerCase().includes(texto);        // ⭐ NUEVO

    const coincideProvincia =
      filtroProvincia === "" || n.provincia === filtroProvincia;

    return coincideBusqueda && coincideProvincia;
  });

  // ORDENACIÓN
  const ordenar = (col) => {
    if (ordenColumna === col) {
      setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc");
    } else {
      setOrdenColumna(col);
      setOrdenDireccion("asc");
    }
  };

  const ordenadas = [...filtradas].sort((a, b) => {
    if (!ordenColumna) return 0;

    const valA = limpiar(a[ordenColumna]) || "";
    const valB = limpiar(b[ordenColumna]) || "";

    if (ordenDireccion === "asc") {
      return valA.localeCompare(valB);
    } else {
      return valB.localeCompare(valA);
    }
  });

  // PAGINACIÓN
  const totalPaginas = Math.ceil(ordenadas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  const notariasPagina = ordenadas.slice(inicio, fin);

  const abrirModal = (notaria) => {
    setNotariaSeleccionada(notaria);
    setModalOpen(true);
  };

  // PROVINCIAS ÚNICAS
  const provinciasUnicas = [...new Set(notarias.map((n) => n.provincia))];

  return (
    <div className="p-4 space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-3" style={{ color: "#1F3A5F" }}>
          <IconIntranet size={30} />
          CTN — Notarías
        </h2>
      </div>

      <GlassSectionTitle icon={<IconIntranet size={26} />} title="Listado de notarías" />

      {/* BUSCADOR + FILTRO */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Buscar por nombre, apellidos, municipio, provincia, código, NIF o apoderado..."
          className="px-3 py-2 border rounded-lg w-full md:w-1/3"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(1);
          }}
        />

        <select
          className="px-3 py-2 border rounded-lg"
          value={filtroProvincia}
          onChange={(e) => {
            setFiltroProvincia(e.target.value);
            setPagina(1);
          }}
        >
          <option value="">Todas las provincias</option>
          {provinciasUnicas.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* TABLA COMPLETA */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                ["codigo", "Código"],
                ["nombre", "Nombre"],
                ["apellidos", "Apellidos"],
                ["nif", "NIF"],
                ["telefono", "Teléfono"],
                ["departamento_cancelaciones", "Dept. Cancelaciones"],
                ["departamento_copias", "Dept. Copias"],
                ["otros_departamentos", "Otros Departamentos"],
                ["cp", "CP"],
                ["provincia", "Provincia"],
                ["municipio", "Municipio"],
                ["vc", "VC"],
                ["apoderado", "Apoderado"],
                ["apoderado_s", "Apoderado S"],
                ["observacion", "Observación"],
              ].map(([col, label]) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left cursor-pointer select-none"
                  onClick={() => ordenar(col)}
                >
                  {label}
                  {ordenColumna === col && (
                    <span className="ml-1 text-blue-600">
                      {ordenDireccion === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {notariasPagina.map((n) => (
              <tr key={n.id} className="border-t hover:bg-gray-50 cursor-pointer">

                <td
                  className="px-4 py-3 font-semibold text-blue-600 underline"
                  onClick={() => abrirModal(n)}
                >
                  {limpiar(n.codigo)}
                </td>

                <td className="px-4 py-3">{limpiar(n.nombre)}</td>
                <td className="px-4 py-3">{limpiar(n.apellidos)}</td>
                <td className="px-4 py-3">{limpiar(n.nif)}</td>
                <td className="px-4 py-3">{limpiar(n.telefono)}</td>

                <td className="px-4 py-3">{limpiar(n.departamento_cancelaciones)}</td>
                <td className="px-4 py-3">{limpiar(n.departamento_copias)}</td>
                <td className="px-4 py-3">{limpiar(n.otros_departamentos)}</td>

                <td className="px-4 py-3">{limpiar(n.cp)}</td>
                <td className="px-4 py-3">{limpiar(n.provincia)}</td>
                <td className="px-4 py-3">{limpiar(n.municipio)}</td>

                <td className="px-4 py-3">
                  {n.vc === "N.I." ? "Videoconferencia" : limpiar(n.vc)}
                </td>

                <td className="px-4 py-3">{limpiar(n.apoderado)}</td>
                <td className="px-4 py-3">{limpiar(n.apoderado_s)}</td>
                <td className="px-4 py-3">{limpiar(n.observacion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button className="btn-sj px-3 py-1" disabled={pagina === 1} onClick={() => setPagina(1)}>
          « Primera
        </button>

        <button className="btn-sj px-3 py-1" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
          ‹ Anterior
        </button>

        <span className="px-3 py-1 text-sm font-semibold">
          Página {pagina} de {totalPaginas}
        </span>

        <button className="btn-sj px-3 py-1" disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>
          Siguiente ›
        </button>

        <button className="btn-sj px-3 py-1" disabled={pagina === totalPaginas} onClick={() => setPagina(totalPaginas)}>
          Última »
        </button>
      </div>

      {/* MODAL */}
      {modalOpen && notariaSeleccionada && (
        <Modal onClose={() => setModalOpen(false)} title="Ficha Notaría">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              {limpiar(notariaSeleccionada.nombre)} {limpiar(notariaSeleccionada.apellidos)}
            </h2>

            {/* MAPA */}
            <div className="rounded-lg overflow-hidden border">
              <iframe
                title="Mapa notaría"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${notariaSeleccionada.nombre} ${notariaSeleccionada.municipio} ${notariaSeleccionada.cp} ${notariaSeleccionada.provincia}`
                )}&output=embed`}
                width="100%"
                height="250"
                loading="lazy"
              />
            </div>

            {/* RESUMEN DE CITAS */}
            <div className="bg-neutral-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumen de Citas</h3>

              <p><strong>Tipo:</strong> {notariaSeleccionada.vc === "N.I." ? "Videoconferencia" : "Presencial"}</p>
              <p><strong>Teléfono:</strong> {limpiar(notariaSeleccionada.telefono) || "—"}</p>
              <p><strong>CP:</strong> {limpiar(notariaSeleccionada.cp) || "—"}</p>

              <p><strong>Dept. Cancelaciones:</strong> {limpiar(notariaSeleccionada.departamento_cancelaciones) || "—"}</p>
              <p><strong>Dept. Copias:</strong> {limpiar(notariaSeleccionada.departamento_copias) || "—"}</p>
              <p><strong>Otros Departamentos:</strong> {limpiar(notariaSeleccionada.otros_departamentos) || "—"}</p>

              <p><strong>Apoderado:</strong> {limpiar(notariaSeleccionada.apoderado) || "—"}</p>
              <p><strong>Apoderado S:</strong> {limpiar(notariaSeleccionada.apoderado_s) || "—"}</p>
              <p><strong>Observación:</strong> {limpiar(notariaSeleccionada.observacion) || "—"}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
