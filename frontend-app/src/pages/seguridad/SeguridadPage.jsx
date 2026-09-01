import RolesList from "./RolesList";
import RolForm from "./RolForm";
import RolDetalle from "./RolDetalle";
import ModulosRol from "./ModulosRol";
import PermisosRol from "./PermisosRol";
import Auditoria from "./Auditoria";
import EventosSeguridad from "./EventosSeguridad";

export default function SeguridadPage() {
  return (
    <Routes>
      <Route path="roles" element={<RolesList />} />
      <Route path="roles/nuevo" element={<RolForm />} />
      <Route path="roles/:id" element={<RolDetalle />} />
      <Route path="roles/:id/modulos" element={<ModulosRol />} />
      <Route path="roles/:id/permisos" element={<PermisosRol />} />

      <Route path="auditoria" element={<Auditoria />} />
      <Route path="eventos" element={<EventosSeguridad />} />
    </Routes>
  );
}
