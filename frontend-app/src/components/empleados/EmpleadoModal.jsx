import { useState } from "react";
import Modal from "../ui/Modal.jsx";

export default function EmpleadoModal({ empleado, onClose, onSave }) {
  const [form, setForm] = useState(
    empleado || {
      nombre: "",
      apellidos: "",
      telefono: "",
      email_empresa: "",
      rol: "",
      departamento_id: "",
      observaciones: "",
      fotoFile: null,
    }
  );

  const API = "https://agenda-intranet-backend.onrender.com";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const data = { ...form };
    delete data.fotoFile;

    const res = await fetch(
      `${API}/empleados/${empleado ? empleado.id : ""}`,
      {
        method: empleado ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const saved = await res.json();

    if (form.fotoFile) {
      const fd = new FormData();
      fd.append("archivo", form.fotoFile);
      await fetch(`${API}/empleados/${saved.id}/foto`, {
        method: "POST",
        body: fd,
      });
    }

    onSave && onSave();
    onClose();
  };

  return (
    <Modal
      title={empleado ? "Editar empleado" : "Nuevo empleado"}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <img
            src={form.foto || "/placeholder.png"}
            className="h-28 w-28 rounded-full object-cover border shadow"
            alt="Foto empleado"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          className="input"
          onChange={(e) =>
            setForm({ ...form, fotoFile: e.target.files[0] })
          }
        />

        <input
          className="input"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          className="input"
          name="apellidos"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={handleChange}
        />
        <input
          className="input"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          className="input"
          name="email_empresa"
          placeholder="Email empresa"
          value={form.email_empresa}
          onChange={handleChange}
        />
        <input
          className="input"
          name="rol"
          placeholder="Rol"
          value={form.rol}
          onChange={handleChange}
        />
        <textarea
          className="input"
          name="observaciones"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={handleChange}
        />

        <button className="btn-primary w-full" onClick={handleSubmit}>
          Guardar
        </button>
      </div>
    </Modal>
  );
}
