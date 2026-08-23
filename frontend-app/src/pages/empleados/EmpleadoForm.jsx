import React, { useState, useEffect } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";
import { useParams, useNavigate } from "react-router-dom";

import EmpleadosSection from "../../components/empleados/EmpleadosSection.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import IconEmpleados from "../../components/icons/IconEmpleados.jsx";

export default function EmpleadoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { empleado, cargarEmpleado, crearEmpleado, actualizarEmpleado } =
    useEmpleadosStore();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    email_empresa: "",
    activo: true,
  });

  // Limpieza de valores corruptos del backend
  const limpiar = (obj) => {
    const limpio = { ...obj };
    for (const key in limpio) {
      if (
        limpio[key] === "string" ||
        limpio[key] === null ||
        limpio[key] === "null" ||
        limpio[key] === undefined
      ) {
        limpio[key] = "";
      }
    }
    return limpio;
  };

  // Cargar empleado si estamos editando
  useEffect(() => {
    if (id) cargarEmpleado(id);
  }, [id]);

  // Cuando el store recibe el empleado, lo volcamos al formulario
  useEffect(() => {
    if (empleado && id) {
      setForm(limpiar(empleado));
    }
  }, [empleado, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
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
