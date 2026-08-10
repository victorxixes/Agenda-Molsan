import React, { useEffect } from "react";
import { useMaestrosStore } from "../../store/maestrosStore";
import { Link } from "react-router-dom";

export default function DepartamentosList() {
  const { departamentos, cargarDepartamentos } = useMaestrosStore();

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  return (
    <div>
      <h2>Departamentos</h2>

      <Link to="/maestros/departamentos/nuevo">Nuevo departamento</Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>
          {departamentos.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.nombre}</td>
              <td>{d.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
