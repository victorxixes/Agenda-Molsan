import { useAgendaStore } from "../store/agendaStore";

// 🔥 Función para iconos de tipo de cita
const iconoTipoCita = (tipo) => {
  switch (tipo) {
    case "Firma notarial": return "🖋";
    case "Reunión": return "👥";
    case "Visita": return "👣";
    default: return "📄";
  }
};

export default function AgendaSidebar({ date }) {
  const fecha = date.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h3 className="text-xl font-bold">{fecha}</h3>

      {/* Sidebar limpio — sin citas */}
      {/* 
        Si en el futuro vuelves a mostrar citas aquí,
        podrás usar iconoTipoCita(c.tipo_cita) así:

        <div>
          {iconoTipoCita(c.tipo_cita)} {c.tipo_cita}
        </div>
      */}
    </div>
  );
}
