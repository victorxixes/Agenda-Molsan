import { useEffect, useState } from "react";
import { useAgenda } from "../../hooks/useAgenda";
import { useAgendaWS } from "../../hooks/useAgendaWS";

import VistaMes from "./VistaMes";
import ModalNuevaCita from "../../components/agenda/ModalNuevaCita.jsx";

import { crearCita, editarCita, eliminarCita } from "../../api/agenda";

export default function Agenda() {
  const { citas, cargarMes } = useAgenda();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalModo, setModalModo] = useState("crear");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const hoy = new Date();
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);

  useAgendaWS(1);

  useEffect(() => {
    cargarMes(year, month);
  }, [year, month]);

  const abrirCrear = (fecha) => {
    if (!fecha) return;
    setModalModo("crear");
    setFechaSeleccionada(fecha);
    setCitaSeleccionada(null);
    setMostrarModal(true);
  };

  const abrirEditar = (cita) => {
    setModalModo("editar");
    setFechaSeleccionada(cita.fecha);
    setCitaSeleccionada(cita);
    setMostrarModal(true);
  };

  const guardarCita = async (payload) => {
    if (modalModo === "crear") {
      await crearCita(payload);
    } else {
      await editarCita(citaSeleccionada.id, payload);
    }
    setMostrarModal(false);

    const f = new Date(payload.fecha);
    cargarMes(f.getFullYear(), f.getMonth() + 1);
  };

  const borrarCita = async () => {
    if (!citaSeleccionada) return;
    await eliminarCita(citaSeleccionada.id);
    setMostrarModal(false);

    const f = new Date(citaSeleccionada.fecha);
    cargarMes(f.getFullYear(), f.getMonth() + 1);
  };

  // ⭐ Navegación con flechas
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
    <div className="container-sj space-y-6">
      <div className="seg-card">
        <h1 className="seg-title">Agenda corporativa</h1>
        <p className="seg-desc">Calendario de citas SJ‑2026.</p>
      </div>

      {/* SELECTORES + FLECHAS */}
      <div className="seg-card flex items-center gap-4">

        {/* Flecha izquierda */}
        <button
          className="sj-btn px-3"
          onClick={mesAnterior}
        >
          ←
        </button>

        {/* Selector de año */}
        <select
          className="sj-input w-32"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {Array.from({ length: 6 }, (_, i) => hoy.getFullYear() - 2 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Selector de mes */}
        <select
          className="sj-input w-40"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          <option value={1}>Enero</option>
          <option value={2}>Febrero</option>
          <option value={3}>Marzo</option>
          <option value={4}>Abril</option>
          <option value={5}>Mayo</option>
          <option value={6}>Junio</option>
          <option value={7}>Julio</option>
          <option value={8}>Agosto</option>
          <option value={9}>Septiembre</option>
          <option value={10}>Octubre</option>
          <option value={11}>Noviembre</option>
          <option value={12}>Diciembre</option>
        </select>

        {/* Flecha derecha */}
        <button
          className="sj-btn px-3"
          onClick={mesSiguiente}
        >
          →
        </button>
      </div>

      <div className="seg-card">
        <VistaMes
          citas={citas}
          onDiaClick={abrirCrear}
          onCitaClick={abrirEditar}
        />
      </div>

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
    </div>
  );
}
