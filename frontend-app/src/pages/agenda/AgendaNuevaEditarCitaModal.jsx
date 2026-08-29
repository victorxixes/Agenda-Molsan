import { useEffect, useState } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useCTNStore } from "../../store/ctnStore";
import GlassCard from "../../components/ui/GlassCard.jsx";
import BuscadorNotariaPremium from "../../components/agenda/BuscadorNotariaPremium.jsx";

// 🔥 Iconos para tipo de cita
const iconoTipoCita = (tipo) => {
  switch (tipo) {
    case "Firma notarial": return "🖋";
    case "Reunión": return "👥";
    case "Visita": return "👣";
    default: return "📄";
  }
};

// 🔥 Iconos para tipo de firma
const iconoTipoFirma = (tipo) => {
  switch (tipo) {
    case "Videoconferencia": return "🎥";
    case "Presencial": return "📍";
    default: return "—";
  }
};

export default function AgendaNuevaEditarCitaModal({ citaId, open, onClose }) {
  const { cargarCita, citaActual, editar } = useAgendaStore();
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
    observaciones: "",
  });

  const [error, setError] = useState("");

  // Cargar cita + notarios
  useEffect(() => {
    if (open && citaId) {
      cargarCita(citaId);
      cargarNotarias();
    }
  }, [open, citaId, cargarCita, cargarNotarias]);

  // Rellenar formulario con la cita actual
  useEffect(() => {
    if (citaActual) {
      setForm({
        fecha: citaActual.fecha,
        hora_inicio: citaActual.hora_inicio,
        hora_fin: citaActual.hora_fin,
        tipo_cita: citaActual.tipo_cita,
        notario_id: citaActual.notario_id,
        tipo_firma: citaActual.tipo_firma || "",
        apoderado_id: citaActual.apoderado_id || null,
        observaciones: citaActual.observaciones?.trim() || "",
      });
    }
  }, [citaActual]);

  // Seleccionar notaría
  const seleccionarNotaria = (n) => {
    const tipoFirmaTraducida =
      n.vc === "SI" ? "Videoconferencia" :
      n.vc === "NO" ? "Presencial" :
      n.vc || "";

    setForm(prev => ({
      ...prev,
      notario_id: n.id,
      tipo_firma:
        prev.tipo_cita === "Firma notarial"
          ? tipoFirmaTraducida
          : prev.tipo_firma,
      observaciones:
        prev.tipo_cita === "Firma notarial"
          ? (n.observacion || prev.observaciones)
          : prev.observaciones,
    }));
  };

  // Guardar cambios
  const guardar = async () => {
    setError("");

    if (!form.fecha) return setError("La fecha es obligatoria");
    if (!form.hora_inicio) return setError("La hora de inicio es obligatoria");
    if (!form.hora_fin) return setError("La hora de fin es obligatoria");
    if (!form.tipo_cita) return setError("El tipo de cita es obligatorio");

    if (form.tipo_cita === "Firma notarial") {
      if (!form.notario_id) return setError("Debes seleccionar una notaría");
      if (!form.tipo_firma) return setError("Debes seleccionar el tipo de firma");
    }

    try {
      await editar(citaId, form);
      alert("Cita actualizada correctamente");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error actualizando la cita");
    }
  };

  if (!open) return null;

  const notarioSeleccionado = notarias.find((n) => n.id === form.notario_id);

  // 🔥 Apoderado corregido: soporta string, objeto, id y null
  const apoderadoLabel =
    citaActual?.apoderado
      ? typeof citaActual.apoderado === "string"
        ? citaActual.apoderado
        : `${citaActual.apoderado.nombre} ${citaActual.apoderado.apellidos}`
      : form.apoderado_id || "—";

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

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

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
          onChange={(e) => {
            const tipo = e.target.value;

            setForm(prev => ({
              ...prev,
              tipo_cita: tipo,
              tipo_firma: tipo === "Firma notarial" ? prev.tipo_firma : "",
            }));
          }}
        >
          <option value="">Selecciona tipo de cita</option>

          <option value="Firma notarial">🖋 Firma notarial</option>
          <option value="Reunión">👥 Reunión</option>
          <option value="Visita">👣 Visita</option>
          <option value="Otros">📄 Otros</option>
        </select>

        {/* Notario */}
        <BuscadorNotariaPremium
          notarios={notarias}
          onSelect={seleccionarNotaria}
        />

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
          value={apoderadoLabel}
          readOnly
        />

        {/* Tipo firma */}
        <input
          type="text"
          className="input bg-gray-100"
          value={
            form.tipo_firma
              ? `${iconoTipoFirma(form.tipo_firma)} ${form.tipo_firma}`
              : "—"
          }
          readOnly
        />

        {/* Observaciones */}
        <textarea
          className="input"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
        />

        <button className="btn-primary w-full" onClick={guardar}>
          Guardar cambios
        </button>

      </GlassCard>
    </div>
  );
}
