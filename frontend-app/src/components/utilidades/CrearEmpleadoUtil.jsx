import React, { useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";

export default function CrearEmpleadoUtil() {
  const { crearEmpleado } = useEmpleadosStore();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    password: "",
    rol: "Empleado",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await crearEmpleado(form);
      alert("Empleado creado correctamente");

      setForm({
        nombre: "",
        apellidos: "",
        usuario: "",
        password: "",
        rol: "Empleado",
      });
    } catch (err) {
      alert("Error creando empleado");
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold" style={{ color: "#1F3A5F" }}>
        Crear nuevo empleado
      </h2>

      <div className="space-y-2">
        <label className="font-semibold">Nombre</label>
        <input
          type="text"
          name="nombre"
          className="input"
          value={form.nombre}
          onChange={handleChange}
        />

        <label className="font-semibold">Apellidos</label>
        <input
          type="text"
          name="apellidos"
          className="input"
          value={form.apellidos}
          onChange={handleChange}
        />

        <label className="font-semibold">Usuario (DNI)</label>
        <input
          type="text"
          name="usuario"
          className="input"
          value={form.usuario}
          onChange={handleChange}
        />

        <label className="font-semibold">Contraseña</label>
        <input
          type="password"
          name="password"
          className="input"
          value={form.password}
          onChange={handleChange}
        />

        <label className="font-semibold">Rol</label>
        <select
          name="rol"
          className="input"
          value={form.rol}
          onChange={handleChange}
        >
          <option value="Empleado">Empleado</option>
          <option value="Apoderado">Apoderado</option>
          <option value="Administrador">Administrador</option>
          <option value="Direccion">Dirección</option>
        </select>

        <button className="btn-primary w-full" onClick={handleSubmit}>
          Crear empleado
        </button>
      </div>
    </div>
  );
}
