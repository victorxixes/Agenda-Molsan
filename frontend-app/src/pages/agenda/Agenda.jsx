import { useState } from "react";
import { useAgendaData } from "../../hooks/useAgendaData";

import VistaMes from "./VistaMes";
import ModalNuevaCita from "../../components/agenda/ModalNuevaCita.jsx";

import { crearCita, editarCita, eliminarCita } from "../../api/agenda";

// ⭐ MESES DEFINIDOS AQUÍ
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function Agenda() {
  const hoy = new Date();
  const [year, setYear] = useState(hoy.getFullYear());
  const [month, setMonth] = useState(hoy.getMonth() + 1);

  const { citas, reload } = useAgendaData(year, month);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalModo, setModalModo] = useState("crear");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  // Crear cita
  const abrirCrear = (fecha) => {
    setModalModo("crear");
    setFechaSeleccionada(fecha);
    setCitaSeleccionada(null);
    setMostrarModal(true);
  };

  // Editar cita
  const abrirEditar = (cita) => {
    setModalModo("editar");
    setFechaSeleccionada(cita.fecha);
    setCitaSeleccionada(cita);
    setMostrarModal(true);
  };

  // Guardar cita (crear o editar)
  const guardarCita = async (payload) => {
    if (modalModo === "crear") {
      await crearCita(payload);
    } else {
      await editarCita(citaSeleccionada.id, payload);
    }

    await reload();
    setMostrarModal(false);
  };

  // Eliminar cita
  const borrarCita = async () => {
    await eliminarCita(citaSeleccionada.id);
    await reload();
    setMostrarModal(false);
  };

  // Navegación meses
  const mesAnterior = async () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
    await reload();
  };

  const mesSiguiente = async () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
    await reload();
  };

  return (
    <div className="container-sj space-y-6">
      <div className="seg-card">
        <h1 className="seg-title">Agenda corporativa</h1>
        <p className="seg-desc">Calendario de citas SJ‑2026.</p>
      </div>

      {/* Selector de año y mes */}
      <div className="seg-card flex items-center gap-4">
        <button className="sj-btn px-3" onClick={mesAnterior}>←</button>

        {/* Año */}
        <select
          className="sj-input w-32"
          value={year}
          onChange={async (e) => {
            setYear(parseInt(e.target.value));
            await reload();
          }}
        >
          {Array.from({ length: 10 }, (_, i) => hoy.getFullYear() - 5 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Mes en texto */}
        <select
          className="sj-input w-40"
          value={month}
          onChange={async (e) => {
            setMonth(parseInt(e.target.value));
            await reload();
          }}
        >
          {MESES.map((nombre, index) => (
            <option key={index} value={index + 1}>
              {nombre}
            </option>
          ))}
        </select>

        <button className="sj-btn px-3" onClick={mesSiguiente}>→</button>
      </div>

      {/* Vista mensual */}
      <div className="seg-card">
        <VistaMes
          year={year}
          month={month}
          citas={Array.isArray(citas) ? citas : []}
          onDiaClick={abrirCrear}
          onCitaClick={abrirEditar}
        />
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
