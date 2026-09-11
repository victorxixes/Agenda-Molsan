import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";

export default function AutocompleteNotario({ value, onSelect }) {
  const [busqueda, setBusqueda] = useState(value?.nombre || "");
  const [todos, setTodos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [indexActivo, setIndexActivo] = useState(-1);

  const ref = useRef(null);

  // 🔥 Cargar TODOS los notarios una sola vez
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get("/ctn/notarias", {
          params: { page_size: 5000 },
        });

        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setTodos(items);
      } catch (e) {
        console.error("Error cargando notarios:", e);
      }
    };

    cargar();
  }, []);

  // 🔎 Filtrar por nombre + apellidos
  useEffect(() => {
    const q = busqueda.trim().toLowerCase();

    if (q.length === 0) {
      setFiltrados([]);
      return;
    }

    const lista = todos.filter((n) =>
      `${n.nombre} ${n.apellidos}`.toLowerCase().includes(q)
    );

    setFiltrados(lista);
    setAbierto(true);
    setIndexActivo(-1);
  }, [busqueda, todos]);

  // 🎹 Navegación con teclado
  const manejarTeclas = (e) => {
    if (!abierto || filtrados.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndexActivo((i) => (i + 1 < filtrados.length ? i + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndexActivo((i) => (i - 1 >= 0 ? i - 1 : filtrados.length - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (indexActivo >= 0) seleccionar(filtrados[indexActivo]);
    }

    if (e.key === "Escape") {
      setAbierto(false);
    }
  };

  // ✔ Seleccionar notario
  const seleccionar = (n) => {
    setBusqueda(`${n.nombre} ${n.apellidos}`);
    setAbierto(false);

    // 🔥 Mapeo seguro de campos del CTN
    const direccion =
      n.direccion_notaria ||
      n.direccion ||
      n.direccion_completa ||
      "";

    const apoderado =
      n.apoderado ||
      n.apoderado_nombre ||
      n.apoderado_id ||
      "";

    const observaciones =
      n.observaciones ||
      n.obs ||
      n.comentario ||
      "";

    // Enviar al modal con los campos ya preparados
    onSelect({
      ...n,
      direccion,
      apoderado,
      observaciones,
    });
  };

  // Cerrar si clic fuera
  useEffect(() => {
    const cerrar = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false);
      }
    };

    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <input
        className="w-full border rounded px-2 py-1"
        placeholder="Escribe nombre o apellido…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onKeyDown={manejarTeclas}
        onFocus={() => busqueda.length > 0 && setAbierto(true)}
      />

      {abierto && filtrados.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border rounded shadow max-h-48 overflow-y-auto mt-1 z-50">
          {filtrados.map((n, i) => (
            <div
              key={n.id}
              className={`px-3 py-2 cursor-pointer ${
                i === indexActivo ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => seleccionar(n)}
            >
              <strong>{n.nombre} {n.apellidos}</strong>
            </div>
          ))}
        </div>
      )}

      {/* 🗺️ Mapa de la notaría */}
      {value?.direccion && (
        <iframe
          className="w-full h-40 mt-3 rounded"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            value.direccion
          )}&output=embed`}
        ></iframe>
      )}
    </div>
  );
}
