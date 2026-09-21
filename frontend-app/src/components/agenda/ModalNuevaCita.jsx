import { useEffect, useState, useCallback } from "react";
import AutocompleteNotario from "./AutocompleteNotario";
import { obtenerNotaria } from "../../api/ctn";

const TIPOS_CITA = ["Firma notarial", "Reunión", "Visita", "Otros"];

const normalizarTipoFirma = (vc) => {
  const v = vc?.toUpperCase();
  return v === "SI" || v === "VC" || v === "VIDEOCONFERENCIA"
    ? "Videoconferencia"
    : "Presencial";
};

const normalizarNotario = (n, tipoFirmaOverride = null) => ({
  id: n.id,
  codigo: n.codigo || "",
  nombre: n.nombre || "",
  apellidos: n.apellidos || "",
  nif: n.nif || "",
  telefono: n.telefono || "",
  provincia: n.provincia || "",
  municipio: n.municipio || "",
  cp: n.cp || "",
  direccion: n.direccion || "",
  vc: n.vc || "",
  apoderado: n.apoderado_s || n.apoderado || "",
  observacion: n.observacion || "",
  tipo_firma: tipoFirmaOverride || normalizarTipoFirma(n.vc),
});

export default function ModalNuevaCita({
  fecha,
  modo,
  cita,
  onClose,
  onGuardar,
  onDelete,
}) {
  const soloLectura = modo === "ver";
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    hora_inicio: "",
    hora_fin: "",
    tipo_cita: "",
    notario_id: null,
    tipo_firma: "",
    apoderado_visible: "",
    observaciones: "",
  });

  const [notarioSeleccionado, setNotarioSeleccionado] = useState(null);

  const handleChange = useCallback((campo, valor) => {
    if (soloLectura) return;
    setForm((f) => ({ ...f, [campo]: valor }));
  }, [soloLectura]);

  useEffect(() => {
    if (modo === "crear") return;
    if (!cita) return;

    setForm({
      hora_inicio: cita.hora_inicio || "",
      hora_fin: cita.hora_fin || "",
      tipo_cita: cita.tipo_cita || "",
      notario_id: cita.notario_id || null,
      tipo_firma: typeof cita.tipo_firma === "string" ? cita.tipo_firma : "",
      apoderado_visible: cita.apoderado_nombre || "",
      observaciones: cita.observaciones || "",
    });

    if (cita.notario_id) {
      obtenerNotaria(cita.notario_id).then((res) => {
        const n = res.data;
        if (!n) return;

        const notarioCompleto = normalizarNotario(n, cita.tipo_firma);
        setNotarioSeleccionado(notarioCompleto);

        handleChange("tipo_firma", notarioCompleto.tipo_firma);
        handleChange("apoderado_visible", notarioCompleto.apoderado || "");
        handleChange("observaciones", notarioCompleto.observacion || "");
      });
    }
  }, [modo, cita, handleChange]);

  const guardar = useCallback(async () => {
    if (soloLectura) return;

    setLoading(true);

    const fechaNormalizada =
      typeof fecha === "string"
        ? fecha
        : fecha.toLocaleDateString("sv-SE");

    const payload = {
      fecha: fechaNormalizada,
      hora_inicio: form.hora_inicio || "",
      hora_fin: form.hora_fin || "",
      tipo_cita: form.tipo_cita || "",
      notario_id: form.notario_id || null,
      tipo_firma: typeof form.tipo_firma === "string" ? form.tipo_firma : "",
      apoderado: form.apoderado_visible || "",
      observaciones: form.observaciones || "",
    };

    try {
      await onGuardar(payload);
    } catch (err) {
      console.error("ERROR AL GUARDAR CITA:", err);
    }

    setLoading(false);
  }, [soloLectura, fecha, form, onGuardar]);

  if (!fecha) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-xl p-6 text-white">

        <h2 className="text-2xl font-semibold mb-4 drop-shadow">
          {modo === "crear"
            ? "Nueva cita"
            : modo === "editar"
            ? "Editar cita"
            : "Ver cita"}{" "}
          — {fecha}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">

          {/* Hora inicio */}
          <div>
            <label className="block mb-1 text-white/80">Hora inicio</label>
            <input
              type="time"
              disabled={soloLectura}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white disabled:opacity-50"
              value={form.hora_inicio}
              onChange={(e) => handleChange("hora_inicio", e.target.value)}
            />
          </div>

          {/* Hora fin */}
          <div>
            <label className="block mb-1 text-white/80">Hora fin</label>
            <input
              type="time"
              disabled={soloLectura}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white disabled:opacity-50"
              value={form.hora_fin}
              onChange={(e) => handleChange("hora_fin", e.target.value)}
            />
          </div>

          {/* Tipo de cita */}
          <div className="col-span-2">
            <label className="block mb-1 text-white/80">Tipo de cita</label>
            <select
              disabled={soloLectura}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white disabled:opacity-50"
              value={form.tipo_cita}
              onChange={(e) => handleChange("tipo_cita", e.target.value)}
            >
              <option value="">Seleccionar tipo</option>
              {TIPOS_CITA.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Autocomplete Notario */}
          <div className="col-span-2">
            <label className="block mb-1 text-white/80">Buscar notario</label>

            <AutocompleteNotario
              disabled={soloLectura}
              value={notarioSeleccionado}
              onSelect={(n) => {
                if (soloLectura) return;

                const notarioCompleto = normalizarNotario(n);
                setNotarioSeleccionado(notarioCompleto);

                handleChange("notario_id", n.id);
                handleChange("tipo_firma", notarioCompleto.tipo_firma);
                handleChange("apoderado_visible", notarioCompleto.apoderado || "");
                handleChange("observaciones", notarioCompleto.observacion || "");
              }}
            />
          </div>

          {/* Tarjeta del notario */}
          {notarioSeleccionado && (
            <div className="col-span-2 border border-white/20 rounded-xl p-4 bg-white/5 backdrop-blur-xl shadow-lg">
              <h4 className="font-semibold text-sm mb-2 text-white">
                {notarioSeleccionado.nombre} {notarioSeleccionado.apellidos}
              </h4>

              <div className="space-y-1 text-white/80 text-xs">
                <p>Código: {notarioSeleccionado.codigo}</p>
                <p>NIF: {notarioSeleccionado.nif}</p>
                <p>Teléfono: {notarioSeleccionado.telefono}</p>
                <p>Provincia: {notarioSeleccionado.provincia}</p>
                <p>Municipio: {notarioSeleccionado.municipio}</p>
                <p>CP: {notarioSeleccionado.cp}</p>
                <p>Dirección: {notarioSeleccionado.direccion}</p>
                <p>VC: {notarioSeleccionado.tipo_firma}</p>
                <p>Apoderado: {notarioSeleccionado.apoderado}</p>
                <p>Observación: {notarioSeleccionado.observacion}</p>
              </div>

              <iframe
                className="w-full h-40 mt-3 rounded-xl border border-white/20"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${notarioSeleccionado.direccion}, ${notarioSeleccionado.cp} ${notarioSeleccionado.municipio}`
                )}&output=embed`}
              ></iframe>
            </div>
          )}

          {/* Tipo firma */}
          <div>
            <label className="block mb-1 text-white/80">Tipo firma</label>
            <input
              disabled={soloLectura}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white disabled:opacity-50"
              value={form.tipo_firma}
              onChange={(e) => handleChange("tipo_firma", e.target.value)}
            />
          </div>

          {/* Apoderado */}
          <div>
            <label className="block mb-1 text-white/80">Apoderado</label>
            <input
              disabled
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white disabled:opacity-50"
              value={form.apoderado_visible || ""}
            />
          </div>

          {/* Observaciones */}
          <div className="col-span-2">
            <label className="block mb-1 text-white/80">Observaciones</label>
            <textarea
              disabled={soloLectura}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white disabled:opacity-50"
              rows={3}
              value={form.observaciones}
              onChange={(e) =>
                handleChange("observaciones", e.target.value)
              }
            />
          </div>
        </div>

        {/* Botones finales */}
        <div className="mt-6 flex justify-end gap-3">

          {modo === "editar" && onDelete && !soloLectura && (
            <button
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition shadow-lg"
              onClick={onDelete}
            >
              Eliminar
            </button>
          )}

          <button
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shadow-lg"
            onClick={onClose}
          >
            {soloLectura ? "Cerrar" : "Cancelar"}
          </button>

          {!soloLectura && (
            <button
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg"
              onClick={guardar}
              disabled={loading}
            >
              {modo === "crear" ? "Crear cita" : "Guardar cambios"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
