import { useState, useEffect } from "react";
import { useAgendaStore } from "../../store/agendaStore";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

import AgendaSidebar from "../../sidebar/AgendaSidebar.jsx";
import AgendaNuevaCitaModal from "./AgendaNuevaCitaModal";
import AgendaNuevaEditarCitaModal from "./AgendaNuevaEditarCitaModal.jsx";
import AgendaCitaDetalleModal from "./AgendaCitaDetalleModal.jsx";

import AgendaCard from "../../components/agenda/AgendaCard.jsx";

export default function AgendaPage() {
  const { citasDia, cargarDia, cargarMes } = useAgendaStore();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  const [showNuevaCita, setShowNuevaCita] = useState(false);
  const [editarId, setEditarId] = useState(null);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  useEffect(() => {
    cargarMes(year, month);
  }, [year, month]);

  const handleSelectDay = (day) => {
    setSelectedDate(day);
    cargarDia(day.toISOString().split("T")[0]);
    setShowNuevaCita(true);
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-4">

      {/* Calendario */}
      <div className="col-span-8">
        <CalendarHeader 
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />

        <CalendarGrid 
          selectedDate={selectedDate}
          onSelectDay={handleSelectDay}
        />

        {/* ⭐ Tarjetas del día */}
        <div className="mt-4 space-y-3">
          {citasDia.map((cita) => (
            <AgendaCard 
              key={cita.id}
              cita={cita}
              onEditarCita={(id) => setEditarId(id)}
            />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-4">
        <AgendaSidebar 
          date={selectedDate}
          citas={citasDia}
          onNuevaCita={() => setShowNuevaCita(true)}
          onEditarCita={(id) => setEditarId(id)}
        />
      </div>

      {/* Modal: Nueva cita */}
      <AgendaNuevaCitaModal 
        open={showNuevaCita}
        onClose={() => setShowNuevaCita(false)}
        fechaSeleccionada={selectedDate}
      />

      {/* Modal: Editar cita */}
      <AgendaNuevaEditarCitaModal
        open={editarId !== null}
        citaId={editarId}
        onClose={() => {
          setEditarId(null);
          cargarDia(selectedDate.toISOString().split("T")[0]);
        }}
      />

      {/* Modal: Detalle */}
      <AgendaCitaDetalleModal />
    </div>
  );
}
