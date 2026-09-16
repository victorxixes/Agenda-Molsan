import { useState, useEffect } from "react";
import { useAgendaStore } from "../../store/agendaStore";

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
  const hoy = new Date();
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);
  const [vista, setVista] = useState("mes"); // mes | semana | dia

  const {
    citas,
    cargarMes,
    crear,
    editar,
    eliminar,
    marcarResaltada,
    notify,
  } = useAgendaStore();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalModo, setModalModo] = useState("crear");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  // Cargar mes al entrar y cuando cambian año/mes
  useEffect(() => {
    cargarMes(year, month);
  }, [year, month]);

  // Crear cita
  const abrirCrear = (fecha) => {
    setModalModo("crear");
    setFechaSeleccionada(fecha);
    setCitaSeleccionada(null);
    setMostrarModal(true);
  };

  // Editar cita
  const abrirEditar = async (cita) => {
    try {
      const res = await fetch(`https://agenda-intranet-b.onrender.com/api/agenda/${cita.id}`);
      const citaCompleta = await res.json();

      setModalModo("editar");
      setFechaSeleccionada(citaCompleta.fecha);
      setCitaSeleccionada(citaCompleta);

      setMostrarModal(true);
    } catch (err) {
      console.error("Error cargando cita completa:", err);
      notify("Error al cargar la cita.");
    }
  };

  // Guardar cita
  const guardarCita = async (payload) => {
    try {
      if (modalModo === "crear") {
        const creada = await crear(payload, year, month);
        if (creada?.id) {
          marcarResaltada(creada.id);
          notify("Cita creada correctamente.");
        }
      } else if (citaSeleccionada) {
        const editada = await editar(citaSeleccionada.id, payload, year, month);
        if (editada?.id) {
          marcarResaltada(editada.id);
          notify("Cita actualizada correctamente.");
        }
      }

      setMostrarModal(false);
    } catch (err) {
      console.error("ERROR AL GUARDAR CITA:", err);
      notify("Error al guardar la cita.");
    }
  };

  // Eliminar cita
  const borrarCita = async () => {
    if (!citaSeleccionada) return;

    try {
      await eliminar(citaSeleccionada.id, year, month);
      notify("Cita eliminada.");
      setMostrarModal(false);
    } catch (err) {
      console.error("ERROR AL ELIMINAR CITA:", err);
      notify("Error al eliminar la cita.");
    }
  };

  // Navegación meses
  const mesAnterior = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const mesSiguiente = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="space-y-6 p-6 text-white">

      {/* CABECERA PREMIUM */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold drop-shadow">Agenda corporativa</h1>
        <p className="text-white/70">Calendario de citas SJ‑2026.</p>
      </div>

      {/* SELECTOR PREMIUM */}
      <div className="
        bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
        p-4 flex items-center gap-4 shadow-xl
      ">
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
          {Array.from({ length: 10 }, (_, i) => hoy.getFullYear() - 5 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          className="sj-input w-40 bg-white/10 text-white border-white/20 rounded-xl"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {MESES.map((nombre, index) => (
            <option key={index} value={index + 1}>{nombre}</option>
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
          <button
            className={`px-3 py-2 rounded-xl transition ${
              vista === "mes" ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
            }`}
            onClick={() => setVista("mes")}
          >
            Mes
          </button>

          <button
            className={`px-3 py-2 rounded-xl transition ${
              vista === "semana" ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
            }`}
            onClick={() => setVista("semana")}
          >
            Semana
          </button>

          <button
            className={`px-3 py-2 rounded-xl transition ${
              vista === "dia" ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
            }`}
            onClick={() => setVista("dia")}
          >
            Día
          </button>
        </div>
      </div>

      {/* VISTA PREMIUM */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        {vista === "mes" && (
          <VistaMes
            year={year}
            month={month}
            citas={Array.isArray(citas) ? citas : []}
            onDiaClick={abrirCrear}
            onCitaClick={abrirEditar}
          />
        )}

        {vista === "semana" && (
          <VistaSemana
            fechaBase={`${year}-${String(month).padStart(2, "0")}-01`}
            citas={Array.isArray(citas) ? citas : []}
            onCitaClick={abrirEditar}
            onCrearCita={abrirCrear}
          />
        )}

        {vista === "dia" && (
          <VistaDia
            fechaDia={new Date()}
            citas={Array.isArray(citas) ? citas : []}
            onCitaClick={abrirEditar}
            onCrearCita={abrirCrear}
          />
        )}
      </div>

      {/* MODAL PREMIUM */}
      {mostrarModal && (
        <ModalNuevaCita
          fecha={fechaSeleccionada}
          modo={modalModo}
          cita={citaSeleccionada}
          onClose={() => setMostrarModal(false)}
          onGuardar={guardarCita}
          onDelete={modalModo === "editar" ? borrarCita : null}
        />
      )}

      {/* TOAST PREMIUM */}
      <AgendaToast />
    </div>
  );
}
