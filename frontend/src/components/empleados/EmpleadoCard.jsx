import GlassCard from "../ui/GlassCard.jsx";
import IconEmpleados from "../icons/IconEmpleados.jsx";

export default function EmpleadoCard({ empleado }) {
  return (
    <GlassCard className="flex items-center gap-4">
      <IconEmpleados size={26} />

      <div>
        <p className="font-bold text-lg" style={{ color: "#1F3A5F" }}>
          {empleado.nombre}
        </p>
        <p className="text-sm" style={{ color: "#6A7A8C" }}>
          {empleado.rol}
        </p>
      </div>
    </GlassCard>
  );
}
