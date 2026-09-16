import { useEffect, useState, useMemo, useCallback } from "react";
import { listarNotarias } from "../../api/ctn";

/**
 * AutocompleteNotario — SJ‑2026 Premium
 * - Búsqueda con debounce
 * - Dropdown glass‑UI
 * - Selección de notario con normalización
 * - Sin re‑renders innecesarios
 */

export default function AutocompleteNotario({ value, onSelect }) {
  const [notarios, setNotarios] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  /**
   * Debounce de 250ms para evitar spam de llamadas
   */
  const debouncedQuery = useMemo(() => query, [query]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setNotarios([]);
      return;
    }

    const timer = setTimeout(() => {
      listarNotarias({ q: debouncedQuery }).then((res) => {
        const lista = Array.isArray(res.data?.items) ? res.data.items : [];
        setNotarios(lista);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  /**
   * Normalización del notario seleccionado
   */
  const seleccionar = useCallback(
    (n) => {
      setQuery(`${n.nombre} ${n.apellidos}`);
      setOpen(false);

      const notarioCompleto = {
        id: n.id,
        codigo: n.codigo || "",
        nombre: n.nombre || "",
        apellidos: n.apellidos || "",
        nif: n.nif || "",
        telefono: n.telefono || "",
        provincia: n.provincia || "",
        municipio: n.municipio || "",
        cp: n.cp || "",
        direccion: n.direccion || "",
        vc: n.vc || "",
        apoderado: n.apoderado_s || n.apoderado || "",
        observacion: n.observacion || "",
        tipo_firma: n.vc === "SI" ? "Videoconferencia" : "Presencial",
      };

      onSelect(notarioCompleto);
    },
    [onSelect]
  );

  return (
    <div className="relative w-full">
      {/* INPUT PREMIUM */}
      <input
        type="text"
        className="
          w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white
          placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400
        "
        placeholder="Buscar notario…"
        value={value ? `${value.nombre} ${value.apellidos}` : query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />

      {/* DROPDOWN PREMIUM */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl
            border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-auto z-20
          "
        >
          {notarios.length === 0 ? (
            <div className="px-4 py-3 text-sm text-white/70">
              No hay resultados
            </div>
          ) : (
            notarios.map((n) => (
              <div
                key={n.id}
                onClick={() => seleccionar(n)}
                className="
                  px-4 py-3 cursor-pointer text-sm text-white
                  hover:bg-white/20 transition-all rounded-lg
                "
              >
                <div className="font-semibold">
                  {n.nombre} {n.apellidos}
                </div>
                <div className="text-white/70 text-xs">
                  {n.municipio} — {n.provincia}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
