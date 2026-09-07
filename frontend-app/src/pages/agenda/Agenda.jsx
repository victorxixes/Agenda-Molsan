import { useEffect, useState } from "react";
import { useAgenda } from "../../hooks/useAgenda";
import { useAgendaWS } from "../../hooks/useAgendaWS";

import VistaMes from "./VistaMes";
import ModalNuevaCita from "../../components/agenda/ModalNuevaCita.jsx";

import { crearCita, editarCita, eliminarCita } from "../../api/agenda";

export default function Agenda() {
  const { citas, cargarMes, fechaActual } = useAgenda();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalModo, setModalModo] = useState("crear");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  useAgendaWS(1);

  // ⭐ Cargar MES al entrar
  useEffect(() => {
    const hoy = new Date();
    cargarMes(hoy.getFullYear(), hoy.getMonth() + 1);
  }, []);

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

  return (
    <div className="container-sj space-y-6">
      <div className="seg-card">
        <h1 className="seg-title">Agenda corporativa</h1>
        <p className="seg-desc">Calendario de citas SJ‑2026.</p>
      </div>

      <div className="seg-card flex items-center justify-between">
        <button
          className="sj-btn bg-green-600 hover:bg-green-700"
          onClick={() => abrirCrear(fechaActual)}
        >
          Nueva cita rápida
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
