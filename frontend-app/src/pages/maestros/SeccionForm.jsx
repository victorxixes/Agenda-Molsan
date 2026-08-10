import React, { useState } from "react";
import { useMaestrosStore } from "../../store/maestrosStore";
import { useNavigate } from "react-router-dom";

export default function SeccionForm() {
  const navigate = useNavigate();
  const { crearSeccion } = useMaestrosStore();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearSeccion(form);
    navigate("/maestros/secciones");
  };

  return (
    <div>
      <h2>Nueva Sección</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <input
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
