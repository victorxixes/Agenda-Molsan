import React, { useState } from "react";
import { useIntranetStore } from "../../store/intranetStore";

export default function NoticiasForm() {
  const { crearNoticia } = useIntranetStore();

  const [form, setForm] = useState({
    fuente: "",
    texto: "",
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  await crearNoticia({
    titulo: form.fuente,
    descripcion: form.texto
  });

  setForm({ fuente: "", texto: "" });
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        className="border p-1 rounded"
        placeholder="Fuente"
        value={form.fuente}
        onChange={(e) => setForm({ ...form, fuente: e.target.value })}
      />

      <textarea
        className="border p-1 rounded"
        placeholder="Texto"
        value={form.texto}
        onChange={(e) => setForm({ ...form, texto: e.target.value })}
      />

      <button className="bg-blue-600 text-white px-3 py-1 rounded">
        Crear noticia
      </button>
    </form>
  );
}
