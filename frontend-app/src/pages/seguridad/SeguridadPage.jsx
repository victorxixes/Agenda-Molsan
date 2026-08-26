import RolesList from "./RolesList";
import CrearRol from "./CrearRol";
import EventosSeguridad from "./EventosSeguridad";

export default function SeguridadPage() {
  return (
    <div className="p-6 space-y-10">
      <RolesList />
      <CrearRol />
      <EventosSeguridad />
    </div>
  );
}
