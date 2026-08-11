import { useState, useEffect } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import AgendaSidebar from "./AgendaSidebar";
import AgendaNuevaCitaModal from "./AgendaNuevaCitaModal";

export default function AgendaPage() {
  const { citasDia, cargarDia, cargarMes } = useAgendaStore();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [showModal, setShowModal] = useState(false);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  useEffect(() => {
    cargarMes(year, month);
  }, [year, month]);

  const handleSelectDay = (day) => {
    setSelectedDate(day);
    cargarDia(day.toISOString().split("T")[0]);
    setShowModal(true);
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
      </div>

      {/* Tabla lateral */}
      <div className="col-span-4">
        <AgendaSidebar 
          date={selectedDate}
          citas={citasDia}
          onNuevaCita={() => setShowModal(true)}
        />
      </div>

      {/* Modal */}
      <AgendaNuevaCitaModal 
        open={showModal}
        onClose={() => setShowModal(false)}
        fechaSeleccionada={selectedDate}
      />

    </div>
  );
}
