import React, { useState } from "react";
import { useMaestrosStore } from "../../store/maestrosStore";
import { useNavigate } from "react-router-dom";

export default function DepartamentoForm() {
  const navigate = useNavigate();
  const { crearDepartamento } = useMaestrosStore();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearDepartamento(form);
    navigate("/maestros/departamentos");
  };

  return (
    <div>
      <h2>Nuevo Departamento</h2>

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
