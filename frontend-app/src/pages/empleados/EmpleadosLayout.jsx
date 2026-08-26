import EmpleadosList from "./EmpleadosList";
import EmpleadosRealtimePanel from "../../components/empleados/EmpleadosRealtimePanel";

export default function EmpleadosLayout() {
  return (
    <div className="p-6 space-y-10">
      <EmpleadosRealtimePanel />
      <EmpleadosList />
    </div>
  );
}
