import { useEffect, useState } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useCTNStore } from "../../store/ctnStore";
import GlassCard from "../../components/ui/GlassCard.jsx";
import BuscadorNotariaPremium from "../../components/agenda/BuscadorNotariaPremium.jsx";

export default function AgendaNuevaCitaModal({ open, onClose, fechaSeleccionada }) {
  const { crear } = useAgendaStore();
  const { notarias, cargarNotarias } = useCTNStore();

  const [apoderados, setApoderados] = useState([]);
  const [tiposCita, setTiposCita] = useState([]);
  const [tiposFirma, setTiposFirma] = useState([]);

  const [form, setForm] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    tipo_cita: "",
    notario_id: null,
    tipo_firma: "",
    apoderado_id: null,
    estado: "Pendiente",
    observaciones: "",
  });

  // Normalizar nombres (sin tildes)
  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  // ---------------------------------------------------------
  // CARGAR CATÁLOGOS
  // ---------------------------------------------------------
  useEffect(() => {
    if (open) {
      cargarNotarias();

      fetch(`${import.meta.env.VITE_API_URL}/agenda/apoderados`)
        .then((r) => r.json())
        .then(setApoderados);

      fetch(`${import.meta.env.VITE_API_URL}/agenda/tipos-cita`)
        .then((r) => r.json())
        .then((data) => setTiposCita(data.map((t) => t.nombre)));

      fetch(`${import.meta.env.VITE_API_URL}/agenda/tipos-firma`)
        .then((r) => r.json())
        .then((data) => setTiposFirma(data.map((t) => t.nombre)));

      setForm((f) => ({
        ...f,
        fecha: fechaSeleccionada.toISOString().split("T")[0],
      }));
    }
  }, [open]);

  // ---------------------------------------------------------
  // AUTOSELECCIONAR APODERADO (fallback si no coincide)
  // ---------------------------------------------------------
  useEffect(() => {
    if (open && apoderados.length > 0) {
      const yo = apoderados.find(a => a.id === 2); // tu ID real
      if (yo) {
        setForm(f => ({ ...f, apoderado_id: yo.id }));
      }
    }
  }, [open, apoderados]);

  // ---------------------------------------------------------
// SELECCIONAR NOTARIA
// ---------------------------------------------------------
const seleccionarNotaria = (n) => {
  const tipoFirmaTraducida =
    n.vc === "SI" ? "Videoconferencia" :
    n.vc === "NO" ? "Presencial" :
    "";

  const apoderadoEncontrado =
    apoderados.find((a) =>
      normalize(`${a.nombre} ${a.apellidos}`) === normalize(n.apoderado || "")
    ) ||
    apoderados.find((a) =>
      normalize(`${a.nombre} ${a.apellidos}`) === normalize(n.apoderado_s || "")
    );

  setForm(prev => ({
    ...prev,
    notario_id: n.id,
    tipo_firma: tipoFirmaTraducida,
    apoderado_id: apoderadoEncontrado
      ? apoderadoEncontrado.id
      : (prev.apoderado_id ?? 2),
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
          {tiposCita.map((t) => (
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
        <select
          className="input"
          value={form.apoderado_id || ""}
          onChange={(e) => setForm({ ...form, apoderado_id: Number(e.target.value) })}
        >
          <option value="">Selecciona apoderado</option>
          {apoderados.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellidos}
            </option>
          ))}
        </select>

        {/* Tipo de firma */}
        <select
          className="input"
          value={form.tipo_firma}
          onChange={(e) => setForm({ ...form, tipo_firma: e.target.value })}
        >
          <option value="">Selecciona tipo de firma</option>
          {tiposFirma.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

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
