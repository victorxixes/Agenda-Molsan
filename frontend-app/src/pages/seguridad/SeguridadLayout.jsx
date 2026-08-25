import SeguridadPage from "./SeguridadPage";
import SeguridadRealtimePanel from "../../components/seguridad/SeguridadRealtimePanel";

export default function SeguridadLayout() {
  return (
    <div className="p-6 space-y-10">
      <SeguridadPage />
      <SeguridadRealtimePanel />
    </div>
  );
}
