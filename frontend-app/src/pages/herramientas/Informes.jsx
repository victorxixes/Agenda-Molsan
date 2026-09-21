import { useState } from "react";
import InformeApoderado from "../../components/informes/InformeApoderado";

export default function Informes() {
  const [apoderadoId, setApoderadoId] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      <h1 className="text-3xl font-bold text-white drop-shadow mb-4">
        Informes
      </h1>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl space-y-4">

        <label className="text-white/80 text-sm">Selecciona apoderado</label>
        <input
          type="number"
          className="
            w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2
            text-white placeholder-white/40
          "
          placeholder="ID del apoderado"
          value={apoderadoId}
          onChange={(e) => setApoderadoId(e.target.value)}
        />

        {apoderadoId && (
          <InformeApoderado apoderadoId={Number(apoderadoId)} />
        )}
      </div>
    </div>
  );
}
