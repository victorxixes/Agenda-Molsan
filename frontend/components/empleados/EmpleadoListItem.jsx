import GlassListItem from "../ui/GlassListItem.jsx";
import IconEmpleados from "../icons/IconEmpleados.jsx";

export default function EmpleadoListItem({ empleado, onClick }) {
  return (
    <GlassListItem
      icon={<IconEmpleados size={22} />}
      title={empleado.nombre}
      subtitle={empleado.rol}
      onClick={onClick}
    />
  );
}
