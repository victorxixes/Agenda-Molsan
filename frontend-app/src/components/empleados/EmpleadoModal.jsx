import { useState, useEffect } from "react";
import Modal from "../ui/Modal.jsx";
import { useEmpleadosStore } from "../../store/empleadosStore";
import { useSeguridadStore } from "../../store/seguridadStore";

export default function EmpleadoModal({ empleado, onClose }) {
  const { crearEmpleado, actualizarEmpleado } = useEmpleadosStore();
  const { roles, cargarRoles } = useSeguridadStore();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    email_empresa: "",
    rol_id: "",
    activo: true,
  });

  useEffect(() => {
    cargarRoles();
    if (empleado) {
      setForm({
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        usuario: empleado.usuario,
        email_empresa: empleado.email_empresa,
        rol_id: empleado.rol_id,
        activo: empleado.activo,
      });
    }
  }, [empleado]);

  const handleSubmit = async () => {
    if (empleado) {
      await actualizarEmpleado(empleado.id, form);
    } else {
      await crearEmpleado(form);
    }
    onClose();
  };

  return (
    <Modal title={empleado ? "Editar empleado" : "Nuevo empleado"} onClose={onClose}>
      <div className="space-y-4">
        <input
          className="input"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <input
          className="input"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
        />

        <input
          className="input"
          placeholder="Usuario"
          value={form.usuario}
          onChange={(e) => setForm({ ...form, usuario: e.target.value })}
        />

        <input
          className="input"
          placeholder="Email empresa"
          value={form.email_empresa}
          onChange={(e) => setForm({ ...form, email_empresa: e.target.value })}
        />

        <select
          className="input"
          value={form.rol_id}
          onChange={(e) => setForm({ ...form, rol_id: Number(e.target.value) })}
        >
          <option value="">Seleccionar rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          Activo
        </label>

        <button className="btn-primary w-full" onClick={handleSubmit}>
          Guardar
        </button>
      </div>
    </Modal>
  );
}
