import { useEffect, useState } from "react";
import { useAgenda } from "../../hooks/useAgenda";
import { useAgendaWS } from "../../hooks/useAgendaWS";

import VistaDia from "./VistaDia";
import VistaSemana from "./VistaSemana";
import VistaMes from "./VistaMes";

import ModalNuevaCita from "../../components/agenda/ModalNuevaCita.jsx";

import {
  crearCita,
  editarCita,
  eliminarCita,
} from "../../api/agenda";

export default function Agenda() {
  const {
    citas,
    cargarDia,
    cargarSemana,
    cargarMes,
    vista,
    fechaActual,
  } = useAgenda();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalModo, setModalModo] = useState("crear");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  useAgendaWS(1);

  useEffect(() => {
    cargarDia(new Date().toISOString().slice(0, 10));
  }, []);

  const recargarVista = (fecha) => {
    if (vista === "dia") cargarDia(fecha);
    if (vista === "semana") cargarSemana(fecha);
    if (vista === "mes") {
      const f = new Date(fecha);
      cargarMes(f.getFullYear(), f.getMonth() + 1);
    }
  };

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
    recargarVista(payload.fecha);
  };

  const borrarCita = async () => {
    if (!citaSeleccionada) return;
    await eliminarCita(citaSeleccionada.id);
    setMostrarModal(false);
    recargarVista(citaSeleccionada.fecha);
  };

  return (
    <div className="container-sj space-y-6">

      {/* Título */}
      <div className="seg-card">
        <h1 className="seg-title">Agenda</h1>
        <p className="seg-desc">Gestión de citas y calendario corporativo SJ‑2026.</p>
      </div>

      {/* Navegación estilo Google Calendar */}
      <div className="seg-card flex items-center gap-3">
        <button className="sj-btn" onClick={() => cargarDia(fechaActual)}>Día</button>
        <button className="sj-btn" onClick={() => cargarSemana(fechaActual)}>Semana</button>
        <button className="sj-btn" onClick={() => cargarMes(
          new Date(fechaActual).getFullYear(),
          new Date(fechaActual).getMonth() + 1
        )}>
          Mes
        </button>
      </div>

      {/* Vista */}
      <div className="seg-card">
        {vista === "dia" && (
          <VistaDia citas={citas} onCitaClick={abrirEditar} />
        )}

        {vista === "semana" && (
          <VistaSemana citas={citas} onCitaClick={abrirEditar} />
        )}

        {vista === "mes" && (
          <VistaMes
            citas={citas}
            onDiaClick={abrirCrear}
            onCitaClick={abrirEditar}
          />
        )}
      </div>

      {/* Modal */}
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
