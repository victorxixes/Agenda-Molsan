import React, { useState, useEffect } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";
import { useSeguridadStore } from "../../store/seguridadStore";
import { useParams, useNavigate } from "react-router-dom";

import EmpleadosSection from "../../components/empleados/EmpleadosSection.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import IconEmpleados from "../../components/icons/IconEmpleados.jsx";

export default function EmpleadoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    empleadoActual,
    cargarEmpleado,
    crearEmpleado,
    actualizarEmpleado,
  } = useEmpleadosStore();

  const { roles, cargarRoles } = useSeguridadStore();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    email_empresa: "",
    rol_id: "",
    activo: true,
  });

  // Cargar roles y empleado si estamos editando
  useEffect(() => {
    cargarRoles();
    if (id) cargarEmpleado(id);
  }, [id]);

  // Cuando llega el empleado del store → rellenamos formulario
  useEffect(() => {
    if (empleadoActual && id) {
      setForm({
        nombre: empleadoActual.nombre || "",
        apellidos: empleadoActual.apellidos || "",
        usuario: empleadoActual.usuario || "",
        email_empresa: empleadoActual.email_empresa || "",
        rol_id: empleadoActual.rol_id || "",
        activo: Boolean(empleadoActual.activo),
      });
    }
  }, [empleadoActual, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: form.nombre,
      apellidos: form.apellidos,
      usuario: form.usuario,
      email_empresa: form.email_empresa,
      rol_id: Number(form.rol_id) || null,
      activo: Boolean(form.activo),
    };

    if (id) {
      await actualizarEmpleado(id, payload);
    } else {
      await crearEmpleado(payload);
    }

    navigate("/empleados");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Título */}
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconEmpleados size={30} />
        {id ? "Editar empleado" : "Nuevo empleado"}
      </h2>

      {/* Sección Glass */}
      <EmpleadosSection title="Datos del empleado">
        <GlassCard className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">

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
              onChange={(e) =>
                setForm({ ...form, email_empresa: e.target.value })
              }
            />

            {/* Selector de rol */}
            <select
              className="input"
              value={form.rol_id}
              onChange={(e) =>
                setForm({ ...form, rol_id: Number(e.target.value) })
              }
            >
              <option value="">Seleccionar rol</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>

            {/* Activo */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) =>
                  setForm({ ...form, activo: e.target.checked })
                }
              />
              Activo
            </label>

            <button type="submit" className="btn-primary w-full">
              Guardar
            </button>
          </form>
        </GlassCard>
      </EmpleadosSection>
    </div>
  );
}
