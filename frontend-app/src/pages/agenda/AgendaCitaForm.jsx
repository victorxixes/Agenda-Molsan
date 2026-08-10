import React, { useState, useEffect } from "react";
import { useAgendaStore } from "../../store/agendaStore";
import AgendaSection from "../../components/agenda/AgendaSection.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import axios from "axios";

export default function AgendaCitaForm() {
  const { crear } = useAgendaStore();

  const [notarios, setNotarios] = useState([]);
  const [apoderados, setApoderados] = useState([]);

  const [buscarNotaria, setBuscarNotaria] = useState("");
  const [notariaSeleccionada, setNotariaSeleccionada] = useState(null);

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

  useEffect(() => {
    axios.get("/agenda/notarios").then((res) => setNotarios(res.data));
    axios.get("/agenda/apoderados").then((res) => setApoderados(res.data));
  }, []);

  const seleccionarNotaria = (n) => {
    setNotariaSeleccionada(n);

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

    setBuscarNotaria(`${n.nombre} ${n.apellidos}`);
  };

  const guardar = async () => {
    if (!form.apoderado_id) {
      alert("Debes seleccionar un apoderado.");
      return;
    }

    await crear(form);
    alert("Cita creada correctamente");
  };

  const resultados = buscarNotaria.length > 1
    ? notarios.filter((n) =>
        `${n.nombre} ${n.apellidos}`.toLowerCase().includes(buscarNotaria.toLowerCase())
      )
    : [];

  return (
    <AgendaSection title="Nueva cita">
      <GlassCard className="space-y-4">

        <input
          type="date"
          className="input"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
        />

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

        <div className="relative">
          <input
            type="text"
            className="input"
            placeholder="Buscar notaría"
            value={buscarNotaria}
            onChange={(e) => {
              setBuscarNotaria(e.target.value);
              setNotariaSeleccionada(null);
            }}
          />

          {resultados.length > 0 && (
            <div className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-auto shadow">
              {resultados.map((n) => (
                <div
                  key={n.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => seleccionarNotaria(n)}
                >
                  <div className="font-semibold">{n.nombre} {n.apellidos}</div>
                  <div className="text-sm text-gray-600">
                    {n.municipio} ({n.provincia}) — Código: {n.codigo}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

        <textarea
          className="input"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
        />

        <button className="btn-primary" onClick={guardar}>
          Guardar cita
        </button>
      </GlassCard>
    </AgendaSection>
  );
}
