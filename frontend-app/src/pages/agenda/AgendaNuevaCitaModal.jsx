import { useEffect, useState } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useCTNStore } from "../../store/ctnStore";

import GlassCard from "../../components/ui/GlassCard.jsx";
import BuscadorNotariaPremium from "../../components/agenda/BuscadorNotariaPremium.jsx";

export default function AgendaNuevaCitaModal({ open, onClose, fechaSeleccionada }) {
  const { crear } = useAgendaStore();
  const { notarias, cargarNotarias } = useCTNStore();

  // 🔥 Tipos de cita definidos localmente (backend ya no los sirve)
  const TIPOS_CITA = [
    "Firma notarial",
    "Reunión",
    "Visita",
    "Otros"
  ];

  const [form, setForm] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    tipo_cita: "",
    notario_id: null,
    tipo_firma: "",
    apoderado: "",   // texto del Excel
    estado: "Pendiente",
    observaciones: "",
  });

  // ---------------------------------------------------------
  // CARGAR NOTARIAS + FECHA
  // ---------------------------------------------------------
  useEffect(() => {
    if (open) {
      cargarNotarias();

      setForm((f) => ({
        ...f,
        fecha: fechaSeleccionada.toISOString().split("T")[0],
      }));
    }
  }, [open]);

  // ---------------------------------------------------------
  // SELECCIONAR NOTARIA (solo usar Apoderado y VC del Excel)
  // ---------------------------------------------------------
  const seleccionarNotaria = (n) => {
    const tipoFirmaTraducida =
      n.vc === "SI" ? "Videoconferencia" :
      n.vc === "NO" ? "Presencial" :
      n.vc || "";

    setForm(prev => ({
      ...prev,
      notario_id: n.id,
      tipo_firma: tipoFirmaTraducida,
      apoderado: n.apoderado || "",
      observaciones: n.observacion || prev.observaciones,
    }));
  };

  // ---------------------------------------------------------
  // GUARDAR
  // ---------------------------------------------------------
  const guardar = async () => {
    await crear(form);
    alert("Cita creada correctamente");
    onClose();
  };

  if (!open) return null;

  const notarioSeleccionado = notarias.find((n) => n.id === form.notario_id);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-xl space-y-4 relative">

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold">Nueva cita</h2>

        {/* Fecha */}
        <input
          type="date"
          className="input"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />

        {/* Horas */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="time"
            className="input"
            value={form.hora_inicio}
            onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })}
          />

          <input
            type="time"
            className="input"
            value={form.hora_fin}
            onChange={(e) => setForm({ ...form, hora_fin: e.target.value })}
          />
        </div>

        {/* Tipo de cita */}
        <select
          className="input"
          value={form.tipo_cita}
          onChange={(e) => setForm({ ...form, tipo_cita: e.target.value })}
        >
          <option value="">Selecciona tipo de cita</option>
          {TIPOS_CITA.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Buscador de notaria */}
        <BuscadorNotariaPremium
          notarios={notarias}
          onSelect={seleccionarNotaria}
        />

        {/* Datos del notario */}
        {notarioSeleccionado && (
          <div className="space-y-2 bg-white/40 p-3 rounded-lg">
            <div className="font-semibold">
              {notarioSeleccionado.nombre} {notarioSeleccionado.apellidos}
            </div>

            <div className="text-sm">
              📍 {notarioSeleccionado.direccion}
            </div>

            <iframe
              className="w-full h-40 rounded-lg"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                notarioSeleccionado.direccion
              )}&output=embed`}
            ></iframe>
          </div>
        )}

        {/* Apoderado */}
        <input
          type="text"
          className="input bg-gray-100"
          value={form.apoderado || ""}
          readOnly
        />

        {/* Tipo de firma */}
        <input
          type="text"
          className="input bg-gray-100"
          value={form.tipo_firma || ""}
          readOnly
        />

        {/* Observaciones */}
        <textarea
          className="input"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
        />

        {/* Botón guardar */}
        <button className="btn-primary w-full" onClick={guardar}>
          Crear cita
        </button>

      </GlassCard>
    </div>
  );
}
