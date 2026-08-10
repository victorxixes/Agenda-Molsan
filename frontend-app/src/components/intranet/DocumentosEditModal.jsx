import { useState, useEffect } from "react";
import ModalForm from "../ui/ModalForm";

export default function DocumentosEditModal({ open, onClose, documento, onSave }) {
  const [form, setForm] = useState({
    titulo: "",
    concepto: "",
    fichero: ""
  });

  useEffect(() => {
    if (documento) {
      setForm({
        titulo: documento.titulo,
        concepto: documento.concepto,
        fichero: documento.fichero
      });
    }
  }, [documento]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSave({
      ...documento,
      ...form
    });
    onClose();
  };

  return (
    <ModalForm open={open} onClose={onClose} title="Editar documento">
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
          <label className="text-sm text-gray-300">Concepto</label>
          <input
            name="concepto"
            value={form.concepto}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">URL del fichero</label>
          <input
            name="fichero"
            value={form.fichero}
            onChange={handleChange}
            className="input w-full"
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
