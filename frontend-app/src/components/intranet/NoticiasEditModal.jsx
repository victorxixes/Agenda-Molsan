import { useState, useEffect } from "react";
import ModalForm from "../ui/ModalForm";

export default function NoticiasEditModal({ open, onClose, noticia, onSave }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: ""
  });

  useEffect(() => {
    if (noticia) {
      setForm({
        titulo: noticia.titulo,
        descripcion: noticia.descripcion
      });
    }
  }, [noticia]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSave({
      ...noticia,
      ...form
    });
    onClose();
  };

  return (
    <ModalForm open={open} onClose={onClose} title="Editar noticia">
      <div className="flex flex-col gap-4">

        <div>
          <label className="text-sm text-gray-300">Título</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="input w-full h-28"
          />
        </div>

        <button
          className="btn-primary w-full mt-4"
          onClick={handleSubmit}
        >
          Guardar cambios
        </button>

      </div>
    </ModalForm>
  );
}
