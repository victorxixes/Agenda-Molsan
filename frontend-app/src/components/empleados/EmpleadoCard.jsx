import GlassCard from "../ui/GlassCard.jsx";
import IconEmpleados from "../icons/IconEmpleados.jsx";

const getFotoURL = (foto) => {
  if (!foto || foto === "string" || foto.trim() === "") {
    return "/placeholder.png";
  }
  if (foto.startsWith("http")) return foto;
  return `${import.meta.env.VITE_API_URL}${foto}`;
};

export default function EmpleadoCard({ empleado, onClick }) {
  return (
    <GlassCard
      className="flex items-center gap-4 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={getFotoURL(empleado.foto)}
        alt="Foto empleado"
        className="w-12 h-12 rounded-full object-cover border"
      />

      <div>
        <p className="font-bold text-lg text-[#1F3A5F]">
          {empleado.nombre} {empleado.apellidos}
        </p>

        <p className="text-sm text-[#6A7A8C]">
          {empleado.rol_nombre || "Sin rol"}
        </p>

        <p
          className={`text-xs ${
            empleado.activo ? "text-green-600" : "text-red-600"
          }`}
        >
          {empleado.activo ? "Activo" : "Inactivo"}
        </p>
      </div>
    </GlassCard>
  );
}
