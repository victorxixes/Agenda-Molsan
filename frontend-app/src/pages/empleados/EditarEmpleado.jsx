import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function EditarEmpleado({ empleadoId }) {
  const [form, setForm] = useState({});
  const [departamentos, setDepartamentos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargos, setCargos] = useState([]);

  // Limpia valores corruptos del backend
  const limpiar = (obj) => {
    const limpio = { ...obj };
    for (const key in limpio) {
      if (
        limpio[key] === "string" ||
        limpio[key] === null ||
        limpio[key] === "null" ||
        limpio[key] === undefined
      ) {
        limpio[key] = "";
      }
    }
    return limpio;
  };

  // Cargar datos del empleado
  useEffect(() => {
    axios.get(`/empleados/${empleadoId}`).then((res) => {
      setForm(limpiar(res.data));
    });
  }, [empleadoId]);

  // Cargar listas para selects
  useEffect(() => {
    axios.get(`/empleados/departamentos`).then((r) => setDepartamentos(r.data));
    axios.get(`/empleados/secciones`).then((r) => setSecciones(r.data));
    axios.get(`/empleados/cargos`).then((r) => setCargos(r.data));
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const guardar = () => {
    const payload = {
      ...form,
      seccion_id: Number(form.seccion_id) || null,
      departamento_id: Number(form.departamento_id) || null,
      cargo_id: Number(form.cargo_id) || null,
    };

    axios
      .put(`/empleados/${empleadoId}`, payload)
      .then(() => alert("Empleado actualizado"))
      .catch(() => alert("Error al actualizar"));
  };

  if (!form.id) return <div>Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Editar empleado</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* SECCIÓN */}
        <div>
          <label className="font-semibold">Sección</label>
          <select
            value={form.seccion_id}
            onChange={(e) => handleChange("seccion_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar sección</option>
            {secciones.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* DEPARTAMENTO */}
        <div>
          <label className="font-semibold">Departamento</label>
          <select
            value={form.departamento_id}
            onChange={(e) => handleChange("departamento_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar departamento</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* CARGO */}
        <div>
          <label className="font-semibold">Cargo</label>
          <select
            value={form.cargo_id}
            onChange={(e) => handleChange("cargo_id", e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Seleccionar cargo</option>
            {cargos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Campos del empleado (excepto IDs) */}
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(form)
          .filter(
            (key) =>
              !["seccion_id", "departamento_id", "cargo_id", "id"].includes(key)
          )
          .map((key) => (
            <div key={key}>
              <label className="font-semibold">{key}</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={form[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
      </div>

      <button
        onClick={guardar}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </div>
  );
}
