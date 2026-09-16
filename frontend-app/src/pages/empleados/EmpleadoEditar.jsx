import { useEffect, useState } from "react";
import { obtenerEmpleado, editarEmpleado } from "../../api/empleados";

export default function EmpleadoEditar({ empleadoId, onGuardado }) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    email_empresa: "",
    activo: true,
  });

  useEffect(() => {
    if (!empleadoId) return;
    obtenerEmpleado(empleadoId).then((res) => {
      const e = res.data;
      setForm({
        nombre: e.nombre ?? "",
        apellidos: e.apellidos ?? "",
        telefono: e.telefono ?? "",
        email_empresa: e.email_empresa ?? "",
        activo: e.activo ?? true,
      });
    });
  }, [empleadoId]);

  const handleChange = (campo, valor) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const guardar = async () => {
    await editarEmpleado(empleadoId, form);
    onGuardado?.();
  };

  if (!empleadoId) return null;

  return (
    <div
      className="
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
        p-6 shadow-2xl space-y-6 text-white animate-fade-in
      "
    >
      <h2 className="text-2xl font-semibold drop-shadow mb-2">
        Editar empleado
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">

        {/* Nombre */}
        <input
          className="
            bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white
            placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />

        {/* Apellidos */}
        <input
          className="
            bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white
            placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={(e) => handleChange("apellidos", e.target.value)}
        />

        {/* Teléfono */}
        <input
          className="
            bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white
            placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />

        {/* Email empresa */}
        <input
          className="
            bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white
            placeholder-white/40 focus:ring-2 focus:ring-blue-400
          "
          placeholder="Email empresa"
          value={form.email_empresa}
          onChange={(e) => handleChange("email_empresa", e.target.value)}
        />

        {/* Activo */}
        <label className="flex items-center gap-3 mt-2 text-white/80">
          <div
            className={`
              w-12 h-6 rounded-full cursor-pointer transition-all
              ${form.activo ? "bg-green-500/60" : "bg-white/20"}
            `}
            onClick={() => handleChange("activo", !form.activo)}
          >
            <div
              className={`
                w-5 h-5 bg-white rounded-full shadow-md transform transition-all
                ${form.activo ? "translate-x-6" : "translate-x-1"}
              `}
            />
          </div>
          Activo
        </label>
      </div>

      <button
        className="
          px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700
          text-white shadow-lg transition
        "
        onClick={guardar}
      >
        Guardar cambios
      </button>
    </div>
  );
}
