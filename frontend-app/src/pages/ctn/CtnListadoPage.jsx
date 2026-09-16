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
    <div className="space-y-6">

      {/* Filtros Premium */}
      <div className="
        bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl
        grid grid-cols-5 gap-4
      ">
        {Object.keys(filtros).map((key) => (
          <input
            key={key}
            className="
              bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white
              placeholder-white/40 focus:ring-2 focus:ring-blue-400
            "
            placeholder={key === "q"
              ? "Buscar nombre, apellidos, código, NIF…"
              : key.charAt(0).toUpperCase() + key.slice(1)}
            value={filtros[key]}
            onChange={(e) => setFiltros({ ...filtros, [key]: e.target.value })}
          />
        ))}
      </div>

      <button
        className="
          px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
          text-white shadow-lg transition
        "
        onClick={aplicarFiltros}
      >
        Aplicar filtros
      </button>

      {/* Tabla Premium */}
      {loading ? (
        <p className="text-white/70 animate-pulse">Cargando notarías…</p>
      ) : (
        <div className="
          bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl
        ">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="text-white/80 border-b border-white/20">
                <th className="py-2">Código</th>
                <th>Teléfono</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Provincia</th>
                <th>Municipio</th>
                <th>CP</th>
                <th>Dirección</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((n) => (
                <tr
                  key={n.id}
                  className="
                    border-b border-white/10 hover:bg-white/10 transition cursor-pointer
                  "
                >
                  <td className="py-2">{n.codigo}</td>
                  <td>{n.telefono}</td>
                  <td>{n.nombre}</td>
                  <td>{n.apellidos}</td>
                  <td>{n.provincia}</td>
                  <td>{n.municipio}</td>
                  <td>{n.cp}</td>
                  <td>{n.direccion}</td>
                  <td>
                    <button
                      onClick={() => abrirDetalle(n)}
                      className="text-blue-300 hover:text-blue-400 underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-white/60 text-sm mt-3">
            Página {page} — {items.length} de {total}
          </p>
        </div>
      )}

      {/* MODAL PREMIUM */}
      <ModalCtnDetalle
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notaria={selected}
      />
    </div>
  );
}
