import GlassListItem from "../ui/GlassListItem.jsx";

const getFotoURL = (foto) => {
  if (!foto || foto.trim() === "") {
    return `${import.meta.env.VITE_API_URL}/fotos/default-avatar.png`;
  }

  // Si ya viene con /fotos/... no duplicamos la ruta
  if (foto.startsWith("/fotos/")) {
    return `${import.meta.env.VITE_API_URL}${foto}`;
  }

  // Si solo viene el nombre del archivo
  return `${import.meta.env.VITE_API_URL}/fotos/${foto}`;
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
