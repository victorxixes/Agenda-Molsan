import React, { useState } from "react";
import { useEmpleadosStore } from "../../store/empleadosStore";
import "../../css/modals.css";
import Modal from "../ui/Modal.jsx";

export default function EmpleadoModal({ empleado, onClose }) {
  const { crearEmpleado, actualizarEmpleado } = useEmpleadosStore();

  const [form, setForm] = useState(
    empleado || {
      nombre: "",
      apellidos: "",
      usuario: "",
      email: "",
      telefono: "",
      rol: "",
      departamento: "",
      observaciones: "",
      foto: null,
      fotoFile: null
    }
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (key !== "fotoFile") data.append(key, form[key]);
    });

    if (form.fotoFile) {
      data.append("foto", form.fotoFile);
    }

    if (empleado) {
      await actualizarEmpleado(empleado.id, data);
    } else {
      await crearEmpleado(data);
    }

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
            src={form.foto || "/img/user-default.png"}
            className="h-28 w-28 rounded-full object-cover border shadow"
            alt="Foto empleado"
          />
        </div>

        <input type="file" accept="image/*"
          className="input"
          onChange={(e) => {
            const file = e.target.files[0];
            setForm({ ...form, fotoFile: file });
          }}
        />

        <input className="input" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input className="input" name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
        <input className="input" name="usuario" placeholder="Usuario" value={form.usuario} onChange={handleChange} />
        <input className="input" name="email" placeholder="Email empresa" value={form.email} onChange={handleChange} />
        <input className="input" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input className="input" name="rol" placeholder="Rol" value={form.rol} onChange={handleChange} />
        <input className="input" name="departamento" placeholder="Departamento" value={form.departamento} onChange={handleChange} />
        <textarea className="input" name="observaciones" placeholder="Observaciones" value={form.observaciones} onChange={handleChange} />

        <button className="btn-primary w-full" onClick={handleSubmit}>
          Guardar
        </button>
      </div>
    </Modal>
  );
}
