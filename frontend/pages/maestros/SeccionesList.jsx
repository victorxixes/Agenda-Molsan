import React, { useEffect } from "react";
import { useMaestrosStore } from "../../store/maestrosStore";
import { Link } from "react-router-dom";

export default function SeccionesList() {
  const { secciones, cargarSecciones } = useMaestrosStore();

  useEffect(() => {
    cargarSecciones();
  }, []);

  return (
    <div>
      <h2>Secciones</h2>

      <Link to="/maestros/secciones/nuevo">Nueva sección</Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
          </tr>
        </thead>

        <tbody>
          {secciones.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.nombre}</td>
              <td>{s.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
