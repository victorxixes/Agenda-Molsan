import GlassListItem from "../ui/GlassListItem.jsx";

const getFotoURL = (foto) => {
  if (!foto || foto === "string" || foto.trim() === "") {
    return "/placeholder.png";
  }
  if (foto.startsWith("http")) return foto;
  return `${import.meta.env.VITE_API_URL}${foto}`;
};

export default function EmpleadoListItem({ empleado, onClick }) {
  return (
    <GlassListItem
      icon={
        <img
          src={getFotoURL(empleado.foto)}
          className="w-10 h-10 rounded-full object-cover border"
        />
      }
      title={`${empleado.nombre} ${empleado.apellidos}`}
      subtitle={empleado.rol_nombre || "Sin rol"}
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
