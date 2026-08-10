import React, { useEffect } from "react";
import { useMaestrosStore } from "../../store/maestrosStore";
import { Link } from "react-router-dom";

export default function CargosList() {
  const { cargos, cargarCargos } = useMaestrosStore();

  useEffect(() => {
    cargarCargos();
  }, []);

  return (
    <div>
      <h2>Cargos</h2>

      <Link to="/maestros/cargos/nuevo">Nuevo cargo</Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>
          {cargos.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
