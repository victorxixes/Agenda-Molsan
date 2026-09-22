import { useEffect, useState, useMemo, useCallback } from "react";
import { listarNotarias } from "../../api/ctn";

/**
 * AutocompleteNotario — SJ‑2026 Premium
 * - Búsqueda por nombre, apellidos, municipio, provincia
 * - Highlight de coincidencias
 * - Avatar iniciales del notario
 * - Apoderado visible
 * - Dirección real visible
 * - VC visible
 * - Km visible (calculado en frontend)
 * - Glass‑UI mejorado
 * - Debounce + memo + callbacks para rendimiento
 */

// =========================================================
// Highlight coincidencias
// =========================================================
function highlight(text, query) {
  if (!text || !query) return text;
  const q = query.trim();
  if (!q) return text;

  const regex = new RegExp(`(${q})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-300/70 text-black font-semibold px-0.5 rounded">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// =========================================================
// Distancia KM (Haversine)
// =========================================================
function distanciaKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// =========================================================
// Coordenadas reales Molsan (Felipe II 293, Barcelona)
// =========================================================
const MOLSAN_LAT = 41.424960;
const MOLSAN_LNG = 2.181740;

export default function AutocompleteNotario({ value, onSelect }) {
  const [notarios, setNotarios] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce simple
  const debouncedQuery = useMemo(() => query, [query]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setNotarios([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      listarNotarias({
        q: debouncedQuery,
        page: 1,
        page_size: 50,
      })
        .then((res) => {
          const lista = Array.isArray(res.data?.items) ? res.data.items : [];
          setNotarios(lista);
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  const seleccionar = useCallback(
    (n) => {
      setQuery(`${n.nombre || ""} ${n.apellidos || ""}`.trim());
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
        apoderado: n.apoderado || n.apoderado_s || "",
        observacion: n.observacion || "",
        tipo_firma:
          (n.vc || "").trim().toUpperCase() === "SI"
            ? "Videoconferencia"
            : "Presencial",

        // km calculados en frontend
        distancia_km:
          distanciaKm(
            MOLSAN_LAT,
            MOLSAN_LNG,
            Number(n.lat),
            Number(n.lng)
          ) || null,
      };

      onSelect(notarioCompleto);
    },
    [onSelect]
  );

  const currentLabel = useMemo(() => {
    if (value && (value.nombre || value.apellidos)) {
      return `${value.nombre || ""} ${value.apellidos || ""}`.trim();
    }
    return query;
  }, [value, query]);

  return (
    <div className="relative w-full">
      {/* INPUT PREMIUM */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-xl px-3 py-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/80 text-white text-xs font-bold shadow-md">
          {currentLabel
            ? currentLabel
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase())
                .join("")
            : "NT"}
        </span>

        <input
          type="text"
          className="
            w-full bg-transparent text-white placeholder-white/40
            focus:outline-none focus:ring-0
          "
          placeholder="Buscar notario por nombre, apellidos, municipio, provincia…"
          value={currentLabel}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 2) setOpen(true);
          }}
        />

        {loading && (
          <div className="animate-spin h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full" />
        )}
      </div>

      {/* DROPDOWN PREMIUM */}
      {open && (
        <div
          className="
            absolute left-0 right-0 mt-2 bg-slate-900/80 backdrop-blur-xl
            border border-white/15 rounded-xl shadow-2xl max-h-72 overflow-auto z-30
          "
        >
          {notarios.length === 0 && !loading ? (
            <div className="px-4 py-3 text-sm text-white/70">
              No hay resultados
            </div>
          ) : (
            notarios.map((n) => {
              const nombreCompleto = `${n.nombre || ""} ${n.apellidos || ""}`.trim();
              const direccionCompleta =
                n.direccion ||
                `${n.municipio || ""}, ${n.provincia || ""}`.trim();

              const vcLabel =
                (n.vc || "").trim().toUpperCase() === "SI"
                  ? "VC"
                  : (n.vc || "").trim() || "Presencial";

              const apoderadoLabel = n.apoderado || n.apoderado_s || "";

              const km = distanciaKm(
                MOLSAN_LAT,
                MOLSAN_LNG,
                Number(n.lat),
                Number(n.lng)
              );

              return (
                <div
                  key={n.id}
                  onClick={() => seleccionar(n)}
                  className="
                    px-4 py-3 cursor-pointer text-sm text-white
                    hover:bg-white/10 transition-all rounded-lg flex gap-3
                  "
                >
                  {/* Avatar */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/80 text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {nombreCompleto
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p) => p[0]?.toUpperCase())
                        .join("")}
                    </div>

                    {km && (
                      <div className="mt-1 text-[11px] text-blue-300/80 font-semibold">
                        🚗 {km.toFixed(1)} km
                      </div>
                    )}
                  </div>

                  {/* Datos principales */}
                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="font-semibold text-sm">
                      {highlight(nombreCompleto, debouncedQuery)}
                    </div>

                    <div className="text-xs text-white/70">
                      {highlight(
                        `${n.municipio || ""} — ${n.provincia || ""}`.trim(),
                        debouncedQuery
                      )}
                    </div>

                    {direccionCompleta && (
                      <div className="text-[11px] text-white/60">
                        {highlight(direccionCompleta, debouncedQuery)}
                      </div>
                    )}

                    {apoderadoLabel && (
                      <div className="text-[11px] text-emerald-300/80">
                        Apoderado: {highlight(apoderadoLabel, debouncedQuery)}
                      </div>
                    )}
                  </div>

                  {/* VC / tipo firma */}
                  <div className="flex flex-col items-end justify-center gap-1">
                    <span
                      className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold
                        ${
                          (n.vc || "").trim().toUpperCase() === "SI"
                            ? "bg-purple-500/80 text-white"
                            : "bg-sky-500/80 text-white"
                        }
                      `}
                    >
                      {vcLabel}
                    </span>

                    {n.codigo && (
                      <span className="text-[10px] text-white/50">
                        Código: {n.codigo}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
