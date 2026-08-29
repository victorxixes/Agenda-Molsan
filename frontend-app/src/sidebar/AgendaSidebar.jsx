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

export default function AgendaSidebar() {
  return null;
}

 
