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
    <div className="border p-4 rounded bg-white shadow space-y-3">
      <h2 className="text-lg font-semibold">Editar empleado</h2>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <input
          className="border p-2 rounded"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={(e) => handleChange("apellidos", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email empresa"
          value={form.email_empresa}
          onChange={(e) => handleChange("email_empresa", e.target.value)}
        />
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) =>
              handleChange("activo", e.target.checked)
            }
          />
          Activo
        </label>
      </div>

      <button
        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
        onClick={guardar}
      >
        Guardar cambios
      </button>
    </div>
  );
}
