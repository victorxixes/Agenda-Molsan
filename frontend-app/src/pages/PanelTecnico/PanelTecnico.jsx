import { useAuth } from "../../context/AuthContext";
import EmpleadosModulo2026 from "../Empleados/EmpleadosModulo2026";

export default function PanelTecnico() {
  const { puedeVerModulo } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Panel Técnico SJ‑2026</h1>

      <MonitorSistema />
      <AuditoriaAvanzada />
      <LogsAvanzados />

      {puedeVerModulo("empleados") && (
        <section className="border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Empleados 2026</h2>
          <EmpleadosModulo2026 />
        </section>
      )}
    </div>
  );
}
