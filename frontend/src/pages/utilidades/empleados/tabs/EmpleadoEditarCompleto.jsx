import React, { useState, useEffect } from "react";

export default function EmpleadoEditarCompleto({ empleadoId, formData, setFormData }) {
  const [foto, setFoto] = useState(null);
  const [modulosDisponibles, setModulosDisponibles] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState({});

  // ---------------------------------------------------------
  // Cargar módulos y permisos desde el backend
  // ---------------------------------------------------------
  useEffect(() => {
    const cargarDatos = async () => {
      const resMod = await fetch(`${import.meta.env.VITE_API_URL}/modulos/listar`);
      const listaModulos = await resMod.json();
      setModulosDisponibles(listaModulos);

      const resPerm = await fetch(`${import.meta.env.VITE_API_URL}/modulos/permisos`);
      const listaPermisos = await resPerm.json();
      setPermisosDisponibles(listaPermisos);
    };

    cargarDatos();
  }, []);

  // ---------------------------------------------------------
  // Actualizar campos normales
  // ---------------------------------------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------------------------------------
  // Toggle módulos visibles
  // ---------------------------------------------------------
  const toggleModulo = (modulo) => {
    const actuales = formData.modulos || [];
    const nuevos = actuales.includes(modulo)
      ? actuales.filter((m) => m !== modulo)
      : [...actuales, modulo];

    setFormData({ ...formData, modulos: nuevos });
  };

  // ---------------------------------------------------------
  // Toggle permisos por módulo
  // ---------------------------------------------------------
  const togglePermiso = (modulo, permiso) => {
    const actuales = formData.permisos || {};
    const permisosModulo = actuales[modulo] || [];

    const nuevos = permisosModulo.includes(permiso)
      ? permisosModulo.filter((p) => p !== permiso)
      : [...permisosModulo, permiso];

    setFormData({
      ...formData,
      permisos: {
        ...actuales,
        [modulo]: nuevos,
      },
    });
  };

  // ---------------------------------------------------------
  // Guardar cambios
  // ---------------------------------------------------------
  const handleGuardar = async () => {
    const fd = new FormData();
    fd.append("data", JSON.stringify(formData));
    if (foto) fd.append("foto", foto);

    await fetch(`${import.meta.env.VITE_API_URL}/empleados/editar-completo/${empleadoId}`, {
      method: "PUT",
      body: fd,
    });

    alert("Empleado actualizado");
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded shadow">

      <h2 className="text-xl font-bold">Edición completa del empleado</h2>

      {/* DATOS PERSONALES */}
      <div className="grid grid-cols-2 gap-4">
        <input name="nombre" value={formData.nombre || ""} onChange={handleChange} placeholder="Nombre" />
        <input name="apellidos" value={formData.apellidos || ""} onChange={handleChange} placeholder="Apellidos" />
        <input name="dni" value={formData.dni || ""} onChange={handleChange} placeholder="DNI" />
        <input name="telefono" value={formData.telefono || ""} onChange={handleChange} placeholder="Teléfono" />
        <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email personal" />
        <input name="direccion" value={formData.direccion || ""} onChange={handleChange} placeholder="Dirección" />
      </div>

      {/* DATOS LABORALES */}
      <h3 className="font-bold mt-4">Datos laborales</h3>
      <div className="grid grid-cols-2 gap-4">
        <input name="departamento" value={formData.departamento || ""} onChange={handleChange} placeholder="Departamento" />
        <input name="seccion" value={formData.seccion || ""} onChange={handleChange} placeholder="Sección" />
        <input name="cargo" value={formData.cargo || ""} onChange={handleChange} placeholder="Cargo" />
        <input name="fecha_alta" value={formData.fecha_alta || ""} onChange={handleChange} placeholder="Fecha alta" />
        <input name="fecha_baja" value={formData.fecha_baja || ""} onChange={handleChange} placeholder="Fecha baja" />
      </div>

      {/* ROL */}
      <h3 className="font-bold mt-4">Rol</h3>
      <input name="rol_id" value={formData.rol_id || ""} onChange={handleChange} placeholder="Rol ID" />

      {/* MÓDULOS */}
      <h3 className="font-bold mt-4">Módulos visibles</h3>
      <div className="grid grid-cols-3 gap-2">
        {modulosDisponibles.map((mod) => (
          <label key={mod} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.modulos?.includes(mod) || false}
              onChange={() => toggleModulo(mod)}
            />
            {mod}
          </label>
        ))}
      </div>

      {/* PERMISOS */}
      <h3 className="font-bold mt-4">Permisos por módulo</h3>
      {Object.keys(permisosDisponibles).map((modulo) => (
        <div key={modulo} className="border p-3 rounded mb-3">
          <p className="font-semibold">{modulo}</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {permisosDisponibles[modulo].map((permiso) => (
              <label key={permiso} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.permisos?.[modulo]?.includes(permiso) || false}
                  onChange={() => togglePermiso(modulo, permiso)}
                />
                {permiso}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* FOTO */}
      <h3 className="font-bold mt-4">Foto</h3>
      <input type="file" onChange={(e) => setFoto(e.target.files[0])} />

      {/* GUARDAR */}
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleGuardar}
      >
        Guardar cambios
      </button>
    </div>
  );
}
