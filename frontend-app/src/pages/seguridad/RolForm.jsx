
import React, { useState, useEffect } from "react";
import { useSeguridadStore } from "../../store/seguridadStore";
import { useNavigate, useParams } from "react-router-dom";

import GlassCard from "../../components/ui/GlassCard.jsx";
import GlassSectionTitle from "../../components/ui/GlassSectionTitle.jsx";
import IconSeguridad from "../../components/icons/IconSeguridad.jsx";

export default function RolForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    rol,
    cargarRol,
    crearRol,
    actualizarRol,
  } = useSeguridadStore();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    permisos: [],
  });

  const [nuevoPermiso, setNuevoPermiso] = useState({
    modulo: "",
    acciones: "",
  });

  // ---------------------------------------------------------
  // Cargar rol si estamos editando
  // ---------------------------------------------------------
  useEffect(() => {
    if (id) cargarRol(id);
  }, [id]);

  // ---------------------------------------------------------
  // Rellenar formulario cuando llega el rol
  // ---------------------------------------------------------
  useEffect(() => {
    if (rol) {
      setForm({
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        permisos: rol.permisos.map((p) => ({
          modulo: p.modulo,
          acciones: p.acciones,
        })),
      });
    }
  }, [rol]);

  // ---------------------------------------------------------
  // Añadir permiso
  // ---------------------------------------------------------
  const agregarPermiso = () => {
    if (!nuevoPermiso.modulo || !nuevoPermiso.acciones) return;

    setForm({
      ...form,
      permisos: [...form.permisos, nuevoPermiso],
    });

    setNuevoPermiso({ modulo: "", acciones: "" });
  };

  // ---------------------------------------------------------
  // Eliminar permiso
  // ---------------------------------------------------------
  const eliminarPermiso = (modulo) => {
    setForm({
      ...form,
      permisos: form.permisos.filter((p) => p.modulo !== modulo),
    });
  };

  // ---------------------------------------------------------
  // Guardar
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      await actualizarRol(id, form);
    } else {
      await crearRol(form);
    }

    navigate("/seguridad/roles");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Título */}
      <h2
        className="text-3xl font-bold flex items-center gap-3"
        style={{ color: "#1F3A5F" }}
      >
        <IconSeguridad size={30} />
        {id ? "Editar Rol" : "Nuevo Rol"}
      </h2>

      {/* Sección Glass */}
      <GlassSectionTitle
        icon={<IconSeguridad size={26} />}
        title="Datos del rol"
      />

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
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
          />

          {/* Permisos */}
          <div className="space-y-3">
            <p className="font-bold" style={{ color: "#1F3A5F" }}>
              Permisos del rol
            </p>

            {form.permisos.length === 0 && (
              <p className="text-neutral-500 text-sm">No hay permisos.</p>
            )}

            {form.permisos.map((p) => (
              <div
                key={p.modulo}
                className="flex items-center justify-between bg-neutral-800 p-2 rounded"
              >
                <span>
                  <strong>{p.modulo}</strong>: {p.acciones}
                </span>

                <button
                  type="button"
                  className="text-red-400 text-sm"
                  onClick={() => eliminarPermiso(p.modulo)}
                >
                  Eliminar
                </button>
              </div>
            ))}

            {/* Añadir permiso */}
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Módulo"
                value={nuevoPermiso.modulo}
                onChange={(e) =>
                  setNuevoPermiso({ ...nuevoPermiso, modulo: e.target.value })
                }
              />

              <input
                className="input flex-1"
                placeholder="Acciones (ver,crear,editar,eliminar)"
                value={nuevoPermiso.acciones}
                onChange={(e) =>
                  setNuevoPermiso({
                    ...nuevoPermiso,
                    acciones: e.target.value,
                  })
                }
              />

              <button
                type="button"
                className="btn-primary"
                onClick={agregarPermiso}
              >
                +
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            {id ? "Guardar cambios" : "Crear rol"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
