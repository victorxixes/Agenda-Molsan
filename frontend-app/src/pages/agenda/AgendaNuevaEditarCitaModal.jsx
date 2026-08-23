import { useEffect, useState } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useCTNStore } from "../../store/ctnStore";
import GlassCard from "../../components/ui/GlassCard.jsx";
import BuscadorNotariaPremium from "../../components/agenda/BuscadorNotariaPremium.jsx";

export default function AgendaNuevaEditarCitaModal({ citaId, open, onClose }) {
  const { cargarCita, citaActual, editar, cambiarEstado } = useAgendaStore();
  const { notarias, cargarNotarias } = useCTNStore();

  const TIPOS_CITA = ["Firma notarial", "Reunión", "Visita", "Otros"];

  const [form, setForm] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    tipo_cita: "",
    notario_id: null,
    tipo_firma: "",
    apoderado_id: null,
    estado: "",
    observaciones: "",
  });

  // ---------------------------------------------------------
  // CARGAR CITA + NOTARIAS
  // ---------------------------------------------------------
  useEffect(() => {
    if (open && citaId) {
      cargarCita(citaId);
      cargarNotarias();
    }
  }, [open, citaId]);

  // ---------------------------------------------------------
  // RELLENAR FORMULARIO
  // ---------------------------------------------------------
  useEffect(() => {
    if (citaActual) {
      setForm({
        fecha: citaActual.fecha,
        hora_inicio: citaActual.hora_inicio,
        hora_fin: citaActual.hora_fin,
        tipo_cita: citaActual.tipo_cita,
        notario_id: citaActual.notario_id,
        tipo_firma: citaActual.tipo_firma,
        apoderado_id: citaActual.apoderado_id || null,
        estado: citaActual.estado,
        observaciones: citaActual.observaciones || "",
      });
    }
  }, [citaActual]);

  // ---------------------------------------------------------
  // SELECCIONAR NOTARIA
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
      apoderado_id: n.apoderado_id || null,
      observaciones: n.observacion || prev.observaciones,
    }));
  };

  // ---------------------------------------------------------
  // GUARDAR CAMBIOS
  // ---------------------------------------------------------
  const guardar = async () => {
    await editar(citaId, form);
    alert("Cita actualizada correctamente");
    onClose();
  };

  // ---------------------------------------------------------
  // CAMBIAR ESTADO
  // ---------------------------------------------------------
  const cambiarEstadoCita = async (nuevoEstado) => {
    await cambiarEstado(citaId, nuevoEstado);
    setForm({ ...form, estado: nuevoEstado });
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

        <h2 className="text-2xl font-bold">Editar cita</h2>

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
  value={form.apoderado_id || "—"}
  readOnly
/>

        {/* Tipo de firma */}
        <input
          type="text"
          className="input bg-gray-100"
          value={form.tipo_firma || ""}
          readOnly
        />

        {/* Estado */}
        <div className="flex gap-2">
          {["Pendiente", "Confirmada", "En curso", "Finalizada", "Cancelada"].map((estado) => (
            <button
              key={estado}
              className={`btn ${form.estado === estado ? "btn-primary" : ""}`}
              onClick={() => cambiarEstadoCita(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

        {/* Observaciones */}
        <textarea
          className="input"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
        />

        {/* Botón guardar */}
        <button className="btn-primary w-full" onClick={guardar}>
          Guardar cambios
        </button>

      </GlassCard>
    </div>
  );
}
