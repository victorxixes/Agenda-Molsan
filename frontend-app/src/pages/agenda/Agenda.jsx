import { useState, useEffect, useCallback, useMemo } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useAuthStore } from "../../store/authStore";

import VistaMes from "./VistaMes";
import VistaSemana from "./VistaSemana";
import VistaDia from "./VistaDia";

import ModalNuevaCita from "../../components/agenda/ModalNuevaCita.jsx";
import AgendaToast from "../../components/agenda/AgendaToast.jsx";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function Agenda() {
  const hoy = useMemo(() => new Date(), []);
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);
  const [vista, setVista] = useState("mes");

  const {
    citas,
    cargarMes,
    crear,
    editar,
    eliminar,
    marcarResaltada,
    notify,
  } = useAgendaStore();

  // ⭐ PERMISOS DEL USUARIO
  const permisosAgenda = useAuthStore(
    (s) => s.permisos_modulo?.agenda || []
  );

  const puedeCrear = permisosAgenda.includes("crear");
  const puedeEditar = permisosAgenda.includes("editar");
  const puedeEliminar = permisosAgenda.includes("eliminar");
  const puedeVer = permisosAgenda.includes("ver");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalModo, setModalModo] = useState("crear"); // crear | editar | ver
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  // Cargar mes
  useEffect(() => {
    cargarMes(year, month);
  }, [year, month, cargarMes]);

  // Crear cita
  const abrirCrear = useCallback(
    (fecha) => {
      if (!puedeCrear) {
        notify("No tienes permiso para crear citas.");
        return;
      }

      setModalModo("crear");
      setFechaSeleccionada(fecha);
      setCitaSeleccionada(null);
      setMostrarModal(true);
    },
    [puedeCrear, notify]
  );

  // Editar cita
  const abrirEditar = useCallback(
    async (cita) => {
      if (!puedeEditar) {
        notify("No tienes permiso para editar citas.");
        return;
      }

      try {
        const res = await fetch(
          `https://agenda-intranet-b.onrender.com/api/agenda/${cita.id}`
        );
        const citaCompleta = await res.json();

        setModalModo("editar");
        setFechaSeleccionada(citaCompleta.fecha);
        setCitaSeleccionada(citaCompleta);
        setMostrarModal(true);
      } catch (err) {
        console.error("Error cargando cita completa:", err);
        notify("Error al cargar la cita.");
      }
    },
    [puedeEditar, notify]
  );

  // Ver cita (solo lectura)
  const abrirVerCita = useCallback(
    async (cita) => {
      if (!puedeVer && !puedeEditar) {
        notify("No tienes permiso para ver citas.");
        return;
      }

      try {
        const res = await fetch(
          `https://agenda-intranet-b.onrender.com/api/agenda/${cita.id}`
        );
        const citaCompleta = await res.json();

        setModalModo("ver");
        setFechaSeleccionada(citaCompleta.fecha);
        setCitaSeleccionada(citaCompleta);
        setMostrarModal(true);
      } catch (err) {
        console.error("Error cargando cita completa:", err);
        notify("Error al cargar la cita.");
      }
    },
    [puedeVer, puedeEditar, notify]
  );

  // Guardar cita
  const guardarCita = useCallback(
    async (payload) => {
      try {
        if (modalModo === "crear") {
          if (!puedeCrear) {
            notify("No tienes permiso para crear citas.");
            return;
          }

          const creada = await crear(payload, year, month);
          if (creada?.id) {
            marcarResaltada(creada.id);
            notify("Cita creada correctamente.");
          }
        } else if (modalModo === "editar" && citaSeleccionada) {
          if (!puedeEditar) {
            notify("No tienes permiso para editar citas.");
            return;
          }

          const editada = await editar(citaSeleccionada.id, payload, year, month);
          if (editada?.id) {
            marcarResaltada(editada.id);
            notify("Cita actualizada correctamente.");
          }
        } else if (modalModo === "ver") {
          // En modo ver no se guarda nada
          setMostrarModal(false);
          return;
        }

        setMostrarModal(false);
      } catch (err) {
        console.error("ERROR AL GUARDAR CITA:", err);
        notify("Error al guardar la cita.");
      }
    },
    [modalModo, citaSeleccionada, crear, editar, marcarResaltada, notify, year, month, puedeCrear, puedeEditar]
  );

  // Eliminar cita
  const borrarCita = useCallback(async () => {
    if (!citaSeleccionada) return;

    if (!puedeEliminar) {
      notify("No tienes permiso para eliminar citas.");
      return;
    }

    try {
      await eliminar(citaSeleccionada.id, year, month);
      notify("Cita eliminada.");
      setMostrarModal(false);
    } catch (err) {
      console.error("ERROR AL ELIMINAR CITA:", err);
      notify("Error al eliminar la cita.");
    }
  }, [citaSeleccionada, eliminar, notify, year, month, puedeEliminar]);

  // Navegación meses
  const mesAnterior = useCallback(() => {
    setMonth((m) => {
      if (m === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  }, []);

  const mesSiguiente = useCallback(() => {
    setMonth((m) => {
      if (m === 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  }, []);

  const citasSeguras = useMemo(() => (Array.isArray(citas) ? citas : []), [citas]);

  // Handler seguro para clic en cita según permisos
  const handleCitaClick = useCallback(
    (cita) => {
      if (puedeEditar) {
        abrirEditar(cita);
      } else if (puedeVer) {
        abrirVerCita(cita);
      } else {
        notify("No tienes permiso para ver citas.");
      }
    },
    [puedeEditar, puedeVer, abrirEditar, abrirVerCita, notify]
  );

  // Handler seguro para crear según permisos
  const handleDiaClick = useCallback(
    (fecha) => {
      if (!puedeCrear) {
        notify("No tienes permiso para crear citas.");
        return;
      }
      abrirCrear(fecha);
    },
    [puedeCrear, abrirCrear, notify]
  );

  return (
    <div className="space-y-6 p-6 text-white animate-fade-in">

      {/* CABECERA */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold drop-shadow">Agenda corporativa</h1>
        <p className="text-white/70">Calendario de citas SJ‑2026.</p>
      </div>

      {/* SELECTOR */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
          p-4 flex items-center gap-4 shadow-xl
        "
      >
        <button
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          onClick={mesAnterior}
        >
          ←
        </button>

        <select
          className="sj-input w-32 bg-white/10 text-white border-white/20 rounded-xl"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => hoy.getFullYear() - 5 + i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            )
          )}
        </select>

        <select
          className="sj-input w-40 bg-white/10 text-white border-white/20 rounded-xl"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {MESES.map((nombre, index) => (
            <option key={index} value={index + 1}>
              {nombre}
            </option>
          ))}
        </select>

        <button
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          onClick={mesSiguiente}
        >
          →
        </button>

        {/* BOTONES DE VISTA */}
        <div className="ml-auto flex gap-2">
          {["mes", "semana", "dia"].map((v) => (
            <button
              key={v}
              className={`
                px-3 py-2 rounded-xl transition
                ${
                  vista === v
                    ? "bg-white/20"
                    : "bg-white/10 hover:bg-white/20"
                }
              `}
              onClick={() => setVista(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* VISTA */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        {vista === "mes" && (
          <VistaMes
            year={year}
            month={month}
            citas={citasSeguras}
            onDiaClick={handleDiaClick}
            onCitaClick={handleCitaClick}
          />
        )}

        {vista === "semana" && (
          <VistaSemana
            fechaBase={`${year}-${String(month).padStart(2, "0")}-01`}
            citas={citasSeguras}
            onCitaClick={handleCitaClick}
            onCrearCita={handleDiaClick}
          />
        )}

        {vista === "dia" && (
          <VistaDia
            fechaDia={new Date()}
            citas={citasSeguras}
            onCitaClick={handleCitaClick}
            onCrearCita={handleDiaClick}
          />
        )}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <ModalNuevaCita
          fecha={fechaSeleccionada}
          modo={modalModo}
          cita={citaSeleccionada}
          onClose={() => setMostrarModal(false)}
          onGuardar={guardarCita}
          onDelete={
            modalModo === "editar" && puedeEliminar
              ? borrarCita
              : null
          }
        />
      )}

      <AgendaToast />
    </div>
  );
}
