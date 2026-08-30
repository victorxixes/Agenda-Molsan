import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader.jsx";
import CalendarGrid from "./CalendarGrid.jsx";

import AgendaNuevaCitaModal from "./AgendaNuevaCitaModal.jsx";
import AgendaNuevaEditarCitaModal from "./AgendaNuevaEditarCitaModal.jsx";
import AgendaCitaDetalleModal from "./AgendaCitaDetalleModal.jsx";

import { useAgendaStore } from "../../store/agendaStore";

export default function AgendaPage() {
  const cargarMes = useAgendaStore((s) => s.cargarMes);
  const cargarDia = useAgendaStore((s) => s.cargarDia);
  const citasDia = useAgendaStore((s) => s.citasDia);
  const setCitaActual = useAgendaStore((s) => s.setCitaActual);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showNuevaCita, setShowNuevaCita] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [citaEditId, setCitaEditId] = useState(null);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    cargarMes(`${year}-${month}`);
  }, [selectedDate, cargarMes]);

  useEffect(() => {
    const fecha = selectedDate.toISOString().split("T")[0];
    cargarDia(fecha);
  }, [selectedDate, cargarDia]);

  const handleEditarCita = (id) => {
    setCitaEditId(id);
    setModalEditarOpen(true);
  };

  return (
    <>
      <div className="w-full px-2 lg:px-4 xl:px-8 max-w-none">
        <CalendarHeader
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />

        <CalendarGrid
          selectedDate={selectedDate}
          onSelectDay={setSelectedDate}
          onNuevaCita={() => setShowNuevaCita(true)}
        />
      </div>

      <AgendaCitaDetalleModal onEditarCita={handleEditarCita} />

      <AgendaNuevaCitaModal
        open={showNuevaCita}
        onClose={() => setShowNuevaCita(false)}
        fechaSeleccionada={selectedDate}
      />

      <AgendaNuevaEditarCitaModal
        citaId={citaEditId}
        open={modalEditarOpen}
        onClose={() => setModalEditarOpen(false)}
      />
    </>
  );
}
