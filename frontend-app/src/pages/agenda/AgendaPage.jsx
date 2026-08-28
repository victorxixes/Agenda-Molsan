import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader.jsx";
import CalendarGrid from "./CalendarGrid.jsx";
import AgendaSidebar from "../../sidebar/AgendaSidebar.jsx";

import AgendaNuevaCitaModal from "./AgendaNuevaCitaModal.jsx";
import AgendaNuevaEditarCitaModal from "./AgendaNuevaEditarCitaModal.jsx";
import AgendaCitaDetalleModal from "./AgendaCitaDetalleModal.jsx";

import { useAgendaStore } from "../../store/agendaStore";

export default function AgendaPage() {
  const { cargarMes, cargarDia, citasDia } = useAgendaStore();

  const [selectedDate, setSelectedDate] = useState(new Date());

  // MODAL NUEVA CITA
  const [showNuevaCita, setShowNuevaCita] = useState(false);

  // MODAL EDITAR
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [citaEditId, setCitaEditId] = useState(null);

  // Cargar citas del mes
  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    cargarMes(`${year}-${month}`);
  }, [selectedDate]);

  // Cargar citas del día
  useEffect(() => {
    const fecha = selectedDate.toISOString().split("T")[0];
    cargarDia(fecha);
  }, [selectedDate]);

  // Abrir modal de edición
  const handleEditarCita = (id) => {
    setCitaEditId(id);
    setModalEditarOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CALENDARIO */}
        <div className="lg:col-span-2">
          <CalendarHeader
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />

          <CalendarGrid
            selectedDate={selectedDate}
            onSelectDay={setSelectedDate}
          />
        </div>

        {/* SIDEBAR */}
        <div>
          <AgendaSidebar
            date={selectedDate}
            citas={citasDia || []}
            onNuevaCita={() => setShowNuevaCita(true)}
            onEditarCita={handleEditarCita}
          />
        </div>

      </div>

      {/* MODAL DETALLE */}
      <AgendaCitaDetalleModal />

      {/* MODAL NUEVA CITA */}
      <AgendaNuevaCitaModal
        open={showNuevaCita}
        onClose={() => setShowNuevaCita(false)}
        fechaSeleccionada={selectedDate}
      />

      {/* MODAL EDITAR */}
      <AgendaNuevaEditarCitaModal
        citaId={citaEditId}
        open={modalEditarOpen}
        onClose={() => setModalEditarOpen(false)}
      />
    </>
  );
}
