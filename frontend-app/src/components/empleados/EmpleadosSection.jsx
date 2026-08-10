import GlassSectionTitle from "../ui/GlassSectionTitle.jsx";
import IconEmpleados from "../icons/IconEmpleados.jsx";

export default function EmpleadosSection({ title, children }) {
  return (
    <div className="my-6">
      <GlassSectionTitle icon={<IconEmpleados size={26} />} title={title} />
      {children}
    </div>
  );
}
