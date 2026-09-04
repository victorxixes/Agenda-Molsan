import { useEffect } from "react";
import { useSeguridad } from "../../hooks/useSeguridad";
import SeguridadRoles from "./SeguridadRoles";
import SeguridadPermisos from "./SeguridadPermisos";
import SeguridadModulos from "./SeguridadModulos";

export default function Seguridad() {
  const { cargarTodo, loading } = useSeguridad();

  useEffect(() => {
    cargarTodo();
  }, []);

  if (loading) return <p className="p-6">Cargando seguridad…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Seguridad</h1>

      <SeguridadRoles />
      <SeguridadPermisos />
      <SeguridadModulos />
    </div>
  );
}

