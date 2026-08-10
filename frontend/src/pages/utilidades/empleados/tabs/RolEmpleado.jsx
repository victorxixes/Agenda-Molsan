import React from "react";

export default function RolEmpleado({ formData, setFormData }) {

  if (!formData) return <p>Cargando rol...</p>;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      rol: e.target.value,
    });
  };

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold mb-2">Rol del empleado</h2>
      <p className="text-sm text-gray-600 mb-4">
        Selecciona el rol que tendrá este empleado dentro del sistema.
      </p>

      <div className="space-y-3">

        {/* Rol: Administrador */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="rol"
            value="admin"
            checked={formData.rol === "admin"}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span className="text-sm">Administrador</span>
        </label>

        {/* Rol: Gestor */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="rol"
            value="gestor"
            checked={formData.rol === "gestor"}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span className="text-sm">Gestor</span>
        </label>

        {/* Rol: Apoderado */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="rol"
            value="apoderado"
            checked={formData.rol === "apoderado"}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span className="text-sm">Apoderado</span>
        </label>

        {/* Rol: Usuario básico */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="rol"
            value="usuario"
            checked={formData.rol === "usuario"}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span className="text-sm">Usuario básico</span>
        </label>

      </div>
    </div>
  );
}
