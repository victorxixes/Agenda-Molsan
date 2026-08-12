import { useEffect, useState } from "react";
import axios from "axios";

export default function EditarEmpleado({ empleadoId }) {
  const API = "https://agenda-intranet-b.onrender.com";

  const [form, setForm] = useState({});
  const [departamentos, setDepartamentos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargos, setCargos] = useState([]);

  // 🔥 Limpia valores "string", null, undefined
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

  // 🔥 Cargar datos del empleado
  useEffect(() => {
    axios.get(`${API}/empleados/${empleadoId}`).then((res) => {
      setForm(limpiar(res.data));
    });
  }, [empleadoId]);

  // 🔥 Cargar listas para selects
  useEffect(() => {
    fetch(`${API}/empleados/departamentos`)
      .then((r) => r.json())
      .then(setDepartamentos);

    fetch(`${API}/empleados/secciones`)
      .then((r) => r.json())
      .then(setSecciones);

    fetch(`${API}/empleados/cargos`)
      .then((r) => r.json())
      .then(setCargos);
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const guardar = () => {
    axios
      .put(`${API}/empleados/${empleadoId}`, form)
      .then(() => alert("Empleado actualizado"))
      .catch(() => alert("Error al actualizar"));
  };

  if (!form.id) return <div>Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Editar empleado</h2>

      {/* 🔥 Selects bonitos */}
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

      {/* 🔥 Campos del empleado (EXCLUYENDO los IDs) */}
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(form)
          .filter(
            (key) =>
              !["seccion_id", "departamento_id", "cargo_id"].includes(key)
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
