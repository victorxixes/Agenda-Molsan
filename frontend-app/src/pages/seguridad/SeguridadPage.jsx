import RolesList from "../../components/seguridad/RolesList";
import CrearRol from "../../components/seguridad/CrearRol";
import EventosSeguridad from "../../components/seguridad/EventosSeguridad";

export default function SeguridadPage() {
  return (
    <div className="p-6 space-y-10">
      <RolesList />
      <CrearRol />
      <EventosSeguridad />
    </div>
  );
}
