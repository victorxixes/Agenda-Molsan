import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader.jsx";
import CalendarGrid from "./CalendarGrid.jsx";
import AgendaSidebar from "../../sidebar/AgendaSidebar.jsx";
import { useAgendaStore } from "../../store/agendaStore";

export default function AgendaPage() {
  const { cargarMes, cargarDia, citasDia } = useAgendaStore();

  const [selectedDate, setSelectedDate] = useState(new Date());

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

  return (
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
          onEditarCita={(id) => console.log("Editar cita", id)}
        />
      </div>

    </div>
  );
}
