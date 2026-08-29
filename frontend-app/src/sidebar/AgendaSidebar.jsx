import { useAgendaStore } from "../store/agendaStore";

export default function AgendaSidebar({ date }) {
  const fecha = date.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h3 className="text-xl font-bold">{fecha}</h3>
      {/* Sidebar limpio — sin citas */}
    </div>
  );
}
