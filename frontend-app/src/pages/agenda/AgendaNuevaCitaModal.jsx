import React, { useState, useEffect } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import { useCTNStore } from "../../store/ctnStore";
import GlassCard from "../../components/ui/GlassCard.jsx";
import BuscadorNotariaPremium from "../../components/agenda/BuscadorNotariaPremium.jsx";

export default function AgendaNuevaCitaModal({ open, onClose, fechaSeleccionada }) {
  const { crear } = useAgendaStore();
  const { notarias, cargarNotarias } = useCTNStore();

  const [apoderados, setApoderados] = useState([]);

  const [form, setForm] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    tipo_cita: "Firma notarial",
    notario_id: null,
    tipo_firma: "",
    apoderado_id: "",
    estado: "Pendiente",
    observaciones: "",
  });

  // ---------------------------------------------------------
  // PRELLENAR FECHA AL ABRIR EL MODAL
  // ---------------------------------------------------------
  useEffect(() => {
    if (open && fechaSeleccionada) {
      const fechaISO = fechaSeleccionada.toISOString().split("T")[0];

      setForm((f) => ({
        ...f,
        fecha: fechaISO,
        hora_inicio: "",
        hora_fin: "",
      }));
    }
  }, [open, fechaSeleccionada]);

  // ---------------------------------------------------------
  // CARGAR NOTARÍAS DESDE CTN
  // ---------------------------------------------------------
  useEffect(() => {
    if (open) cargarNotarias();
  }, [open]);

  // ---------------------------------------------------------
  // CARGAR APODERADOS DESDE BACKEND
  // ---------------------------------------------------------
  useEffect(() => {
    if (open) {
      fetch(`${import.meta.env.VITE_API_URL}/agenda/apoderados`)
        .then((r) => r.json())
        .then((data) => setApoderados(data));
    }
  }, [open]);

  // ---------------------------------------------------------
  // SELECCIONAR NOTARIA (rellena tipo_firma, apoderado, observaciones)
  // ---------------------------------------------------------
  const seleccionarNotaria = (n) => {
    const apoderadoEncontrado =
      apoderados.find((a) => a.nombre === n.apoderado) ||
      apoderados.find((a) => a.nombre === n.apoderado_s);

    setForm({
      ...form,
      notario_id: n.id,
      tipo_firma: n.vc || "",
      apoderado_id: apoderadoEncontrado ? apoderadoEncontrado.id : "",
      observaciones: n.observacion || "",
    });
  };

  // ---------------------------------------------------------
  // GUARDAR CITA
  // ---------------------------------------------------------
  const guardar = async () => {
    if (!form.apoderado_id) {
      alert("Debes seleccionar un apoderado.");
      return;
    }

    await crear(form);
    alert("Cita creada correctamente");
    onClose();
  };

  // ---------------------------------------------------------
  // SI EL MODAL NO ESTÁ ABIERTO → NO RENDERIZAR
  // ---------------------------------------------------------
  if (!open) return null;

  const notarioSeleccionado = notarias.find((n) => n.id === form.notario_id);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-xl space-y-4 relative">

        {/* Botón cerrar */}
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
          <option value="Firma notarial">Firma notarial</option>
          <option value="Reunión">Reunión</option>
          <option value="Visita">Visita</option>
          <option value="Otros">Otros</option>
        </select>

        {/* Buscador de notaria */}
        <BuscadorNotariaPremium
          notarios={notarias}
          onSelect={seleccionarNotaria}
        />

        {/* Datos del notario + Google Maps */}
        {notarioSeleccionado && (
          <div className="space-y-2 bg-white/40 p-3 rounded-lg">

            <div className="font-semibold">
              {notarioSeleccionado.nombre} {notarioSeleccionado.apellidos}
            </div>

            <div className="text-sm">
              📍 {notarioSeleccionado.direccion}
            </div>

            <div className="text-sm">
              ☎️ {notarioSeleccionado.telefono}
            </div>

            <div className="text-sm">
              ✉️ {notarioSeleccionado.email}
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
          value={form.apoderado_id}
          onChange={(e) => setForm({ ...form, apoderado_id: Number(e.target.value) })}
        >
          <option value="">Seleccionar apoderado</option>
          {apoderados.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} {a.apellidos}
            </option>
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
          Guardar cita
        </button>

      </GlassCard>
    </div>
  );
}
