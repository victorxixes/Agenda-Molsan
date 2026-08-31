import { useEffect, useState } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useCTNStore } from "../../store/ctnStore";
import { useEmpleadosStore } from "../../store/empleadosStore";

import GlassCard from "../../components/ui/GlassCard.jsx";
import BuscadorNotariaPremium from "../../components/agenda/BuscadorNotariaPremium.jsx";

// Iconos
const iconoTipoCita = (tipo) => {
  switch (tipo) {
    case "Firma notarial": return "🖋";
    case "Reunión": return "👥";
    case "Visita": return "👣";
    default: return "📄";
  }
};

const iconoTipoFirma = (vc) => {
  switch (vc) {
    case "SI": return "🎥 Videoconferencia";
    case "NO": return "📍 Presencial";
    default: return "—";
  }
};

export default function AgendaNuevaCitaModal({ open, onClose, fechaSeleccionada }) {
  const { crear } = useAgendaStore();
  const { notarias, cargarNotarias } = useCTNStore();
  const { empleados, cargarEmpleados } = useEmpleadosStore();

  const TIPOS_CITA = ["Firma notarial", "Reunión", "Visita", "Otros"];

  // Formulario alineado con backend
  const [form, setForm] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    tipo_cita: "",
    notario_id: null,
    vc: "",
    apoderado_s: "",
    apoderado_id: null,
    observacion: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      cargarNotarias();
      cargarEmpleados();

      setForm((f) => ({
        ...f,
        fecha: fechaSeleccionada.toISOString().split("T")[0],
      }));
    }
  }, [open]);

  // Selección de notaría → rellena datos del CTN
  const seleccionarNotaria = (n) => {
    setForm(prev => ({
      ...prev,
      notario_id: n.id,
      vc: n.vc || "",
      apoderado_s: n.apoderado_s || "",
      apoderado_id: n.apoderado_id || null,
      observacion: n.observacion?.trim() || "",
    }));
  };

  // Guardar cita
  const guardar = async () => {
    setError("");

    if (!form.fecha) return setError("La fecha es obligatoria");
    if (!form.hora_inicio) return setError("La hora de inicio es obligatoria");
    if (!form.hora_fin) return setError("La hora de fin es obligatoria");
    if (!form.tipo_cita) return setError("El tipo de cita es obligatorio");

    if (form.tipo_cita === "Firma notarial") {
      if (!form.notario_id) return setError("Debes seleccionar una notaría");
      if (!form.vc) return setError("Debes seleccionar el tipo de firma");
    }

    try {
      await crear({
        fecha: form.fecha,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        tipo_cita: form.tipo_cita,
        notario_id: form.notario_id,
        apoderado_id: form.apoderado_id,
        observacion: form.observacion,
        vc: form.vc,
      });

      alert("Cita creada correctamente");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error creando la cita");
    }
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
              vc:
                tipo === "Firma notarial" && notarioSeleccionado
                  ? notarioSeleccionado.vc
                  : "",
            }));
          }}
        >
          <option value="">Selecciona tipo de cita</option>

          <option value="Firma notarial">🖋 Firma notarial</option>
          <option value="Reunión">👥 Reunión</option>
          <option value="Visita">👣 Visita</option>
          <option value="Otros">📄 Otros</option>
        </select>

        {/* Buscador notaría */}
        <BuscadorNotariaPremium
          notarios={notarias}
          onSelect={seleccionarNotaria}
        />

        {/* Notario seleccionado */}
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

        {/* Selector de apoderado */}
        <select
          className="input"
          value={form.apoderado_id || ""}
          onChange={(e) =>
            setForm({ ...form, apoderado_id: Number(e.target.value) })
          }
        >
          <option value="">Selecciona apoderado</option>
          {empleados.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nombre} {emp.apellidos}
            </option>
          ))}
        </select>

        {/* Tipo de firma */}
        <input
          type="text"
          className="input bg-gray-100"
          value={iconoTipoFirma(form.vc)}
          readOnly
        />

        {/* Observaciones */}
        <textarea
          className="input"
          placeholder="Observaciones"
          value={form.observacion}
          onChange={(e) => setForm({ ...form, observacion: e.target.value })}
        />

        <button className="btn-primary w-full" onClick={guardar}>
          Crear cita
        </button>

      </GlassCard>
    </div>
  );
}
