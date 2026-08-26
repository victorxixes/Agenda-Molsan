import EmpleadosPage from "./EmpleadosPage";
import EmpleadosRealtimePanel from "../../components/empleados/EmpleadosRealtimePanel";

export default function EmpleadosLayout() {
  return (
    <div className="p-6 space-y-10">
      <EmpleadosPage />
      <EmpleadosRealtimePanel />
    </div>
  );
}
