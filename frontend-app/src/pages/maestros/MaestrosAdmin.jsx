import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://agenda-intranet-b.onrender.com";

export default function MaestrosAdmin() {
  const [departamentos, setDepartamentos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [nuevoDep, setNuevoDep] = useState("");
  const [nuevoSec, setNuevoSec] = useState("");
  const [nuevoCargo, setNuevoCargo] = useState("");

  useEffect(() => {
    axios.get(`${API}/maestros/departamentos`).then(r => setDepartamentos(r.data));
    axios.get(`${API}/maestros/secciones`).then(r => setSecciones(r.data));
    axios.get(`${API}/maestros/cargos`).then(r => setCargos(r.data));
  }, []);

  const crear = (tipo, nombre) => {
    if (!nombre.trim()) return;

    axios.post(`${API}/maestros/${tipo}`, { nombre })
      .then(() => window.location.reload());
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">Administración de Maestros</h1>

      {/* DEPARTAMENTOS */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Departamentos</h2>

        <ul className="mb-4">
          {departamentos.map(d => (
            <li key={d.id} className="border-b py-1">{d.nombre}</li>
          ))}
        </ul>

        <input
          className="border px-2 py-1 mr-2"
          placeholder="Nuevo departamento"
          value={nuevoDep}
          onChange={e => setNuevoDep(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => crear("departamentos", nuevoDep)}
        >
          Crear
        </button>
      </div>

      {/* SECCIONES */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Secciones</h2>

        <ul className="mb-4">
          {secciones.map(s => (
            <li key={s.id} className="border-b py-1">{s.nombre}</li>
          ))}
        </ul>

        <input
          className="border px-2 py-1 mr-2"
          placeholder="Nueva sección"
          value={nuevoSec}
          onChange={e => setNuevoSec(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => crear("secciones", nuevoSec)}
        >
          Crear
        </button>
      </div>

      {/* CARGOS */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Cargos</h2>

        <ul className="mb-4">
          {cargos.map(c => (
            <li key={c.id} className="border-b py-1">{c.nombre}</li>
          ))}
        </ul>

        <input
          className="border px-2 py-1 mr-2"
          placeholder="Nuevo cargo"
          value={nuevoCargo}
          onChange={e => setNuevoCargo(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => crear("cargos", nuevoCargo)}
        >
          Crear
        </button>
      </div>
    </div>
  );
}
