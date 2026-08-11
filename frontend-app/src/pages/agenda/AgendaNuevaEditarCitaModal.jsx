import { useEffect, useState } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useCTNStore } from "../../store/ctnStore";
import GlassCard from "../../components/ui/GlassCard.jsx";
import BuscadorNotariaPremium from "../../components/agenda/BuscadorNotariaPremium.jsx";

export default function AgendaNuevaEditarCitaModal({ citaId, open, onClose }) {
  const { cargarCita, citaActual, editar, cambiarEstado } = useAgendaStore();
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
    estado: "",
    observaciones: "",
  });

  // ---------------------------------------------------------
  // CARGAR CITA + CATÁLOGOS
  // ---------------------------------------------------------
  useEffect(() => {
    if (open && citaId) {
      cargarCita(citaId);
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
        apoderado_id: citaActual.apoderado_id,
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
      "";

    const apoderadoEncontrado =
      apoderados.find((a) =>
        `${a.nombre} ${a.apellidos}`.trim() === (n.apoderado || "").trim()
      ) ||
      apoderados.find((a) =>
        `${a.nombre} ${a.apellidos}`.trim() === (n.apoderado_s || "").trim()
      );

    setForm({
      ...form,
      notario_id: n.id,
      tipo_firma: tipoFirmaTraducida,
      apoderado_id: apoderadoEncontrado ? apoderadoEncontrado.id : null,
      observaciones: n.observacion || form.observaciones,
    });
  };

  // ---------------------------------------------------------
  // GUARDAR
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

        <input
          type="date"
          className="input"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />

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

        <select
          className="input"
          value={form.tipo_cita}
          onChange={(e) => setForm({ ...form, tipo_cita: e.target.value })}
        >
          {tiposCita.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

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

        <select
          className="input"
          value={form.apoderado_id}
          onChange={(e) => setForm({ ...form, apoderado_id: Number(e.target.value) })}
        >
          {apoderados.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellidos}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={form.tipo_firma}
          onChange={(e) => setForm({ ...form, tipo_firma: e.target.value })}
        >
          {tiposFirma.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

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
