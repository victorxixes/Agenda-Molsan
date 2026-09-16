import { useMemo } from "react";
import { useAuthStore } from "../../store/authStore";
import EmpleadosModulo2026 from "../empleados/EmpleadosModulo2026";
import MonitorSistema from "./MonitorSistema";
import AuditoriaAvanzada from "./AuditoriaAvanzada";
import LogsAvanzados from "./LogsAvanzados";
import { puedeVerModulo } from "../../utils/permisos";

/**
 * Panel Técnico — SJ‑2026 Premium
 * - Glass‑UI
 * - Módulos técnicos
 * - Render optimizado
 */

export default function PanelTecnico() {
  const usuario = useAuthStore((s) => s.user);

  const puedeVerEmpleados = useMemo(() => puedeVerModulo("empleados"), []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-white drop-shadow">
        Panel Técnico SJ‑2026
      </h1>

      <MonitorSistema />
      <AuditoriaAvanzada />
      <LogsAvanzados />

      {puedeVerEmpleados && (
        <section
          className="
            bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
            p-6 shadow-xl
          "
        >
          <h2 className="text-xl font-semibold mb-3 text-white drop-shadow">
            Empleados 2026
          </h2>
          <EmpleadosModulo2026 usuario={usuario} />
        </section>
      )}
    </div>
  );
}
