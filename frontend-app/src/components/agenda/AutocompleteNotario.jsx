import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";

export default function AutocompleteNotario({ value, onSelect }) {
  const [busqueda, setBusqueda] = useState(value || "");
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
          params: { page_size: 5000 }, // traer todos
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
    onSelect(n);
  };

  // Cerrar si clic fuera
  useEffect(() => {
    const cerrar = (e) => {
      if (ref.current && !ref.current
