import { useEffect, useState } from "react";
import { useAgenda } from "../../hooks/useAgenda";
import { useAgendaWS } from "../../hooks/useAgendaWS";

import VistaMes from "./VistaMes";
import ModalNuevaCita from "../../components/agenda/ModalNuevaCita.jsx";

import { crearCita, editarCita, eliminarCita } from "../../api/agenda";
import { useAgendaData } from "../../hooks/useAgendaData";

export default function Agenda() {
  const hoy = new Date();
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);

  const { citas } = useAgendaData(year, month);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalModo, setModalModo] = useState("crear");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const abrirCrear = (fecha) => {
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
  };

  const borrarCita = async () => {
    await eliminarCita(citaSeleccionada.id);
    setMostrarModal(false);
  };

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

      <div className="seg-card flex items-center gap-4">
        <button className="sj-btn px-3" onClick={mesAnterior}>←</button>

        <select
          className="sj-input w-32"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {Array.from({ length: 6 }, (_, i) => hoy.getFullYear() - 2 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          className="sj-input w-40"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <button className="sj-btn px-3" onClick={mesSiguiente}>→</button>
      </div>

      <div className="seg-card">
        <VistaMes
          citas={Array.isArray(citas) ? citas : []}
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
