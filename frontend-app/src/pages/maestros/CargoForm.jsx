import React, { useState } from "react";
import { useMaestrosStore } from "../../store/maestrosStore";
import { useNavigate } from "react-router-dom";

export default function CargoForm() {
  const navigate = useNavigate();
  const { crearCargo } = useMaestrosStore();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearCargo(form);
    navigate("/maestros/cargos");
  };

  return (
    <div>
      <h2>Nuevo Cargo</h2>

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
