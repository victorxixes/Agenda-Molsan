import CtnListadoPage from "./CtnListadoPage";

export default function Ctn() {
  return (
    <div className="p-6 space-y-6 text-white">
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold drop-shadow">CTN — Notarías</h1>
        <p className="text-white/70">Consulta y gestión de notarías del CTN.</p>
      </div>

      <CtnListadoPage />
    </div>
  );
