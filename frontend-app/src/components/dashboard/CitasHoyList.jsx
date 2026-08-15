import AgendaCard from "../../components/agenda/AgendaCard.jsx";

export default function CitasHoyList({ citas, onEditar }) {
  return (
    <div className="mt-4 space-y-3">
      {citas.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No hay citas hoy
        </div>
      ) : (
        citas.map((cita) => (
          <AgendaCard
            key={cita.id}
            cita={cita}
            onEditarCita={onEditar}
          />
        ))
      )}
    </div>
  );
}
