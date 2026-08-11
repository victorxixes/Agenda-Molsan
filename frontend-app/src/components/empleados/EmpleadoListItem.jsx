import GlassListItem from "../ui/GlassListItem.jsx";

export default function EmpleadoListItem({ empleado, onClick }) {
  return (
    <GlassListItem
      icon={
        <img
          src={empleado.foto || "/placeholder.png"}
          className="w-10 h-10 rounded-full object-cover border"
        />
      }
      title={`${empleado.nombre} ${empleado.apellidos}`}
      subtitle={empleado.rol || "Sin rol"}
      extra={
        <span
          className={`text-xs ${
            empleado.activo ? "text-green-600" : "text-red-600"
          }`}
        >
          {empleado.activo ? "Activo" : "Inactivo"}
        </span>
      }
      onClick={onClick}
    />
  );
}
