import React, { useState } from "react";
import { useIntranetStore } from "../../store/intranetStore";

export default function CrearNoticiaUtil() {
  const crearNoticia = useIntranetStore((s) => s.crearNoticia);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await crearNoticia(form);

    setForm({ titulo: "", descripcion: "" });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Crear noticia</h3>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 border rounded"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />

        <textarea
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Crear noticia
        </button>
      </form>
    </div>
  );
}
