import { Routes, Route } from "react-router-dom";

import RolesList from "./RolesList";
import RolForm from "./RolForm";
import PermisosRol from "./PermisosRol";
import ModulosRol from "./ModulosRol";
import Auditoria from "./Auditoria";
import EventosSeguridad from "./EventosSeguridad";

export default function SeguridadPage() {
  return (
    <div className="p-6 space-y-10">
      <Routes>

        {/* ROLES */}
        <Route path="roles" element={<RolesList />} />
        <Route path="roles/nuevo" element={<RolForm />} />
        <Route path="roles/:id" element={<RolForm />} />
        <Route path="roles/:id/permisos" element={<PermisosRol />} />
        <Route path="roles/:id/modulos" element={<ModulosRol />} />

        {/* AUDITORÍA */}
        <Route path="auditoria" element={<Auditoria />} />

        {/* EVENTOS */}
        <Route path="eventos" element={<EventosSeguridad />} />

      </Routes>
    </div>
  );
}
