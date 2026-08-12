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

  const cargar = () => {
    axios.get(`${API}/maestros/departamentos`).then(r => setDepartamentos(r.data));
    axios.get(`${API}/maestros/secciones`).then(r => setSecciones(r.data));
    axios.get(`${API}/maestros/cargos`).then(r => setCargos(r.data));
  };

  useEffect(() => {
    cargar();
  }, []);

  const crear = (tipo, nombre) => {
    if (!nombre.trim()) return;
    axios.post(`${API}/maestros/${tipo}`, { nombre })
      .then(cargar);
  };

  const editar = (tipo, id, nombre) => {
    axios.put(`${API}/maestros/${tipo}/${id}`, { nombre })
      .then(cargar);
  };

  const eliminar = (tipo, id) => {
    axios.delete(`${API}/maestros/${tipo}/${id}`)
      .then(cargar);
  };

  const renderLista = (titulo, tipo, items, nuevo, setNuevo) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-2">{titulo}</h2>

      <ul className="mb-4 space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-3 border-b pb-1">
            <input
              className="border px-2 py-1 flex-1"
              defaultValue={item.nombre}
              onBlur={(e) => editar(tipo, item.id, e.target.value)}
            />
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => eliminar(tipo, item.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          className="border px-2 py-1 flex-1"
          placeholder={`Nuevo ${titulo.toLowerCase()}`}
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={() => crear(tipo, nuevo)}
        >
          Crear
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administración de Maestros</h1>

      {renderLista("Departamentos", "departamentos", departamentos, nuevoDep, setNuevoDep)}
      {renderLista("Secciones", "secciones", secciones, nuevoSec, setNuevoSec)}
      {renderLista("Cargos", "cargos", cargos, nuevoCargo, setNuevoCargo)}
    </div>
  );
}
