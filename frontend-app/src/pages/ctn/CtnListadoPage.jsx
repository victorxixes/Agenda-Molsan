import { useEffect, useState } from "react";
import { useCtn } from "../../hooks/useCtn";
import ModalCtnDetalle from "../../components/ctn/ModalCtnDetalle";

export default function CtnListadoPage() {
  const { items, total, page, page_size, cargarNotarias, loading } = useCtn();

  const [filtros, setFiltros] = useState({
    provincia: "",
    municipio: "",
    vc: "",
    apoderado: "",
    q: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarNotarias();
  }, []);

  const aplicarFiltros = () => cargarNotarias(filtros);

  const abrirDetalle = (notaria) => {
    setSelected(notaria);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-5 gap-4">
        <input
          className="border p-2"
          placeholder="Provincia"
          value={filtros.provincia}
          onChange={(e) => setFiltros({ ...filtros, provincia: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Municipio"
          value={filtros.municipio}
          onChange={(e) => setFiltros({ ...filtros, municipio: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="VC"
          value={filtros.vc}
          onChange={(e) => setFiltros({ ...filtros, vc: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Apoderado"
          value={filtros.apoderado}
          onChange={(e) => setFiltros({ ...filtros, apoderado: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Buscar nombre, apellidos, código, NIF…"
          value={filtros.q}
          onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={aplicarFiltros}
      >
        Aplicar filtros
      </button>

      {/* Tabla */}
      {loading ? (
        <p>Cargando notarías…</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Código</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Provincia</th>
              <th>Municipio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id} className="border-b">
                <td>{n.codigo}</td>
                <td>{n.nombre}</td>
                <td>{n.apellidos}</td>
                <td>{n.provincia}</td>
                <td>{n.municipio}</td>
                <td>
                  <button
                    onClick={() => abrirDetalle(n)}
                    className="text-blue-600 underline"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      <p className="text-sm text-gray-600">
        Página {page} — {items.length} de {total}
      </p>

      {/* MODAL */}
      <ModalCtnDetalle
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notaria={selected}
      />
    </div>
  );
}
